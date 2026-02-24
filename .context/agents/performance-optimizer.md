---
type: agent
name: Performance Optimizer
description: Identify performance bottlenecks
agentType: performance-optimizer
phases: [E, V]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Performance Optimizer Playbook

### Current Optimizations

| Feature                    | Configuration                                 |
| -------------------------- | --------------------------------------------- |
| Cross-origin prefetch      | `experimental.crossOriginPrefetch: true`      |
| Public asset compression   | `nitro.compressPublicAssets: true`            |
| esbuild minification       | `vite.build.minify: 'esbuild'`                |
| Asset inline limit         | 4KB (`vite.build.assetsInlineLimit: 4096`)    |
| Image optimization         | webp + avif (`@nuxt/image`, quality: 80)      |
| Sourcemaps disabled (prod) | `sourcemap: { client: false, server: false }` |
| Icon optimization          | Server bundle: remote, client: scan-based     |

### Data Fetching Performance

| Method     | When              | SSR | Caching       |
| ---------- | ----------------- | --- | ------------- |
| `useFetch` | Initial page load | Yes | Nuxt payload  |
| `$fetch`   | User interactions | No  | None (manual) |

### Areas to Investigate

1. **Bundle size**: Check for large dependencies in client bundle
2. **API latency**: BFF adds a hop — ensure `fetchSinapse()` has proper timeouts
3. **Store persistence**: Only `persist.pick` specific fields, not entire store
4. **Component lazy loading**: Use `defineAsyncComponent` for heavy components
5. **Image loading**: Ensure `@nuxt/image` is used for all images

### Verification

```bash
npm run build           # Check build output size
npm run typecheck       # Ensure optimizations don't break types
```

### Nuxt-Specific Tips

- Use `useAsyncData`/`useFetch` with `key` parameter for proper caching
- Prefer SSR for initial data loads (avoids waterfall)
- Use `<NuxtImg>` instead of `<img>` for automatic optimization
- Lazy-load routes: Nuxt does this automatically for all pages
