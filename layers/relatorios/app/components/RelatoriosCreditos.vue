<template>
  <section class="flex items-center justify-center bg-secondary-200 px-4 py-10 sm:px-6 sm:py-16">
    <div class="flex w-full max-w-332 flex-col gap-8 sm:flex-row sm:items-center sm:gap-16">
      <!-- Criado por -->
      <div class="flex flex-1 flex-col gap-3">
        <p class="text-sm font-semibold leading-tight text-secondary-600">Criado por:</p>
        <p class="text-sm leading-normal text-base-950">
          Relatório automático criado em
          <a href="#" class="text-danger-600 underline">Detecta Alerta</a>, utilizando dados do
          <a href="#" class="text-danger-600 underline">Sinapse</a>.
        </p>
      </div>

      <!-- Separador -->
      <div class="h-px w-full bg-secondary-300 sm:h-18 sm:w-px" />

      <!-- Última edição por -->
      <div class="flex flex-1 flex-col gap-3">
        <p class="text-sm font-semibold leading-tight text-secondary-600">Última edição por:</p>
        <div class="flex items-center gap-3">
          <div class="size-14 shrink-0 rounded-full bg-secondary-300" />
          <div class="flex flex-col gap-2">
            <p class="text-sm font-semibold leading-tight text-base-950">Dra. Clarisse Lispector</p>
            <p class="text-xs text-base-950">Pesquisadora-chefe em ITpS</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
