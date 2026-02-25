<script setup lang="ts">
definePageMeta({
  layout: 'docs',
  middleware: 'auth-guard'
})

const route = useRoute()
const slug = computed(() => {
  const parts = route.params.slug
  if (!parts || (Array.isArray(parts) && parts.length === 0)) return '/docs'
  const path = Array.isArray(parts) ? parts.join('/') : parts
  return `/docs/${path}`
})

const { data: page } = await useAsyncData(
  `docs-${slug.value}`,
  () => queryCollection('docs').path(slug.value).first(),
  { watch: [slug] }
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Página não encontrada' })
}

useSeoPage({
  title: page.value?.title ? `${page.value.title} - Detecta Alerta Docs` : 'Detecta Alerta Docs',
  description: page.value?.description
})

const tocLinks = computed(() => {
  if (!page.value?.body?.toc?.links) return []
  return page.value.body.toc.links.flatMap(
    (link: { id: string; text: string; children?: { id: string; text: string }[] }) => [
      { id: link.id, text: link.text, depth: 2 },
      ...(link.children?.map(child => ({ id: child.id, text: child.text, depth: 3 })) ?? [])
    ]
  )
})

const { activeId, observe } = useDocsToc()
const contentRef = useTemplateRef<HTMLElement>('contentRef')

onMounted(() => {
  nextTick(() => {
    if (contentRef.value) {
      observe(contentRef.value)
    }
  })
})
</script>

<template>
  <div>
    <div v-if="page" ref="contentRef" class="prose max-w-none">
      <ContentRenderer :value="page" />
    </div>

    <DocsPageNav />

    <Teleport to="#docs-toc">
      <DocsToc :links="tocLinks" :active-id="activeId" />
    </Teleport>
  </div>
</template>
