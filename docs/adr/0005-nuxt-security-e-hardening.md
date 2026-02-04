# ADR-0005: nuxt-security para Hardening de Segurança

## Status

Accepted

## Contexto

O Detecta Alerta lida com dados epidemiológicos sensíveis. Precisávamos de proteção
abrangente contra ataques web comuns (XSS, CSRF, clickjacking, brute force) sem
implementar cada mecanismo manualmente.

## Decisão

Adotar o módulo **nuxt-security** como solução centralizada de segurança, configurando:

| Feature       | Configuração                                            |
| ------------- | ------------------------------------------------------- |
| CSP           | Desabilitado em dev (HMR), ativo em prod                |
| Rate Limiter  | 150 req/5min global, 10/5min login, 5/5min reset        |
| CSRF          | POST/PUT/PATCH/DELETE (desabilitado em `/api/auth/*`)   |
| XSS Validator | Defaults                                                |
| Headers       | HSTS (1 ano), X-Frame-Options, nosniff, Referrer-Policy |
| Request Size  | 2MB geral, 8MB upload                                   |

### CSRF desabilitado em rotas de auth

As rotas `/api/auth/*` usam cookies httpOnly com `SameSite: strict`, que fornece
proteção equivalente ao CSRF token. Manter CSRF nessas rotas causaria complexidade
desnecessária no fluxo de login.

## Opções Consideradas

### Opção 1: Implementar headers manualmente

- **Prós**: Controle fino
- **Contras**: Fácil esquecer algum header, manutenção contínua

### Opção 2: Múltiplos pacotes (helmet, rate-limit, csrf separados)

- **Prós**: Escolher cada lib individualmente
- **Contras**: Configuração fragmentada, possíveis conflitos

### Opção 3: nuxt-security (escolhida)

- **Prós**: Solução all-in-one, mantida pela comunidade Nuxt, configuração centralizada
- **Contras**: Menos controle granular que implementação manual

## Racional

nuxt-security é a solução oficial da comunidade Nuxt, integra com `routeRules` para
configuração por rota, e fornece defaults seguros. A configuração centralizada em
`nuxt.config.ts` facilita auditoria e manutenção.

## Consequências

### Positivas

- Proteção abrangente com uma única dependência
- Rate limiting diferenciado por rota sensível
- Headers de segurança configurados em um só lugar
- Fácil adicionar regras por rota via `routeRules`

### Negativas

- CSP precisa de `unsafe-inline` e `unsafe-eval` para Nuxt SSR
- CSP desabilitado em dev (necessário para HMR do Vite)
- `connect-src` precisa ser ajustado ao adicionar serviços externos

## Referências

- [nuxt-security](https://nuxt-security.vercel.app)
- [docs/DEPLOY.md - Segurança](../DEPLOY.md)
