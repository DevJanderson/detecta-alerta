<template>
  <section
    class="relative flex items-center justify-center border-b border-secondary-200 bg-secondary-50 px-4 py-16 sm:px-6 sm:py-24 lg:py-32"
  >
    <!-- Dot pattern overlay -->
    <div
      class="pointer-events-none absolute inset-0 opacity-30"
      style="
        background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
        background-size: 20px 20px;
        color: var(--color-secondary-200);
      "
    />

    <div
      class="relative flex w-full max-w-332 flex-col gap-10 lg:flex-row lg:items-start lg:gap-20"
    >
      <!-- Número grande + ornamento -->
      <div class="flex flex-1 flex-col gap-10 lg:gap-20">
        <p class="text-4xl font-bold leading-[1.25] text-secondary-600 sm:text-5xl lg:text-[60px]">
          57% de algum número grande e legal de ser citado.
        </p>
        <div class="flex h-4 items-start gap-2">
          <div class="h-full flex-1 bg-primary-900" />
          <div class="h-full w-[17.5px] bg-primary-950" />
          <div class="h-full w-14 bg-secondary-900" />
        </div>
      </div>

      <!-- Texto descritivo + fonte -->
      <div class="flex flex-1 flex-col gap-6">
        <div class="text-base leading-[1.7] text-secondary-600 sm:text-xl">
          <p class="mb-4 sm:mb-6">
            Este número reflete uma análise aprofundada das taxas de incidência da dengue em áreas
            urbanas e rurais. A pesquisa foi conduzida pela Fundação Saúde Plena, que coletou dados
            de mais de 5.000 postos de saúde em todo o país. Os resultados indicam um aumento
            preocupante nos casos de dengue, especialmente entre crianças e idosos.
          </p>
          <p>
            Em resumo, o aumento de 57% nos casos de dengue é um sinal de alerta para a saúde
            pública. É importante que todos façam a sua parte para prevenir a doença, eliminando
            focos de água parada, usando repelente e procurando atendimento médico em caso de
            sintomas.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-xs">
          <p class="text-base-800">
            <span class="font-semibold">Fonte</span>: <a href="#" class="underline">Sinapse</a>,
            2026.
          </p>
          <div class="h-3 w-px bg-base-300" />
          <div class="flex items-center gap-1.5">
            <Icon name="lucide:lock" class="size-2.5 text-success-900" />
            <span class="text-success-900">Padrão de confiança ITpS</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
