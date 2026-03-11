<template>
  <div
    class="relative z-10 flex flex-col gap-8 border-b border-secondary-200 bg-secondary-100 px-4 py-10 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-40 lg:py-20"
  >
    <!-- Coluna esquerda -->
    <div class="flex flex-col items-start gap-4 sm:gap-6">
      <div class="flex flex-col items-start gap-2 sm:gap-3">
        <h3 class="text-2xl font-semibold leading-normal text-secondary-900 sm:text-4xl">
          Movimento Elevado
        </h3>
        <p class="text-sm text-base-950 sm:text-base">
          Movimento em estabelecimentos de saúde maior que a semana anterior.
        </p>
      </div>
      <div class="flex h-9 items-center gap-2 rounded-full bg-alert-900 px-4 sm:h-10 sm:px-5">
        <Icon name="lucide:arrow-up" class="size-4 text-base-950 sm:size-5" />
        <span class="text-sm font-semibold text-base-950 sm:text-base"
          >23% mais elevado que o normal</span
        >
      </div>
    </div>

    <!-- Coluna direita -->
    <div class="flex flex-col items-start gap-4">
      <p class="max-w-111 text-sm leading-normal text-secondary-900 sm:text-base">
        Dados de movimento indicam semana com aumento de 23% em estabelecimentos de saúde nas
        regiões Nordeste e Sul. Rumores indicam maior número de
        <a href="#" class="underline">notícias sobre Dengue no Nordeste</a>
        e
        <a href="#" class="underline">Influenza A na Região Sul</a>.
      </p>
      <div class="flex flex-wrap items-center gap-3 text-xs">
        <p class="text-base-800">
          <span class="font-semibold">Fonte</span>: <a href="#" class="underline">Sinapse</a>, 2026.
        </p>
        <div class="h-3 w-px bg-base-300" />
        <div class="flex items-center gap-1.5">
          <Icon name="lucide:lock" class="size-2.5 text-success-900" />
          <span class="text-success-900">Padrão de confiança ITpS</span>
        </div>
      </div>
    </div>
  </div>
</template>
