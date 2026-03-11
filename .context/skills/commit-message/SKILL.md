---
name: commit-message
description: Generate commit messages following conventional commits with scope detection
user-invocable: false
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
| `auth`     | layers/auth           |
| `home`     | layers/home           |
| `usuarios` | layers/usuarios       |
| `rumores`  | layers/rumores        |
| `docs`     | layers/docs           |
| `base`     | layers/base           |
| `deps`     | Dependency updates    |
| `kubb`     | API client generation |

### Scope Detection

Determine scope from changed files:

- `layers/base/**` → `base`
- `layers/auth/**` → `auth`
- `layers/home/**` → `home`
- `layers/usuarios/**` → `usuarios`
- `layers/rumores/**` → `rumores`
- `layers/docs/**` → `docs`
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
