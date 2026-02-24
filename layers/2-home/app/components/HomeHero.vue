<template>
  <section class="px-4 py-16 sm:px-6 lg:px-20 lg:py-32">
    <div
      class="mx-auto flex flex-col items-center gap-10 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-6"
    >
      <!-- Titulo principal (esquerda) -->
      <h1
        class="max-w-xl text-3xl font-bold leading-tight text-brand-primary-950 sm:text-4xl lg:text-6xl"
      >
        Quais os riscos de Surtos ou Epidemias no Brasil?
      </h1>

      <!-- Seta + CTA (centro) -->
      <div class="flex flex-col items-center gap-6 lg:self-center">
        <div class="flex flex-col items-center gap-2">
          <span
            class="rounded-full bg-brand-secondary-900 px-2 py-1 text-base font-semibold leading-tight text-white"
          >
            selecione sua região
          </span>
          <p class="text-center text-xs leading-normal text-brand-secondary-900">
            Não se preocupe!
            <br />
            Os dados são abertos. ;)
          </p>
        </div>

        <!-- Seta para baixo -->
        <svg
          class="h-20 text-brand-primary-700"
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

      <!-- Descricao (direita) -->
      <div
        class="flex max-w-md flex-col items-center gap-4 text-center lg:items-end lg:pt-12 lg:text-right"
      >
        <p class="text-xl leading-relaxed text-brand-secondary-900">
          O Detecta Alerta identifica, através da frequência de visitas em diferentes
          estabelecimentos, padrões que podem indicar
          <strong>potencial risco de epidemias</strong>.
        </p>
        <p class="max-w-xs text-sm leading-normal text-brand-secondary-700">
          *Dados públicos coletados do Google Maps e parcerias com instituições públicas.
        </p>
      </div>
    </div>
  </section>
</template>
