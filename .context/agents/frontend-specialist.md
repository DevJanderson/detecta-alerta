---
type: agent
name: Frontend Specialist
description: Design and implement user interfaces
agentType: frontend-specialist
phases: [P, E]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Frontend Specialist Playbook

### UI Stack

- **Component Library**: shadcn-vue (installed in `layers/0-base/app/components/ui/`)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide via `@nuxt/icon`
- **Forms**: VeeValidate (`VeeForm`, `VeeField`, `VeeFieldArray`, `VeeErrorMessage`)
- **Toasts**: vue-sonner
- **Color Mode**: `@nuxtjs/color-mode` (light default)

### Adding shadcn-vue Components

```bash
npx shadcn-vue@latest add <component>
```

Components auto-install to `layers/0-base/app/components/ui/` and are auto-imported.

### Design System Colors

| Color             | Tailwind Class                | Use                             |
| ----------------- | ----------------------------- | ------------------------------- |
| `brand-primary`   | `bg-brand-primary-{50-950}`   | Red/Coral — CTAs, highlights    |
| `brand-secondary` | `bg-brand-secondary-{50-950}` | Blue — Links, secondary actions |
| `base`            | `bg-base-{0-950}`             | Neutrals — Text, backgrounds    |
| `success`         | `bg-success-{50-950}`         | Green — Positive feedback       |
| `alert`           | `bg-alert-{50-950}`           | Yellow — Warnings               |
| `danger`          | `bg-danger-{50-950}`          | Red — Errors                    |

**Rules**:

- Brand colors (`brand-*`, `success`, `alert`, `danger`) for custom elements
- Semantic shadcn colors (`primary`, `secondary`, `muted`) for UI components
- Low tones (50-200) for backgrounds, high tones (600-900) for text
- **Never hardcode colors** — always use design system variables

Preview: http://localhost:3000/design-system

### Component Naming

Components must be prefixed with their layer name:

- `AuthLoginForm.vue` (layer 1-auth)
- `RumoresCard.vue` (layer 4-rumores)

### SEO

All pages must use `useSeoPage()`:

```vue
<script setup lang="ts">
useSeoPage({
  title: 'Page Title',
  description: 'Page description.'
})
</script>
```

### CSS Location

Global CSS: `layers/0-base/app/assets/css/main.css`

### Style Rules

- Self-close all Vue components (`<MyComp />`)
- No semicolons, single quotes in templates
- Use Tailwind classes, not inline styles
