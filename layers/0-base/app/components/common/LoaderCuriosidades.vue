<script setup lang="ts">
export interface LoaderCuriosidade {
  texto: string
  fonte: string
  fonteUrl?: string
}

const {
  curiosidades = [],
  percentage,
  loadingText = 'Carregando'
} = defineProps<{
  curiosidades?: LoaderCuriosidade[]
  percentage?: number
  loadingText?: string
}>()

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (curiosidades.length > 1) {
    timer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % curiosidades.length
    }, 8000)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const current = computed(() => curiosidades[currentIndex.value])
</script>

<template>
  <div class="flex flex-col items-center gap-10">
    <!-- Curiosidade -->
    <Transition name="curiosidade" mode="out-in">
      <div
        v-if="current"
        :key="currentIndex"
        class="flex max-w-md flex-col items-center gap-4 text-center"
      >
        <div class="flex items-center gap-2 text-brand-primary-950">
          <Icon name="lucide:lightbulb" class="size-6" />
          <p class="text-base font-semibold leading-tight">Voce sabia?</p>
        </div>

        <p class="text-xl leading-relaxed text-brand-primary-950">
          {{ current.texto }}
        </p>

        <p v-if="current.fonte" class="text-xs text-brand-primary-950">
          <span class="font-bold">Fonte</span>:
          <a
            v-if="current.fonteUrl"
            :href="current.fonteUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
          >
            {{ current.fonte }}
          </a>
          <template v-else>{{ current.fonte }}</template>
        </p>
      </div>
    </Transition>

    <!-- Losango grande decorativo com loader no centro -->
    <div class="relative size-50">
      <!-- Losango externo (rosa claro) -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="-rotate-45">
          <div class="size-50 rounded-[36px] bg-brand-primary-100 losango-breathe" />
        </div>
      </div>

      <!-- Losango interno (coral) -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="-rotate-45">
          <div class="size-35 rounded-[36px] bg-brand-primary-900 losango-pulse" />
        </div>
      </div>
    </div>

    <!-- Texto de progresso -->
    <p class="flex items-baseline gap-1 text-xl font-semibold text-brand-secondary-900">
      <span>{{ loadingText }}</span>
      <template v-if="percentage !== undefined">
        <span class="mx-1">&bull;</span>
        <span>{{ percentage }}%</span>
      </template>
    </p>
  </div>
</template>

<style scoped>
/* Transição entre curiosidades */
.curiosidade-enter-active,
.curiosidade-leave-active {
  transition: opacity 0.5s ease;
}

.curiosidade-enter-from,
.curiosidade-leave-to {
  opacity: 0;
}

/* Animações do losango grande */
.losango-breathe {
  animation: breathe 2.5s ease-in-out infinite;
}

.losango-pulse {
  animation: pulse-scale 2.5s ease-in-out infinite;
}

@keyframes breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes pulse-scale {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
