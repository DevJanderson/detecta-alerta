---
title: 'Domain Primitives'
description: 'Como usar Result, Value Objects e useVoField — ferramentas de validação e tipagem do projeto.'
order: 2
---

# Domain Primitives

Domain primitives são tipos especiais que garantem que os dados estão sempre válidos. Em vez de usar `string` para tudo, criamos tipos como `Email` que só existem se o valor for válido.

Eles vivem em `layers/base/shared/domain/` e `layers/base/app/utils/`.

## Result — Sucesso ou Falha sem exceções

`Result` é um tipo que representa duas possibilidades: **deu certo** ou **deu errado**. Em vez de usar `try/catch`, você verifica `.ok`:

```typescript
import { ok, fail } from '#shared/domain/result'
import type { Result } from '#shared/domain/result'

// Criar um resultado de sucesso
const sucesso = ok(42) // ✅ Result com valor 42

// Criar um resultado de falha
const falha = fail('Dados inválidos') // ❌ Result com erro

// Verificar o resultado
if (sucesso.ok) {
  console.log(sucesso.value) // 42
} else {
  console.log(sucesso.error) // nunca chega aqui
}
```

O TypeScript entende automaticamente — dentro do `if (result.ok)`, ele sabe que `result.value` existe. Dentro do `else`, ele sabe que `result.error` existe.

### Funções auxiliares

| Função                       | O que faz                                            | Exemplo                    |
| ---------------------------- | ---------------------------------------------------- | -------------------------- |
| `ok(valor)`                  | Cria resultado de sucesso                            | `ok(42)`                   |
| `fail(erro)`                 | Cria resultado de falha                              | `fail('Email inválido')`   |
| `combineResults(lista)`      | Combina vários Results — falha se qualquer um falhar | `combineResults([r1, r2])` |
| `unwrap(result)`             | Pega o valor ou lança erro se falhou                 | `unwrap(result)`           |
| `unwrapOr(result, fallback)` | Pega o valor ou retorna o fallback                   | `unwrapOr(result, 0)`      |

### Onde usar e onde NÃO usar

| Situação                               | Usar Result? | Usar o quê?       |
| -------------------------------------- | ------------ | ----------------- |
| Use case no server (ex: login)         | ✅ Sim       | `ok()` / `fail()` |
| Factory `tryCreate*()` de Value Object | ✅ Sim       | `ok()` / `fail()` |
| Action de store (fetch de API)         | ❌ Não       | `withStoreAction` |
| Validação simples de campo             | ❌ Não       | Zod direto        |

## Value Objects — Dados que se validam sozinhos

Um Value Object (VO) é um tipo que **garante que o dado é válido no momento da criação**. Por exemplo, um `Email` só existe se o formato for correto.

Cada VO tem duas formas de criar:

```typescript
import { createEmail, tryCreateEmail } from '~/utils/email'

// Forma 1: createEmail — lança erro se inválido (usar em código interno)
const email = createEmail('user@example.com') // ✅ Email válido
const email2 = createEmail('invalido') // 💥 throw Error

// Forma 2: tryCreateEmail — retorna Result (usar em formulários)
const result = tryCreateEmail('invalido')
if (!result.ok) {
  console.log(result.error) // 'Formato de email inválido'
}
```

### Como criar um Value Object novo

Siga esta receita (exemplo com Email):

```typescript
// layers/base/app/utils/email.ts

// 1. Tipo especial (o TypeScript trata diferente de string comum)
export type Email = string & { readonly __brand: unique symbol }

// 2. Factory que lança erro (para código interno confiável)
export function createEmail(value: string): Email {
  const trimmed = value.trim().toLowerCase()
  if (!isValidEmail(trimmed)) throw new Error('Email inválido')
  return trimmed as Email
}

// 3. Factory que retorna Result (para formulários e validação)
export function tryCreateEmail(value: string): Result<Email> {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return fail('Email é obrigatório')
  if (!isValidEmail(trimmed)) return fail('Formato de email inválido')
  return ok(trimmed as Email)
}

// 4. Funções auxiliares
export function emailEquals(a: Email, b: Email): boolean {
  return a === b
}
```

### VOs existentes no projeto

| Value Object           | Arquivo                                            | Uso                                            |
| ---------------------- | -------------------------------------------------- | ---------------------------------------------- |
| `Email`                | `base/app/utils/email.ts`                          | Validação de formato, normalização, comparação |
| `SemanaEpidemiologica` | `meu-municipio/app/utils/semana-epidemiologica.ts` | Cálculo padrão brasileiro (domingo–sábado)     |

### Onde colocar

VOs são funções puras → vão em `utils/` (nunca em `composables/`):

- Usado por 2+ layers → `layers/base/app/utils/`
- Só uma feature usa → `layers/{feature}/app/utils/`

## useVoField — Validação em tempo real nos formulários

`useVoField` conecta um `tryCreate*()` a um campo de formulário Vue. Conforme o usuário digita, a validação roda automaticamente:

```typescript
// No componente Vue
const input = ref('')
const { isValid, error, value } = useVoField(input, tryCreateEmail)

// isValid → true/false conforme o usuário digita
// error → null ou mensagem de erro (ex: 'Formato de email inválido')
// value → Email válido ou null
```

```vue
<template>
  <Input v-model="input" placeholder="seu@email.com" />
  <span v-if="error" class="text-danger-500">{{ error }}</span>
  <Button :disabled="!isValid">Salvar</Button>
</template>
```

**Vantagem**: a mesma regra do `tryCreateEmail` é usada tanto no formulário (client) quanto no endpoint BFF (server). Uma única regra, dois lugares.

## Domain Models — DTOs enriquecidos

Quando um dado da API precisa de campos calculados (que não vêm da API), criamos um Domain Model:

```typescript
// Exemplo: UserModel transforma o DTO da API em algo mais útil
const model = createUserModel(authUserDTO)

model.initials // "JS" (calculado do nome)
model.isAdmin // true (calculado dos grupos)
model.permissions // ["dashboard.view"] (extraído dos grupos)

// Funções para verificar permissões
userHasPermission(model, 'dashboard.view') // true
```

### Quando criar um Domain Model?

- ✅ Quando precisa de campos calculados usados em 2+ lugares
- ❌ Quando o DTO da API é usado apenas para exibir na tela (não precisa de model)
