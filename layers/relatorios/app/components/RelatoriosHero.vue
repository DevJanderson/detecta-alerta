<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()

const activeTab = defineModel<'boletim' | 'tecnico'>({ required: true })
</script>

<template>
  <section class="relative bg-tertiary-100 pb-48 pt-12 sm:pb-64 sm:pt-24 lg:pb-80">
    <!-- Conteúdo -->
    <div class="relative z-10 flex flex-col items-center gap-8 px-4 sm:gap-12 sm:px-6 lg:px-40">
      <!-- Content switcher -->
      <div
        class="relative flex h-12 w-full items-center gap-2 rounded-full border border-secondary-200 bg-white p-1 sm:h-14 sm:max-w-197"
      >
        <!-- Pill de fundo animada -->
        <div
          class="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-secondary-900 transition-transform duration-300"
          :class="activeTab === 'tecnico' ? 'translate-x-full' : 'translate-x-0'"
        />
        <button
          class="relative z-10 flex flex-1 items-center justify-center gap-1.5 self-stretch rounded-full px-3 sm:gap-2 sm:px-6"
          @click="activeTab = 'boletim'"
        >
          <Icon
            name="lucide:heart"
            class="size-3.5 sm:size-4"
            :class="activeTab === 'boletim' ? 'text-white' : 'text-primary-600'"
          />
          <span
            class="text-xs sm:text-base"
            :class="activeTab === 'boletim' ? 'font-semibold text-white' : 'text-secondary-700'"
          >
            boletim 5 minutos
          </span>
        </button>
        <button
          class="relative z-10 flex flex-1 items-center justify-center gap-1.5 self-stretch rounded-full px-3 sm:gap-2 sm:px-6"
          @click="activeTab = 'tecnico'"
        >
          <Icon
            name="lucide:clipboard-plus"
            class="size-3.5 sm:size-4"
            :class="activeTab === 'tecnico' ? 'text-white' : 'text-primary-600'"
          />
          <span
            class="text-xs sm:text-base"
            :class="activeTab === 'tecnico' ? 'font-semibold text-white' : 'text-secondary-700'"
          >
            relatório técnico
          </span>
        </button>
      </div>

      <!-- Título e subtítulo -->
      <div class="flex max-w-264 flex-col items-center gap-4 text-center sm:gap-6">
        <h2 class="text-3xl font-bold leading-tight text-primary-950 sm:text-5xl lg:text-6xl">
          {{ title }}
        </h2>
        <p class="text-base leading-relaxed text-secondary-900 sm:text-xl">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <!-- Círculos decorativos -->
    <div class="absolute bottom-0 left-1/2 z-0 -translate-x-1/2 translate-y-1/2">
      <div class="relative size-72 sm:size-100 lg:size-125">
        <div class="absolute inset-0 rounded-full bg-tertiary-300" />
        <div class="absolute inset-[18%] rounded-full bg-primary-700" />
        <div class="absolute inset-[36%] rounded-full bg-primary-900" />
      </div>
    </div>

    <!-- Imagem do mosquito -->
    <div class="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2">
      <div class="relative flex size-72 items-center justify-center sm:size-100 lg:size-125">
        <NuxtImg
          src="/img/relatorio-mosquito.png"
          class="h-auto w-[85%] object-contain drop-shadow-lg"
          alt="Ilustração de mosquito Aedes aegypti"
          loading="eager"
        />
      </div>
    </div>
  </section>
</template>
