<script setup lang="ts">
import { NATIONAL_MOVEMENT } from '../utils/home-map-data'

const mapContainer = ref<HTMLElement | null>(null)
const { map } = useHomeMap(mapContainer)

defineExpose({ map })
</script>

<template>
  <div
    class="relative min-h-70 h-[50vh] overflow-hidden bg-base-50 bg-dot-grid sm:h-[55vh] md:h-[60vh] lg:h-auto lg:flex-1"
  >
    <!-- Mapa MapLibre (h-full w-full para MapLibre calcular dimensões corretamente) -->
    <div ref="mapContainer" class="h-full w-full" />

    <!-- Overlay: pointer-events-none no wrapper, pointer-events-auto nos interativos -->
    <div class="pointer-events-none absolute inset-0 z-20">
      <!-- Header: Título + Badge total -->
      <div class="absolute top-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
        <h2 class="text-lg font-bold text-base-900">Todo o Brasil</h2>
        <div
          class="inline-flex items-center gap-1.5 rounded-full border border-secondary-200 bg-base-0/90 px-3 py-1 shadow-sm backdrop-blur-sm"
        >
          <span class="text-xs font-semibold text-secondary-700">↑</span>
          <span class="text-xs font-semibold text-secondary-700">{{
            NATIONAL_MOVEMENT.label
          }}</span>
        </div>
      </div>

      <!-- Legenda (canto superior esquerdo) -->
      <div
        class="absolute top-4 left-4 hidden flex-col items-start gap-1.5 rounded-md border border-base-100 bg-base-0/90 p-3 shadow-sm backdrop-blur-sm sm:flex"
      >
        <span class="text-xs font-semibold text-base-700">
          Movimento em<br />estabelecimentos de saúde
        </span>
        <div class="flex items-center gap-2">
          <span class="size-3 rounded-full bg-secondary-200" />
          <span class="text-xs text-base-600">Normal</span>
          <Icon name="lucide:help-circle" class="size-3 text-base-400" />
        </div>
        <div class="flex items-center gap-2">
          <span class="size-3 rounded-full bg-alert-400" />
          <span class="text-xs text-base-600">Moderado</span>
          <Icon name="lucide:help-circle" class="size-3 text-base-400" />
        </div>
        <div class="flex items-center gap-2">
          <span class="size-3 rounded-full bg-danger-500" />
          <span class="text-xs text-base-600">Elevado</span>
          <Icon name="lucide:help-circle" class="size-3 text-base-400" />
        </div>
      </div>

      <!-- Tooltip "Mapa interativo!" (canto superior direito) -->
      <div
        class="absolute top-4 right-4 hidden w-52 items-start gap-3 rounded-lg border border-danger-200 bg-base-0/90 px-3 py-2.5 shadow-sm backdrop-blur-sm sm:flex"
      >
        <Icon name="lucide:navigation" class="mt-0.5 size-4 shrink-0 text-danger-500" />
        <div>
          <p class="text-xs font-semibold text-danger-600">Mapa interativo!</p>
          <p class="text-xs text-base-500">Clique e arraste sobre o mapa para interagir.</p>
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
        <button
          class="flex size-9 items-center justify-center rounded-full border border-base-200 bg-base-0/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-base-50"
          aria-label="Minha localização"
        >
          <Icon name="lucide:map-pin" class="size-4 text-danger-500" />
        </button>
      </div>

      <!-- Status "Dados via Sinapse" (canto inferior direito) -->
      <div
        class="absolute right-2 bottom-2 flex items-center gap-2 rounded-full border border-success-200 bg-base-0/90 px-2 py-1 shadow-sm backdrop-blur-sm sm:right-4 sm:bottom-4 sm:px-3 sm:py-1.5"
      >
        <span class="size-2 rounded-full bg-success-500" />
        <span class="text-[10px] text-base-500 sm:text-xs">Dados via Sinapse, há 3 minutos.</span>
      </div>
    </div>
  </div>
</template>
