<script setup lang="ts">
interface TocLink {
  id: string
  text: string
  depth: number
}

defineProps<{
  links: TocLink[]
  activeId: string
}>()
</script>

<template>
  <div v-if="links.length" class="space-y-2">
    <p class="text-sm font-semibold text-foreground">Nesta página</p>
    <nav class="space-y-0.5 border-l border-border">
      <a
        v-for="link in links"
        :key="link.id"
        :href="`#${link.id}`"
        class="-ml-px block border-l-2 py-0.5 pl-3 text-sm transition-colors"
        :class="[
          link.depth === 3 ? 'pl-6' : '',
          activeId === link.id
            ? 'border-brand-secondary-600 font-medium text-brand-secondary-900'
            : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
        ]"
      >
        {{ link.text }}
      </a>
    </nav>
  </div>
</template>
