<script setup lang="ts">
const props = defineProps<{
  /** Título opcional exibido acima do diagrama */
  title?: string
}>()

const container = ref<HTMLElement>()
const slots = useSlots()
const rendered = ref(false)

async function render() {
  if (!container.value || rendered.value) return

  // Extrair texto bruto do slot default
  const slotContent = slots.default?.()
  if (!slotContent) return

  const raw = extractText(slotContent)
  if (!raw.trim()) return

  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    fontFamily: 'inherit',
    securityLevel: 'strict'
  })

  const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`
  const { svg } = await mermaid.render(id, raw.trim())
  container.value.innerHTML = svg
  rendered.value = true
}

/**
 * Extrai texto recursivamente dos VNodes do slot.
 * Nuxt Content envolve o conteúdo em <p>, <code>, etc.
 */
function extractText(
  nodes: ReturnType<NonNullable<ReturnType<typeof useSlots>['default']>>
): string {
  if (!Array.isArray(nodes)) return ''
  return nodes
    .map(node => {
      if (typeof node === 'string') return node
      if (typeof node.children === 'string') return node.children
      if (Array.isArray(node.children)) return extractText(node.children as typeof nodes)
      return ''
    })
    .join('')
}

onMounted(render)
</script>

<template>
  <figure class="my-6">
    <figcaption v-if="props.title" class="mb-2 text-sm font-medium text-base-600">
      {{ props.title }}
    </figcaption>
    <ClientOnly>
      <div
        ref="container"
        class="flex justify-center overflow-x-auto rounded-lg border border-base-200 bg-base-50 p-4 [&_svg]:max-w-full"
      />
      <template #fallback>
        <div
          class="flex h-32 items-center justify-center rounded-lg border border-base-200 bg-base-50"
        >
          <span class="text-sm text-base-400">Carregando diagrama...</span>
        </div>
      </template>
    </ClientOnly>
  </figure>
</template>
