---
type: skill
name: Documentation
description: Generate and update technical documentation
skillSlug: documentation
phases: [P, C]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Documentation Skill

### Documentation Types

| Type            | Location                         | When               |
| --------------- | -------------------------------- | ------------------ |
| Layer CLAUDE.md | `layers/{N}-{feature}/CLAUDE.md` | Every layer        |
| Nuxt Content    | `content/docs/`                  | User-facing docs   |
| Context docs    | `.context/docs/`                 | AI context         |
| Inline comments | Source code                      | Complex logic only |

### Layer CLAUDE.md Template

```markdown
# Layer {Feature} - CLAUDE.md

Brief description.

## Arquitetura

(ASCII diagram of data flow)

## Estrutura

(Directory tree)

## Composables/Store

(API surface: state, getters, actions)

## Uso

(Code examples)

## Tipos

(Key interfaces)
```

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

Rendered at `/docs/` routes via layer 5-docs.
