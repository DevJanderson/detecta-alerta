<script setup lang="ts">
defineProps<{
  sectionLabel: string
  sectionTitle: string
  chartTitle: string
  chartSubtitle: string
}>()
</script>

<template>
  <section class="flex w-full max-w-264 flex-col gap-10 sm:gap-16">
    <!-- Título + texto -->
    <div class="flex flex-col gap-6 sm:gap-8">
      <div class="flex flex-col gap-2 sm:gap-3">
        <p class="text-sm font-semibold leading-tight text-secondary-600 sm:text-base">
          {{ sectionLabel }}
        </p>
        <h3 class="text-2xl font-semibold leading-snug text-base-950 sm:text-4xl">
          Movimento elevado em estabelecimentos de saúde de todo o Brasil
        </h3>
      </div>

      <!-- Texto descritivo -->
      <div class="text-base leading-[1.7] text-secondary-600 sm:text-xl sm:pr-32">
        <p class="mb-4 sm:mb-6">
          Dados sobre movimento em estabelecimentos de saúde indicam tendência de crescimento no
          movimento no Nordeste e Sul nesta semana. O movimento atípico nas farmácias do Nordeste
          chama a atenção. Rumores indicam
          <a href="#" class="text-danger-600 underline"
            >aumento no número de notícias sobre Dengue no Nordeste</a
          >.
        </p>
        <p>
          Em contrapartida,
          <a href="#" class="text-danger-600 underline"
            >a região Centro-Oeste demonstra estabilidade</a
          ><sup class="text-[13px] text-danger-600">(1)</sup>, enquanto o Sudeste apresenta ligeira
          melhora nos indicadores de movimento de saúde, conforme
          <a href="#" class="text-danger-600 underline">dados da Fundação Vidas</a
          ><sup class="text-[13px] text-danger-600">(2)</sup>.
        </p>
      </div>
    </div>

    <!-- Gráfico -->
    <RelatoriosChartSection :title="chartTitle" :subtitle="chartSubtitle" />

    <!-- Separador -->
    <div class="h-px w-full bg-secondary-100" />
  </section>
</template>
