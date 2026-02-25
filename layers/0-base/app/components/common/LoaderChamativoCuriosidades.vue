<script setup lang="ts">
import type { LoaderCuriosidade } from './LoaderCuriosidades.vue'

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
    <!-- Losango grande com curiosidade dentro -->
    <div class="relative size-96">
      <!-- Losango sólido (coral) -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="-rotate-45">
          <div class="size-72 rounded-[40px] bg-brand-primary-900 losango-pulse" />
        </div>
      </div>

      <!-- Conteúdo sobre o losango (branco, não rotacionado) -->
      <div class="absolute inset-0 flex items-center justify-center">
        <Transition name="curiosidade" mode="out-in">
          <div
            v-if="current"
            :key="currentIndex"
            class="flex max-w-52 flex-col items-center gap-4 text-center text-white"
          >
            <div class="flex items-center gap-2">
              <Icon name="lucide:lightbulb" class="size-5" />
              <p class="text-sm font-semibold leading-tight">Você sabia?</p>
            </div>

            <p class="text-lg font-semibold leading-snug">
              {{ current.texto }}
            </p>

            <p v-if="current.fonte" class="text-xs">
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
      </div>
    </div>

    <!-- Texto de progresso (fora do losango, em vermelho) -->
    <div class="flex flex-col items-center gap-2 text-brand-primary-950">
      <p class="text-xl font-semibold">{{ loadingText }}</p>
      <div v-if="percentage !== undefined" class="flex items-baseline gap-1">
        <span class="text-4xl font-semibold leading-snug">{{ percentage }}</span>
        <span class="text-xl font-semibold">%</span>
      </div>
    </div>
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

/* Animação do losango */
.losango-pulse {
  animation: pulse-scale 2.5s ease-in-out infinite;
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
