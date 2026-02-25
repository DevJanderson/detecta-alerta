<template>
  <div
    class="relative min-h-[280px] h-[50vh] bg-[url('/patterns/pattern-dot.svg')] sm:h-[55vh] md:h-[60vh] lg:h-auto lg:flex-1"
  >
    <!-- Legenda -->
    <div
      class="absolute top-6 left-6 z-20 flex flex-col items-start gap-1.5 rounded-md border border-secondary-100 bg-base-0/90 p-2 shadow-sm backdrop-blur-sm"
    >
      <span class="text-xs font-semibold text-base-700">Nível de Movimento:</span>
      <div class="flex items-center gap-1.5">
        <span class="size-3 rounded-full bg-secondary-200" />
        <span class="text-xs text-base-600">Normal</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="size-3 rounded-full bg-alert-400" />
        <span class="text-xs text-base-600">Moderado</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="size-3 rounded-full bg-danger-600" />
        <span class="text-xs text-base-600">Elevado</span>
      </div>
    </div>

    <!-- Tooltip "Clique na região" -->
    <div
      class="absolute top-6 right-6 z-20 flex w-[227px] items-center gap-6 rounded-lg border border-secondary-100 bg-secondary-100 px-4 py-3"
    >
      <Icon name="lucide:mouse-pointer-click" class="size-5 shrink-0 text-secondary-700" />
      <div>
        <p class="text-sm font-semibold text-secondary-900">Clique na região</p>
        <p class="text-xs text-secondary-700">Selecione uma área no mapa para ver os detalhes.</p>
      </div>
    </div>

    <!-- Status "Dados via Sinapse" -->
    <div
      class="absolute bottom-6 left-6 z-20 flex items-center gap-3 rounded-full border border-success-200 bg-base-0 px-3 py-2"
    >
      <Icon name="lucide:sparkles" class="size-4 text-primary-700" />
      <span class="text-xs text-base-600">Dados via Sinapse, há 3 minutos.</span>
      <span class="size-2 rounded-full bg-success-600" />
    </div>

    <!-- Placeholder do mapa (Leaflet será integrado depois) -->
    <div class="absolute inset-0 z-10 flex items-center justify-center">
      <div class="text-center">
        <Icon name="lucide:map" class="mx-auto size-16 text-secondary-200" />
        <p class="mt-2 text-sm text-base-400">Mapa interativo</p>
        <p class="text-xs text-base-300">(Leaflet — integração futura)</p>
      </div>
    </div>
  </div>
</template>
