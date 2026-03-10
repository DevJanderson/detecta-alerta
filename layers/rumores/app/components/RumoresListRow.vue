<script setup lang="ts">
defineProps<{
  title: string
  description: string
  image?: string
  highlightLabel?: string
  highlightCount?: string
  diseases: string[]
  symptoms: string[]
  regions: string[]
  relevance: 'alta' | 'média' | 'baixa'
  timeAgo: string
  sourceName?: string
  sourceCount?: number
}>()

const relevanceClasses: Record<string, string> = {
  alta: 'bg-primary-600 border-primary-100 text-white',
  média: 'bg-alert-500 border-alert-100 text-white',
  baixa: 'bg-secondary-100 border-secondary-200 text-secondary-700'
}
</script>

<template>
  <NuxtLink
    to="/rumores/1"
    class="group flex items-center gap-10 border-b border-base-50 px-2 py-8 transition-colors hover:bg-base-50/50"
  >
    <!-- Notícia (imagem + conteúdo) -->
    <div class="flex flex-1 items-center gap-6 pr-20">
      <!-- Thumbnail -->
      <div class="size-30 shrink-0 overflow-hidden rounded-xl bg-secondary-200">
        <NuxtImg v-if="image" :src="image" class="size-full object-cover" loading="lazy" />
        <div v-else class="flex size-full items-center justify-center">
          <Icon name="lucide:newspaper" size="32" class="text-secondary-400" />
        </div>
      </div>

      <!-- Conteúdo -->
      <div class="flex flex-1 flex-col gap-2">
        <h3 class="text-base font-semibold leading-tight text-base-950">
          {{ title }}
        </h3>
        <p class="line-clamp-2 text-xs leading-normal text-base-600">
          {{ description }}
        </p>

        <!-- Highlight -->
        <div v-if="highlightLabel" class="flex items-center gap-2">
          <span class="text-sm font-semibold text-primary-600">{{ highlightLabel }}</span>
          <span v-if="highlightCount" class="text-sm text-primary-600">{{ highlightCount }}</span>
          <Icon v-if="highlightCount" name="lucide:trending-up" class="size-4 text-primary-600" />
        </div>

        <!-- Fontes + tempo -->
        <div class="flex items-center gap-3 pt-2">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-1.5">
              <div
                v-for="n in sourceCount ?? 3"
                :key="n"
                class="size-5 rounded-full border-2 border-white bg-secondary-200"
              />
            </div>
            <span v-if="sourceName" class="text-xs text-secondary-600">
              {{ sourceName }}
            </span>
          </div>
          <span class="inline-block h-3 w-px bg-base-200" />
          <span class="text-xs text-base-400">{{ timeAgo }}</span>
        </div>
      </div>
    </div>

    <!-- Doenças relacionadas -->
    <div class="flex w-54 shrink-0 flex-wrap items-start gap-3 py-2">
      <span
        v-for="disease in diseases"
        :key="disease"
        class="flex items-center gap-1 text-sm font-semibold text-secondary-600"
      >
        {{ disease }}
        <Icon name="lucide:external-link" class="size-4" />
      </span>
    </div>

    <!-- Sintomas -->
    <div class="flex w-54 shrink-0 flex-wrap items-start gap-2 py-2">
      <span
        v-for="symptom in symptoms"
        :key="symptom"
        class="rounded-full border border-secondary-100 bg-secondary-50 px-3 py-0.5 text-xs font-semibold text-secondary-600"
      >
        {{ symptom }}
      </span>
    </div>

    <!-- Região -->
    <div class="flex w-54 shrink-0 flex-wrap items-start gap-2 py-2">
      <span
        v-for="region in regions"
        :key="region"
        class="rounded-full border border-secondary-100 bg-secondary-50 px-3 py-0.5 text-xs font-semibold text-secondary-600"
      >
        {{ region }}
      </span>
    </div>

    <!-- Relevância -->
    <div class="flex w-30 shrink-0 items-start py-2">
      <span
        class="rounded-full border px-3 py-1 text-xs font-semibold"
        :class="relevanceClasses[relevance]"
      >
        {{ relevance }}
      </span>
    </div>
  </NuxtLink>
</template>
