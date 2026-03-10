---
name: documentation
description: Generate and update technical documentation
disable-model-invocation: true
---

## Documentation Skill

### Documentation Types

| Type            | Location         | When               |
| --------------- | ---------------- | ------------------ |
| Root CLAUDE.md  | `CLAUDE.md`      | Project-wide rules |
| Nuxt Content    | `content/docs/`  | User-facing docs   |
| Context docs    | `.context/docs/` | AI context         |
| Inline comments | Source code      | Complex logic only |

### Writing Rules

- Use Portuguese for descriptions matching project convention
- Code examples must follow project style (no semicolons, single quotes)
- Use tables for structured data (endpoints, types, commands)
- Keep concise — scan-friendly
- Verify all links are relative and valid
- Document the "what" and "why", not the "how" (code is self-documenting)

### Nuxt Content

Files in `content/docs/` use Markdown with YAML frontmatter:

```markdown
---
title: Page Title
description: Brief description
---
```

Rendered at `/docs/` routes via layer docs.
