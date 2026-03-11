<script setup lang="ts">
const store = useHomeStore()
const mapContainer = ref<HTMLElement | null>(null)
const { map } = useHomeMap(mapContainer)

const headerTitle = computed(() => {
  if (store.filtros.region === 'brasil') return 'Todo o Brasil'
  return store.regionLabel
})

function formatVariation(value: number): string {
  if (!Number.isFinite(value)) return '--%'
  const abs = Math.round(Math.abs(value))
  const sign = value >= 0 ? '+' : '-'
  return `${sign}${abs}%`
}

const headerVariation = computed(() => {
  if (!store.panorama) return null
  return formatVariation(store.panorama.variation)
})

const headerTrend = computed(() => store.panorama?.trend ?? 'stable')

const trendIcon = computed(() => {
  if (headerTrend.value === 'up') return '↑'
  if (headerTrend.value === 'down') return '↓'
  return ''
})

const trendColorClass = computed(() => {
  if (headerTrend.value === 'up') return 'text-primary-950'
  if (headerTrend.value === 'down') return 'text-success-900'
  return 'text-base-600'
})

defineExpose({ map })
</script>

<template>
  <div
    class="relative min-h-70 h-[50vh] overflow-hidden bg-base-50 bg-dot-grid sm:h-[55vh] md:h-[60vh] lg:h-auto lg:flex-1"
  >
    <!-- Mapa MapLibre -->
    <div ref="mapContainer" class="h-full w-full" />

    <!-- Overlay: pointer-events-none no wrapper, pointer-events-auto nos interativos -->
    <div class="pointer-events-none absolute inset-0 z-20">
      <!-- Header: Título + Badge variação -->
      <div class="absolute top-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
        <h2 class="text-lg font-bold text-base-900">{{ headerTitle }}</h2>
        <div
          v-if="headerVariation"
          class="inline-flex items-center gap-1.5 rounded-full border border-secondary-200 bg-base-0/90 px-3 py-1 shadow-sm backdrop-blur-sm"
          :class="trendColorClass"
        >
          <span v-if="trendIcon" class="text-xs font-semibold">{{ trendIcon }}</span>
          <span class="text-xs font-semibold">{{ headerVariation }} vs. semana anterior</span>
        </div>
      </div>

      <!-- Legenda -->
      <div
        class="absolute bottom-20 left-4 flex flex-col items-start gap-1 rounded-md border border-base-100 bg-base-0/90 p-2 shadow-sm backdrop-blur-sm sm:top-4 sm:bottom-auto sm:gap-1.5 sm:p-3"
      >
        <span class="text-xs font-semibold text-base-700">
          Movimento em<br />estabelecimentos de saúde
        </span>
        <div class="flex items-center gap-2">
          <span class="size-3 rounded-full bg-[#B3D5A7]" />
          <span class="text-xs text-base-600">Normal</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="size-3 rounded-full bg-[#F0C653]" />
          <span class="text-xs text-base-600">Moderado</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="size-3 rounded-full bg-[#EB5E57]" />
          <span class="text-xs text-base-600">Elevado</span>
        </div>
      </div>

      <!-- Tooltip "Mapa interativo!" -->
      <div
        class="absolute top-4 right-4 flex w-40 items-start gap-2 rounded-lg border border-danger-200 bg-base-0/90 px-2.5 py-2 shadow-sm backdrop-blur-sm sm:w-52 sm:gap-3 sm:px-3 sm:py-2.5"
      >
        <Icon name="lucide:navigation" class="mt-0.5 size-4 shrink-0 text-danger-500" />
        <div>
          <p class="text-xs font-semibold text-danger-600">Mapa interativo!</p>
          <p class="text-xs text-base-500">Clique em uma região para ver seus estados.</p>
        </div>
      </div>

      <!-- Ações (canto inferior esquerdo) -->
      <div class="pointer-events-auto absolute bottom-16 left-4 flex flex-col gap-2">
        <button
          class="flex size-9 items-center justify-center rounded-full border border-base-200 bg-base-0/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-base-50"
          aria-label="Centralizar mapa"
        >
          <Icon name="lucide:locate" class="size-4 text-base-500" />
        </button>
      </div>

      <!-- Status "Dados via Sinapse" -->
      <div
        v-if="store.panorama"
        class="absolute right-2 bottom-2 flex items-center gap-2 rounded-full border border-success-200 bg-base-0/90 px-2 py-1 shadow-sm backdrop-blur-sm sm:right-4 sm:bottom-4 sm:px-3 sm:py-1.5"
      >
        <span class="size-2 rounded-full bg-success-500" />
        <span class="text-[10px] text-base-500 sm:text-xs">Dados via Sinapse</span>
      </div>
    </div>
  </div>
</template>
