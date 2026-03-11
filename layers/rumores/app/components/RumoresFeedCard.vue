<script setup lang="ts">
defineProps<{
  title: string
  description: string
  image?: string
  diseaseTag: string
  symptoms?: string
  timeAgo: string
  sourceCount?: number
  sourceName?: string
}>()
</script>

<template>
  <article class="overflow-hidden rounded-xl border border-secondary-200 bg-white p-4 shadow-sm">
    <!-- Imagem grande -->
    <div class="h-120 w-full overflow-hidden rounded-xl">
      <NuxtImg v-if="image" :src="image" class="size-full object-cover" loading="lazy" />
      <div v-else class="flex size-full items-center justify-center bg-secondary-200">
        <div
          class="flex size-80 -rotate-45 items-center justify-center rounded-[40px] bg-secondary-300/40"
        >
          <div
            class="flex size-40 items-center justify-center rounded-4xl bg-secondary-50 shadow-xl"
          >
            <Icon name="lucide:megaphone" size="64" class="rotate-45 text-secondary-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="flex flex-col gap-10 p-8">
      <!-- Header: título + fontes -->
      <div class="flex flex-col gap-4">
        <h3 class="text-4xl font-semibold leading-snug text-base-950">
          {{ title }}
        </h3>

        <!-- Fontes + tempo -->
        <div class="flex items-center gap-3">
          <div class="flex -space-x-1.5">
            <div
              v-for="n in sourceCount ?? 3"
              :key="n"
              class="size-6 rounded-full border-2 border-white bg-secondary-200"
            />
          </div>
          <span v-if="sourceName" class="text-sm text-secondary-600">
            {{ sourceName }}
          </span>
          <span class="inline-block h-3 w-px bg-base-200" />
          <span class="text-sm text-base-400">{{ timeAgo }}</span>
        </div>
      </div>

      <!-- Descrição + doença/sintomas -->
      <div class="flex flex-col gap-6">
        <!-- Texto da notícia (5 linhas) -->
        <p class="line-clamp-5 text-base leading-relaxed text-base-600">
          {{ description }}
        </p>

        <!-- Doença + sintomas -->
        <div class="flex items-center gap-3">
          <span class="text-base font-semibold text-secondary-600">{{ diseaseTag }}</span>
          <template v-if="symptoms">
            <span class="inline-block h-3 w-px bg-base-200" />
            <div class="flex items-center gap-2">
              <Icon name="lucide:cross" class="size-4 text-secondary-500" />
              <span class="text-base text-secondary-500">{{ symptoms }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Botão "ver notícia completa" -->
      <div>
        <NuxtLink
          to="/rumores/1"
          class="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-secondary-50 px-5 py-3 text-base font-semibold text-secondary-600 transition-colors hover:bg-secondary-100"
        >
          ver notícia completa
          <Icon name="lucide:arrow-right" class="size-5" />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
