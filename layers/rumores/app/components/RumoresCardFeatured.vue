<script setup lang="ts">
defineProps<{
  title: string
  description: string
  image?: string
  highlightLabel?: string
  highlightCount?: string
  symptoms?: string
  diseaseTag: string
  extraTags?: string
  timeAgo: string
  sourceCount?: number
}>()
</script>

<template>
  <NuxtLink
    to="/rumores/1"
    class="group flex flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-lg"
  >
    <!-- Imagem -->
    <div class="h-52 w-full overflow-hidden rounded-t-sm sm:h-80">
      <div
        v-if="image"
        class="size-full bg-cover bg-center transition-transform group-hover:scale-105"
        :style="{ backgroundImage: `url(${image})` }"
      />
      <div v-else class="flex size-full items-center justify-center bg-secondary-100">
        <!-- Losango externo (fundo sutil) -->
        <div
          class="flex size-80 -rotate-45 items-center justify-center rounded-[40px] bg-secondary-200"
        >
          <!-- Losango interno (branco com sombra) -->
          <div
            class="flex size-40 items-center justify-center rounded-4xl bg-secondary-50 shadow-xl"
          >
            <Icon name="lucide:megaphone" size="64" class="rotate-45 text-secondary-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-6">
      <!-- Título + Descrição -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xl font-semibold leading-snug text-base-950 sm:text-[28px]">
          {{ title }}
        </h3>
        <p class="text-base leading-normal text-base-800">
          {{ description }}
        </p>
      </div>

      <!-- Highlight (ex: "Virou assunto! 3 novos rumores") -->
      <div v-if="highlightLabel" class="flex items-center gap-2">
        <span class="text-base font-semibold text-primary-950">{{ highlightLabel }}</span>
        <span v-if="highlightCount" class="text-base text-primary-950">{{ highlightCount }}</span>
        <Icon v-if="highlightCount" name="lucide:trending-up" class="size-5 text-primary-950" />
      </div>

      <!-- Sintomas -->
      <div v-if="symptoms" class="flex items-center gap-2">
        <Icon name="lucide:cross" class="size-4 text-secondary-600" />
        <span class="text-sm text-secondary-600">{{ symptoms }}</span>
      </div>

      <!-- Footer -->
      <div class="mt-auto flex items-center justify-between border-t border-base-50 pt-2">
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-secondary-900">{{ diseaseTag }}</span>
          <span v-if="extraTags" class="text-sm font-semibold text-secondary-900">{{
            extraTags
          }}</span>
          <span class="inline-block h-3 w-px bg-base-300" />
          <span class="text-sm text-base-500">{{ timeAgo }}</span>
        </div>

        <!-- Avatares de fontes -->
        <div class="flex -space-x-1.5">
          <div
            v-for="n in sourceCount ?? 3"
            :key="n"
            class="size-6 rounded-full border-2 border-white bg-secondary-200"
          />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
