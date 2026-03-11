<script setup lang="ts">
defineProps<{
  title: string
  description: string
  image?: string
  highlightLabel?: string
  highlightCount?: string
  diseaseTag: string
  timeAgo: string
  sourceCount?: number
}>()
</script>

<template>
  <NuxtLink
    to="/rumores/1"
    class="group flex items-start gap-6 overflow-hidden rounded-xl bg-white p-2 transition-shadow hover:shadow-lg"
  >
    <!-- Imagem (losango com máscara rotacionada) -->
    <div class="relative flex size-35 shrink-0 items-center justify-center">
      <!-- Losango externo -->
      <div class="absolute inset-4 rotate-45 overflow-hidden rounded-2xl bg-secondary-200">
        <NuxtImg
          v-if="image"
          :src="image"
          class="size-full -rotate-45 scale-150 object-cover"
          loading="lazy"
        />
      </div>
      <!-- Ícone placeholder (sem imagem) -->
      <Icon
        v-if="!image"
        name="lucide:newspaper"
        size="40"
        class="relative z-10 text-secondary-400"
      />
    </div>

    <!-- Conteúdo -->
    <div class="flex flex-1 flex-col gap-2 self-stretch py-2 pr-3">
      <h4 class="text-xl font-semibold leading-tight text-base-950">
        {{ title }}
      </h4>
      <p class="line-clamp-2 text-sm leading-normal text-base-500">
        {{ description }}
      </p>

      <!-- Highlight -->
      <div v-if="highlightLabel" class="flex items-center gap-2">
        <span class="text-sm font-semibold text-primary-950">{{ highlightLabel }}</span>
        <span v-if="highlightCount" class="text-sm text-primary-950">{{ highlightCount }}</span>
        <Icon v-if="highlightCount" name="lucide:trending-up" class="size-4 text-primary-950" />
      </div>

      <!-- Footer -->
      <div class="mt-auto flex items-center gap-2 pt-2">
        <!-- Avatares -->
        <div class="flex -space-x-1.5">
          <div
            v-for="n in sourceCount ?? 3"
            :key="n"
            class="size-5 rounded-full border-2 border-white bg-secondary-200"
          />
        </div>

        <span class="text-xs font-semibold text-secondary-900">{{ diseaseTag }}</span>
        <span class="inline-block h-3 w-px bg-base-300" />
        <span class="text-xs text-base-500">{{ timeAgo }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
