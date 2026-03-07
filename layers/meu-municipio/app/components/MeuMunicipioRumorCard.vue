<script setup lang="ts">
import type { MockNoticia } from '../composables/mocks'

interface Props {
  noticia: MockNoticia
  showTags?: boolean
  clickable?: boolean
}

withDefaults(defineProps<Props>(), {
  showTags: false,
  clickable: false
})
</script>

<template>
  <article
    :class="[
      'flex flex-col gap-3 rounded-xl border border-secondary-100 bg-white p-4',
      clickable && 'cursor-pointer transition-colors hover:border-secondary-200'
    ]"
  >
    <h4 class="line-clamp-2 text-sm font-semibold leading-snug text-base-950">
      {{ noticia.title }}
    </h4>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-xs">
        <span class="font-medium text-secondary-700">{{ noticia.source }}</span>
        <span class="h-3 w-px bg-base-300" />
        <span class="text-base-500">{{ noticia.time }}</span>
      </div>
      <span
        class="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-semibold text-secondary-700 hover:text-secondary-900"
      >
        ver rumor
        <Icon name="lucide:arrow-right" class="size-4 text-primary-500" />
      </span>
    </div>

    <div
      v-if="showTags && (noticia.tags?.diseases?.length || noticia.tags?.regions?.length)"
      class="flex flex-wrap gap-1.5"
    >
      <span
        v-for="disease in noticia.tags!.diseases"
        :key="disease"
        class="rounded-full bg-danger-100 px-2 py-0.5 text-xs font-medium text-danger-950"
      >
        {{ disease }}
      </span>
      <span
        v-for="region in noticia.tags!.regions"
        :key="region"
        class="rounded-full bg-secondary-100 px-2 py-0.5 text-xs font-medium text-secondary-900"
      >
        {{ region }}
      </span>
    </div>
  </article>
</template>
