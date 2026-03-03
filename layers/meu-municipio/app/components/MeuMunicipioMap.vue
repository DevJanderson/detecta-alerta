<script setup lang="ts">
const store = useMeuMunicipioStore()
</script>

<template>
  <div class="absolute inset-0 bg-[url('/patterns/pattern-dot.svg')] bg-repeat">
    <!-- Placeholder do mapa Leaflet -->
    <div class="flex h-full items-center justify-center">
      <div class="text-center">
        <Icon name="lucide:map" class="mx-auto size-16 text-secondary-200" />
        <p class="mt-2 text-sm text-base-400">Mapa interativo</p>
        <p class="text-xs text-base-300">(Leaflet — integração futura)</p>
        <p v-if="store.municipioSelecionado" class="mt-1 text-xs text-base-400">
          {{ store.unidadesFiltradas.length }} unidades no mapa
        </p>
      </div>
    </div>

    <!-- Zoom controls (bottom-right) -->
    <div class="absolute bottom-6 right-6 z-10 flex flex-col gap-0.5">
      <button
        class="flex size-8 items-center justify-center rounded-t-md bg-white text-base-600 shadow-md hover:bg-base-50"
      >
        +
      </button>
      <button
        class="flex size-8 items-center justify-center rounded-b-md bg-white text-base-600 shadow-md hover:bg-base-50"
      >
        −
      </button>
    </div>
  </div>
</template>
