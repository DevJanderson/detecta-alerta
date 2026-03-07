<template>
  <section class="flex flex-col gap-4">
    <header class="flex items-center justify-between">
      <div>
        <h3 class="font-heading text-base font-semibold text-base-950">Lotação</h3>
        <p class="mt-0.5 text-xs text-base-600">Movimento das últimas semanas</p>
      </div>
      <span class="rounded-full bg-alert-100 px-3 py-1 text-xs font-semibold text-alert-800">
        Médio
      </span>
    </header>

    <CommonPlaceholderBox
      icon="lucide:chart-line"
      label="Gráfico de lotação"
      sublabel="(ApexCharts — integração futura)"
      class="h-65"
    />
  </section>
</template>
