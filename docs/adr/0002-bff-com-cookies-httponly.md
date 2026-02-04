# ADR-0002: BFF Pattern com Cookies httpOnly

## Status

Accepted

## Contexto

O Detecta Alerta consome a API Sinapse para autenticação e dados epidemiológicos.
A API retorna tokens JWT (access + refresh). Precisávamos decidir onde e como
armazenar esses tokens no cliente, considerando que a plataforma lida com dados
sensíveis de saúde pública.

## Decisão

Adotamos o padrão **BFF (Backend-for-Frontend)** onde o servidor Nuxt (Nitro) atua
como intermediário. Tokens são armazenados exclusivamente em **cookies httpOnly** e
**nunca** expostos ao JavaScript do cliente.

```
Cliente → BFF (Nuxt Server) → API Sinapse
              ↓
    Tokens em cookies httpOnly
    Cliente recebe apenas dados do usuário
```

## Opções Consideradas

### Opção 1: Tokens em localStorage

- **Prós**: Simples de implementar, sem server-side
- **Contras**: Vulnerável a XSS (qualquer script pode ler), sem proteção CSRF nativa

### Opção 2: Tokens em memória JavaScript (variável)

- **Prós**: Sem persistência em disco
- **Contras**: Perde token ao recarregar página, vulnerável a XSS

### Opção 3: BFF com cookies httpOnly (escolhida)

- **Prós**: Tokens invisíveis ao JS, CSRF protegido com SameSite, auto-refresh no server
- **Contras**: Complexidade no server, todas as requests passam pelo BFF

## Racional

Dados epidemiológicos são sensíveis. Um ataque XSS que roubage tokens poderia
comprometer dados de saúde de milhões de brasileiros. Cookies httpOnly eliminam esse
vetor completamente:

- `httpOnly: true` - JavaScript não pode ler o cookie
- `secure: true` (produção) - Apenas HTTPS
- `sameSite: 'strict'` - Previne CSRF
- Auto-refresh centralizado no server middleware (`01.auth.ts`)

## Consequências

### Positivas

- Tokens completamente inacessíveis via DevTools ou XSS
- Auto-refresh transparente (middleware renova antes de expirar)
- Logout real (server deleta cookies, não depende do cliente)
- Mensagens de erro genéricas (sem expor detalhes do JWT)

### Negativas

- Todas as requests autenticadas passam pelo BFF (latência adicional mínima)
- Endpoints BFF precisam ser mantidos para cada recurso da API
- Debugging mais complexo (token não visível no cliente)

## Referências

- [docs/BFF.md](../BFF.md)
- [layers/3-auth/CLAUDE.md](../../layers/3-auth/CLAUDE.md)
