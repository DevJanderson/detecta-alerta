---
type: skill
name: Commit Message
description: Generate commit messages following conventional commits with scope detection
skillSlug: commit-message
phases: [E, C]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Commit Message Skill

### Format

```
<type>(<scope>): <subject>
```

### Rules (Commitlint enforced)

- **Subject**: lower-case only, max 72 characters
- **Body**: max 100 characters per line (optional)
- **No Co-Authored-By** in commits

### Types

`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`

### Scopes

| Scope      | Layer/Area            |
| ---------- | --------------------- |
| `auth`     | layers/1-auth         |
| `home`     | layers/2-home         |
| `usuarios` | layers/3-usuarios     |
| `rumores`  | layers/4-rumores      |
| `docs`     | layers/5-docs         |
| `base`     | layers/0-base         |
| `deps`     | Dependency updates    |
| `kubb`     | API client generation |

### Scope Detection

Determine scope from changed files:

- `layers/0-base/**` → `base`
- `layers/1-auth/**` → `auth`
- `layers/2-home/**` → `home`
- `layers/3-usuarios/**` → `usuarios`
- `layers/4-rumores/**` → `rumores`
- `layers/5-docs/**` → `docs`
- `generated/**` or `kubb.config.ts` → `kubb`
- `package*.json` → `deps`

### Examples

```
feat(rumores): adiciona filtro por doença
fix(auth): corrige refresh token expirado
chore(deps): atualiza dependências de segurança
docs(base): documenta composable useSeoPage
refactor(usuarios): extrai lógica de permissões para composable
test(auth): adiciona testes para useAuthStore
```

### Invalid Examples

```
feat(auth): Implementa Login          ❌ uppercase
feat: adiciona nova feature            ❌ missing scope
FEAT(auth): add login                  ❌ uppercase type
```
