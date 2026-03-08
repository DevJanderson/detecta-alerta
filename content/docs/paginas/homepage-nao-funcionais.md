---
title: 'Homepage — Não-Funcionais'
description: 'Requisitos de performance, responsividade, SEO e acessibilidade da homepage.'
order: 4
---

# Requisitos Não-Funcionais

Requisitos transversais que afetam a qualidade da homepage independentemente das funcionalidades.

---

## Performance

| Requisito                               | Meta            | Como medir              | Status                    |
| --------------------------------------- | --------------- | ----------------------- | ------------------------- |
| First Contentful Paint (FCP)            | < 1.5s          | Lighthouse              | 🔲 Não medido             |
| Largest Contentful Paint (LCP)          | < 2.5s          | Lighthouse / Web Vitals | 🔲 Não medido             |
| Time to Interactive (TTI)               | < 3s            | Lighthouse              | 🔲 Não medido             |
| Cumulative Layout Shift (CLS)           | < 0.1           | Lighthouse / Web Vitals | 🔲 Não medido             |
| Mapa SVG carrega sem travar UI          | < 2s            | Manual                  | 🔲 Pendente (MapLibre GL) |
| Gráfico renderiza sem delay perceptível | < 1s            | Manual                  | 🔲 Pendente (ApexCharts)  |
| Bundle JS da homepage                   | < 200KB gzipped | Build analysis          | 🔲 Não medido             |

### Estratégias de performance

- **SSR** — página renderizada no servidor para FCP rápido
- **Lazy loading** — mapa e gráfico carregados sob demanda (quando visíveis no viewport)
- **Skeleton loading** — placeholders visuais enquanto dados carregam
- **Cache** — dados de indicadores regionais cacheados por 5 minutos
- **Compressão** — Nitro com `compressPublicAssets: true`

---

## Responsividade

| Breakpoint  | Largura        | Comportamento                                                                |
| ----------- | -------------- | ---------------------------------------------------------------------------- |
| **Mobile**  | < 640px        | Colunas empilhadas, topbar com scroll horizontal, menu hamburger, TOC oculto |
| **Tablet**  | 640px — 1024px | 2 colunas no dashboard, mapa e dados empilhados                              |
| **Desktop** | > 1024px       | Mapa sticky à esquerda, dados scrolláveis à direita, layout completo         |

### Detalhes por seção

| Seção       | Mobile                               | Desktop                                |
| ----------- | ------------------------------------ | -------------------------------------- |
| Top Bar     | Scroll horizontal                    | Linha única                            |
| Header      | Hamburger + Sheet                    | Nav horizontal                         |
| Hero        | Empilhado (título → CTA → descrição) | 3 colunas                              |
| Region Tabs | Scroll horizontal                    | Linha única                            |
| Dashboard   | Empilhado (mapa → filtros → dados)   | 2 colunas (mapa sticky + dados scroll) |
| Tabela      | Scroll horizontal                    | Largura total                          |
| CTA         | Empilhado                            | Título à esquerda, botão à direita     |
| Footer      | Colunas empilhadas                   | 4 colunas                              |

---

## SEO

| Item                | Implementação                                      | Status |
| ------------------- | -------------------------------------------------- | ------ |
| Title e Description | `useSeoPage()` com título e descrição dinâmicos    | ✅     |
| Open Graph          | Gerado automaticamente pelo `useSeoPage()`         | ✅     |
| Twitter Cards       | Gerado automaticamente pelo `useSeoPage()`         | ✅     |
| Schema.org JSON-LD  | `defineWebSite()` com nome, URL e descrição        | ✅     |
| Canonical URL       | Gerado automaticamente                             | ✅     |
| SSR                 | Conteúdo renderizado no servidor                   | ✅     |
| Sitemap             | Gerado em `/sitemap.xml` pelo módulo `@nuxtjs/seo` | ✅     |
| Robots              | `X-Robots-Tag` configurado em `routeRules`         | ✅     |
| HTML semântico      | h1, h2, section, nav, main, footer                 | ✅     |
| Lang attribute      | `<html lang="pt-BR">`                              | ✅     |

---

## Acessibilidade

| Requisito                                       | Nível WCAG | Status                             |
| ----------------------------------------------- | ---------- | ---------------------------------- |
| Navegação por teclado nos tabs e filtros        | AA         | 🔲 Não validado                    |
| Contraste mínimo nas cores de texto             | AA (4.5:1) | 🔲 Não validado                    |
| Contraste em elementos gráficos (mapa, gráfico) | AA (3:1)   | 🔲 Não validado                    |
| Labels associados a inputs e selects            | A          | ✅                                 |
| Alt text em imagens informativas                | A          | 🔲 Não validado                    |
| `aria-hidden` em ícones decorativos             | A          | ✅ (Nuxt Icon faz automaticamente) |
| Roles semânticos (tablist, tab, tabpanel)       | A          | 🔲 Não validado                    |
| Foco visível em elementos interativos           | AA         | 🔲 Não validado                    |
| Leitor de tela: dados da tabela acessíveis      | A          | 🔲 Não validado                    |
| Redução de movimento (`prefers-reduced-motion`) | AAA        | 🔲 Não implementado                |

---

## Segurança

| Requisito                              | Implementação                         | Status |
| -------------------------------------- | ------------------------------------- | ------ |
| CSP headers                            | Módulo `nuxt-security`                | ✅     |
| Rate limiting                          | 150 req/5min (global)                 | ✅     |
| Login rate limiting                    | 10 req/5min                           | ✅     |
| CSRF protection                        | `nuxt-csurf` em POST/PUT/PATCH/DELETE | ✅     |
| XSS protection                         | Validator habilitado                  | ✅     |
| Tokens em cookies httpOnly             | `setCookie` com secure + sameSite     | ✅     |
| Dados sensíveis não expostos no client | Validação no BFF                      | ✅     |

---

## Compatibilidade de Navegadores

| Navegador               | Versão mínima | Suporte |
| ----------------------- | ------------- | ------- |
| Chrome                  | 90+           | ✅      |
| Firefox                 | 90+           | ✅      |
| Safari                  | 15+           | ✅      |
| Edge                    | 90+           | ✅      |
| Mobile Chrome (Android) | 90+           | ✅      |
| Mobile Safari (iOS)     | 15+           | ✅      |
