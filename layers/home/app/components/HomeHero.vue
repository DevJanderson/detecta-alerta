<template>
  <section class="px-4 py-10 sm:px-6 sm:py-16 lg:px-20 lg:py-32">
    <div
      class="mx-auto flex flex-col items-center gap-8 sm:gap-10 lg:grid lg:grid-cols-[1fr_34rem_1fr] lg:items-start lg:gap-6"
    >
      <!-- Titulo principal (esquerda) -->
      <h1 class="text-3xl font-bold leading-tight text-primary-950 sm:text-4xl lg:text-6xl">
        Qual o cenário das epidemias no Brasil?
      </h1>

      <!-- Seta + CTA (centro) -->
      <div class="flex flex-col items-center gap-6 lg:self-center">
        <div class="flex flex-col items-center gap-2">
          <span
            class="rounded-full bg-secondary-900 px-2 py-1 text-base font-semibold leading-tight text-white"
          >
            selecione sua região
          </span>
          <p class="text-center text-xs leading-normal text-secondary-900">
            Não se preocupe!
            <br />
            Os dados são abertos. ;)
          </p>
        </div>

        <!-- Seta para baixo -->
        <svg
          class="h-12 text-primary-700 sm:h-16 lg:h-20"
          viewBox="0 0 15 82"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.36 1V0H8.36V1V7.36H6.36V1ZM8.07 81.71C7.68 82.1 7.05 82.1 6.66 81.71L0.29 75.34C-0.1 74.95 -0.1 74.32 0.29 73.93C0.68 73.54 1.32 73.54 1.71 73.93L7.36 79.59L13.02 73.93C13.41 73.54 14.04 73.54 14.44 73.93C14.83 74.32 14.83 74.95 14.44 75.34L8.07 81.71ZM8.36 1V81H7.36H6.36V1H7.36H8.36Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <!-- Resumo de dados (direita) -->
      <div class="flex flex-col items-start gap-5 text-left">
        <!-- Tag de status -->
        <span
          class="inline-flex items-center gap-1 rounded-full border border-success-200 bg-white py-1 pl-1.5 pr-3 text-[10px] leading-normal text-success-700"
        >
          <span class="size-1.5 rounded-full bg-success-500" />
          Atualizado há 2 minutos
        </span>

        <!-- Texto principal -->
        <div class="flex flex-col gap-3">
          <p class="max-w-105 text-base leading-normal text-secondary-800">
            <strong class="font-bold text-secondary-900">Brasil</strong>:
            <span class="text-secondary-600 underline">
              movimento 23% maior que o normal em drogarias e UBSs</span
            >, especialmente nas regiões Sul e Sudeste. Além disso, houve
            <span class="text-secondary-600 underline">
              aumento de 3% nos rumores relacionados à Dengue e Influenza A</span
            >.
          </p>

          <!-- Fonte -->
          <p class="text-xs leading-normal text-base-500">
            <span class="font-semibold">Fonte</span>: <span class="underline">Sinapse</span> e
            <span class="underline">Google Maps</span>, 2026
            <span class="ml-2 inline-flex items-center">
              <span class="mx-2 inline-block h-3 w-px rotate-90 bg-base-300" />
              <Icon name="lucide:lock" class="size-2.5 text-base-400" />
            </span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
