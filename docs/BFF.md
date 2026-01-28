# BFF (Backend for Frontend) - Guia Simples

## O que é BFF?

**BFF = Seu servidor fazendo o "meio de campo" entre o browser e a API externa.**

```
SEM BFF (direto):
┌─────────┐                      ┌─────────────┐
│ Browser │ ───────────────────► │ API Externa │
└─────────┘                      └─────────────┘
   O browser fala direto com a API externa
   (token JWT visível no DevTools)


COM BFF:
┌─────────┐      ┌─────────────┐      ┌─────────────┐
│ Browser │ ───► │ Seu Server  │ ───► │ API Externa │
└─────────┘      │ (BFF/Nuxt)  │      └─────────────┘
                 └─────────────┘
   O browser fala com SEU servidor
   Seu servidor fala com a API externa
   (token JWT fica ESCONDIDO no servidor)
```

---

## Por que usar BFF?

### Problema: Token JWT exposto

Sem BFF, qualquer pessoa pode ver o token no navegador:

```
1. Abre DevTools (F12)
2. Vai em Network
3. Clica em qualquer request
4. Vê o header: "Authorization: Bearer eyJhbG..."
5. Copia o token
6. Usa em qualquer lugar (Postman, curl, etc)
```

**Isso é um problema de segurança grave para dados sensíveis.**

### Solução: BFF com cookies httpOnly

Com BFF, o token fica invisível:

```
1. Abre DevTools (F12)
2. Vai em Network
3. Clica em qualquer request
4. Vê apenas: "Cookie: [não mostra o valor]"
5. Não consegue copiar o token
6. Token só funciona no seu site
```

---

## Analogia: Porteiro do Prédio

Imagine que a **API Sinapse** é um **prédio com informações importantes**.

### Sem BFF (Acesso Direto)

```
Você tem a chave do prédio no bolso (token no browser).
Qualquer pessoa pode ver sua chave.
Se roubarem sua chave, entram no prédio.
```

### Com BFF (Porteiro)

```
O porteiro (seu servidor) guarda a chave no cofre.
Você só mostra seu crachá (cookie) pro porteiro.
O porteiro abre a porta pra você.
Ninguém vê a chave real.
```

---

## Comparação Simples

| Aspecto              | Sem BFF              | Com BFF                 |
| -------------------- | -------------------- | ----------------------- |
| Onde fica o token?   | No browser (visível) | No servidor (escondido) |
| Alguém pode roubar?  | Sim, fácil           | Muito difícil           |
| Quem fala com a API? | O browser            | O servidor              |
| Complexidade         | Menor                | Um pouco maior          |
| Segurança            | Baixa                | Alta                    |

---

## Quando usar cada um?

### Use acesso DIRETO (sem BFF) quando:

- API é pública (não precisa login)
- Dados não são sensíveis
- Protótipo rápido / teste

```typescript
// Exemplo: buscar CEP (público, não sensível)
const endereco = await $fetch(`https://viacep.com.br/ws/${cep}/json/`)
```

### Use BFF quando:

- Tem autenticação (login/senha, JWT)
- Dados são sensíveis (saúde, financeiro, pessoal)
- API tem chave secreta (API Key)
- Precisa esconder credenciais

```typescript
// Exemplo: buscar dados de pacientes (sensível, com auth)
// Browser chama SEU servidor:
const dados = await $fetch('/api/pacientes')

// Seu servidor chama a API externa:
// server/api/pacientes.get.ts
export default defineEventHandler(async event => {
  const token = getCookie(event, 'access_token') // Token escondido
  return $fetch('https://api-externa.com/pacientes', {
    headers: { Authorization: `Bearer ${token}` }
  })
})
```

---

## Como funciona no Detecta Alerta?

### 1. Login

```
┌─────────┐   email/senha    ┌─────────────┐   email/senha    ┌─────────────┐
│ Browser │ ───────────────► │ Nuxt Server │ ───────────────► │ API Sinapse │
└─────────┘                  └─────────────┘                  └─────────────┘
                                   │
                                   │ Recebe tokens
                                   ▼
                             ┌───────────┐
                             │  Guarda   │
                             │ em cookie │
                             │ httpOnly  │
                             └───────────┘
                                   │
                                   │ Retorna só dados do usuário
                                   ▼
                             ┌─────────┐
                             │ Browser │ (não vê os tokens!)
                             └─────────┘
```

### 2. Buscar dados (após login)

```
┌─────────┐  cookie (automático)  ┌─────────────┐
│ Browser │ ────────────────────► │ Nuxt Server │
└─────────┘                       └─────────────┘
                                        │
                                        │ Lê token do cookie
                                        │ Adiciona no header
                                        ▼
                                  ┌─────────────┐
                                  │ API Sinapse │
                                  └─────────────┘
                                        │
                                        │ Retorna dados
                                        ▼
                                  ┌─────────┐
                                  │ Browser │
                                  └─────────┘
```

---

## Por que não uma "API mais simples"?

### Opção 1: Guardar token no localStorage

```typescript
// ❌ INSEGURO
localStorage.setItem('token', 'eyJhbG...')

// Qualquer script JavaScript pode ler:
const token = localStorage.getItem('token')
// Inclusive scripts maliciosos (XSS)
```

**Problema:** Se seu site tiver uma vulnerabilidade XSS, o atacante rouba o token.

### Opção 2: Guardar token em variável JavaScript

```typescript
// ❌ INSEGURO
let token = 'eyJhbG...'

// Visível no DevTools > Sources
// Visível no DevTools > Network
```

**Problema:** Token visível para qualquer pessoa com acesso ao navegador.

### Opção 3: BFF com cookie httpOnly

```typescript
// ✅ SEGURO
setCookie(event, 'access_token', token, {
  httpOnly: true, // JavaScript NÃO consegue ler
  secure: true, // Só HTTPS
  sameSite: 'strict' // Só seu site
})
```

**Por que é seguro:**

- `httpOnly`: JavaScript não consegue acessar (previne XSS)
- `secure`: Só funciona em HTTPS (previne interceptação)
- `sameSite`: Cookie não é enviado para outros sites (previne CSRF)

---

## Resumo Final

| Pergunta                    | Resposta                                           |
| --------------------------- | -------------------------------------------------- |
| **O que é BFF?**            | Seu servidor intermediando chamadas à API externa  |
| **Por que usar?**           | Esconder tokens e credenciais do browser           |
| **É complicado?**           | Um pouco mais de código, mas segurança muito maior |
| **Quando usar?**            | Sempre que tiver auth ou dados sensíveis           |
| **Detecta Alerta precisa?** | Sim - dados de saúde + autenticação                |

### A regra de ouro:

> **Se tem login ou dados sensíveis → usa BFF**
>
> **Se é público e não sensível → pode ir direto**

---

## Arquivos do BFF no Projeto

```
layers/3-auth/
├── server/
│   ├── api/auth/
│   │   ├── login.post.ts      # Recebe login, guarda token em cookie
│   │   ├── logout.post.ts     # Limpa cookies
│   │   ├── me.get.ts          # Retorna dados do usuário
│   │   └── refresh.post.ts    # Renova token automaticamente
│   │
│   ├── middleware/
│   │   └── 01.auth.ts         # Renova token se estiver expirando
│   │
│   └── utils/
│       └── auth.ts            # Funções auxiliares (cookies, etc)
```

---

## Leitura Adicional

- [OWASP - Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [MDN - HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Nuxt - Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
