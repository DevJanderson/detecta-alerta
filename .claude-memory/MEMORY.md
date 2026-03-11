# Detecta Alerta - Memory Index

## Estado Atual do Projeto (atualizado 2026-03-10)

**Branch ativa:** `feat/melhorias-interface`
**Fase:** Ajustes de interface antes de integrar dados reais da API Sinapse

### Status por Feature

| Layer               | Status                | Detalhe                                                                                                   |
| ------------------- | --------------------- | --------------------------------------------------------------------------------------------------------- |
| base                | COMPLETA              | Design system, utils, shared domain, layouts                                                              |
| auth                | COMPLETA              | BFF completo com SSR, tokens httpOnly, refresh automático                                                 |
| home                | UI PRONTA, DADOS MOCK | Dashboard, filtros, panorama, tabela — tudo com mock em useHomeApi                                        |
| meu-municipio       | UI PRONTA, DADOS MOCK | Mapa MapLibre funcional, onboarding, search — mock data                                                   |
| lugares-monitorados | UI PRONTA, DADOS MOCK | Mapa MapLibre + aside (filtros, stats, cards). Sub-páginas placeholder (tabela, busca-externa, adicionar) |
| usuarios            | COMPLETA              | CRUD admin (users/grupos/permissoes) + perfil self-service                                                |
| rumores             | PLACEHOLDER           | Apenas landing page "em breve"                                                                            |
| docs                | COMPLETA              | Nuxt Content com markdown, TOC, navegação                                                                 |

### Decisoes Arquiteturais Confirmadas

- Ver: [architecture.md](./architecture.md)

### Over-engineering Identificado (Code Review anterior)

- Ver: [code-review-findings.md](./code-review-findings.md)

### Padroes e Convencoes

- Ver: [patterns.md](./patterns.md)

### Preferencias do Usuario

- Idioma: sempre pt-BR
- Commits: SEM Co-Authored-By (regra explícita no CLAUDE.md)
- Commits: lower-case no subject, conventional commits
- Branching: Gitflow (develop → staging → main)
- Branch de trabalho atual: `feat/melhorias-interface` (baseada em develop)
- **Screenshots Playwright**: NUNCA salvar na raiz do projeto. Sempre usar `/tmp/` (ex: `/tmp/screenshot.png`)

### Credenciais de Teste (Staging/Dev)

- Email: `devjanderlira@gmail.com`
- Senha: `Forte123$`

### Tela do Dev

- Resolução: 1920x1200 (eDP-1)
- Playwright configurado com viewport 1920x1200
