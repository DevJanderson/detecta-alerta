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

    <div
      class="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-base-200"
    >
      <div class="text-center">
        <Icon name="lucide:chart-line" class="mx-auto size-10 text-base-300" />
        <p class="mt-2 text-sm text-base-400">Gráfico de lotação</p>
        <p class="text-xs text-base-300">(ApexCharts — integração futura)</p>
      </div>
    </div>
  </section>
</template>
