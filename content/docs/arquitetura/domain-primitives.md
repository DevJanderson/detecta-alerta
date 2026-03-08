---
title: 'Arquitetura — Domain Primitives'
description: 'Result type, Value Objects com tryCreate e validação reativa com useVoField.'
order: 2
---

# Arquitetura — Domain Primitives

Domain primitives são os blocos fundamentais de tipagem e validação do projeto. Vivem em `layers/base/shared/domain/` e `layers/base/app/utils/`.

## Result

Discriminated union leve para representar sucesso ou falha **sem exceções**.

```typescript
import { ok, fail } from '#shared/domain/result'
import type { Result } from '#shared/domain/result'

// Sucesso
const result = ok(42) // Result<number, never>

// Falha
const error = fail('Dados inválidos') // Result<never, string>

// Narrowing
if (result.ok) {
  console.log(result.value) // 42
} else {
  console.log(result.error) // string
}
```

### Helpers

| Função                       | Descrição                                               |
| ---------------------------- | ------------------------------------------------------- |
| `ok(value)`                  | Cria Result de sucesso                                  |
| `fail(error)`                | Cria Result de falha                                    |
| `combineResults(results)`    | Combina múltiplos Results — falha se qualquer um falhar |
| `unwrap(result)`             | Extrai valor ou lança erro                              |
| `unwrapOr(result, fallback)` | Extrai valor ou retorna fallback                        |

### Quando usar

| Cenário                                | Usar Result?                    |
| -------------------------------------- | ------------------------------- |
| Use case no server (lógica de negócio) | ✅ Sim                          |
| Factory `tryCreate*()` de Value Object | ✅ Sim                          |
| Store action (fetch de API)            | ❌ Não — usar `withStoreAction` |
| Validação simples de campo             | ❌ Não — usar Zod direto        |

### Por que não classes?

O projeto rejeitou a abordagem DDD clássica com `class Result<T>` porque:

- VOs já usavam padrão funcional (factory + `Object.freeze`) — classes criariam dois estilos
- Discriminated unions têm narrowing nativo do TypeScript (sem `.isOk()`)
- Sem herança, sem métodos — apenas funções puras composáveis

## Value Objects

Value Objects encapsulam regras de validação e formatação de dados do domínio. Seguem o padrão funcional:

```typescript
// Factory que lança exceção (uso em código confiável)
const email = createEmail('user@example.com')

// Factory que retorna Result (uso em formulários e validação)
const result = tryCreateEmail('invalido')
if (!result.ok) {
  console.log(result.error) // 'Formato de email inválido'
}
```

### Padrão de implementação

```typescript
// 1. Tipo branded (opaco)
export type Email = string & { readonly __brand: unique symbol }

// 2. Factory com throw (uso interno)
export function createEmail(value: string): Email {
  const trimmed = value.trim().toLowerCase()
  if (!isValidEmail(trimmed)) throw new Error('Email inválido')
  return trimmed as Email
}

// 3. Factory com Result (uso em formulários)
export function tryCreateEmail(value: string): Result<Email> {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return fail('Email é obrigatório')
  if (!isValidEmail(trimmed)) return fail('Formato de email inválido')
  return ok(trimmed as Email)
}

// 4. Funções puras associadas
export function emailEquals(a: Email, b: Email): boolean {
  return a === b
}
```

### VOs existentes

| Value Object           | Local                                              | Uso                                                |
| ---------------------- | -------------------------------------------------- | -------------------------------------------------- |
| `Email`                | `base/app/utils/email.ts`                          | Validação de formato, comparação                   |
| `CodigoIBGE`           | `base/app/utils/codigo-ibge.ts`                    | Validação 7 dígitos, extração UF                   |
| `Coordenadas`          | `base/app/utils/coordenadas.ts`                    | Ranges válidos, bounds Brasil, distância haversine |
| `SemanaEpidemiologica` | `meu-municipio/app/utils/semana-epidemiologica.ts` | Cálculo padrão brasileiro (domingo–sábado)         |

### Onde posicionar

VOs são funções puras → vão em `utils/` (não `composables/`).

- **Cross-layer** (usado por 2+ layers) → `layers/base/app/utils/`
- **Feature-specific** → `layers/{feature}/app/utils/`

## useVoField — Validação Reativa

Composable que conecta `tryCreate*()` a formulários Vue reativos:

```typescript
const input = ref('')
const { isValid, error, value } = useVoField(input, tryCreateEmail)

// Template
// <Input v-model="input" />
// <span v-if="error">{{ error }}</span>
// <Button :disabled="!isValid" />
```

### API

```typescript
function useVoField<T>(
  input: Ref<string> | ComputedRef<string>,
  factory: (value: string) => Result<T>
): {
  isValid: ComputedRef<boolean>
  error: ComputedRef<string | null>
  value: ComputedRef<T | null>
}
```

**Vantagem**: a mesma regra de validação do `tryCreate` é reutilizada no client (formulário) e no server (endpoint BFF). Uma única fonte de verdade.

## Domain Models

Domain Models enriquecem DTOs da API com lógica de negócio. Mesmo padrão funcional dos VOs:

```typescript
// Factory + Object.freeze
const model = createUserModel(authUserDTO)

// Campos derivados
model.initials // "JS"
model.isAdmin // true
model.permissions // ["dashboard.view", "reports.export"]

// Funções puras associadas
userHasPermission(model, 'dashboard.view') // true
userHasAnyGroup(model, ['admin', 'editor']) // true
```

### Models existentes

| Model       | Local                          | Enriquece                                               |
| ----------- | ------------------------------ | ------------------------------------------------------- |
| `UserModel` | `auth/app/utils/user-model.ts` | `AuthUser` DTO → initials, permissions, groups, isAdmin |

### Quando criar novo model

Quando um DTO da API precisa de lógica derivada (cálculos, formatações, verificações) que aparece em 2+ lugares. Não criar para DTOs usados apenas para exibição direta.
