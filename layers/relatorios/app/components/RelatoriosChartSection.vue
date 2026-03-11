<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()

const epiWeeks = [
  'SE 39|(21 a 27/09)',
  'SE 40|(28/09 a 04/10)',
  'SE 41|(05 a 11/10)',
  'SE 42|(12 a 18/10)',
  'SE 43|(19 a 25/10)',
  'SE 44|(26/10 a 01/11)',
  'SE 45|(02 a 08/11)',
  'SE 46|(09 a 15/11)',
  'SE 47|(26 a 22/11)',
  'SE 48|(23 a 29/11)'
]
</script>

<template>
  <div class="flex flex-col gap-4 self-center">
    <!-- Chart box -->
    <div
      class="flex w-full max-w-332 flex-col gap-3 rounded-xl bg-secondary-50 px-3 pb-3 pt-4 sm:px-4 sm:pb-4 sm:pt-5"
    >
      <!-- Chart header -->
      <div
        class="flex flex-col gap-3 px-2 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <div class="flex flex-col gap-2">
          <h4 class="text-base font-semibold leading-tight text-base-950 sm:text-xl">
            {{ title }}
          </h4>
          <p class="text-xs text-base-950 sm:text-sm">
            {{ subtitle }}
          </p>
        </div>
        <button
          class="flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold text-secondary-600 sm:text-sm"
        >
          como é feito o cálculo
          <Icon name="lucide:circle-help" class="size-4" />
        </button>
      </div>

      <!-- Chart content -->
      <div
        class="flex flex-col gap-3 rounded-xl border border-secondary-100 bg-white p-3 sm:gap-4 sm:p-6"
      >
        <!-- Content switcher -->
        <div
          class="flex h-10 items-center rounded-full border border-secondary-100 bg-white p-1 sm:h-12"
        >
          <div
            class="flex flex-1 items-center justify-center gap-1.5 self-stretch rounded-full bg-secondary-600 px-3 sm:gap-2 sm:px-6"
          >
            <Icon name="lucide:chart-line" class="size-3.5 text-white sm:size-4" />
            <span class="text-xs font-semibold text-white sm:text-sm">linha</span>
          </div>
          <button
            class="flex flex-1 items-center justify-center gap-1.5 self-stretch rounded-full px-3 sm:gap-2 sm:px-6"
          >
            <Icon name="lucide:chart-no-axes-gantt" class="size-3.5 text-secondary-400 sm:size-4" />
            <span class="text-xs text-secondary-400 sm:text-sm">faixa</span>
          </button>
          <button
            class="flex flex-1 items-center justify-center gap-1.5 self-stretch rounded-full px-3 sm:gap-2 sm:px-6"
          >
            <Icon name="lucide:user" class="size-3.5 text-secondary-400 sm:size-4" />
            <span class="text-xs text-secondary-400 sm:text-sm">tabela</span>
          </button>
        </div>

        <!-- Options: checkboxes + filter chips -->
        <div
          class="flex flex-col gap-3 sm:h-10 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <div class="flex items-center gap-3 sm:gap-5">
            <label class="flex cursor-pointer items-center gap-1.5 sm:gap-2">
              <div
                class="flex size-5 items-center justify-center rounded-sm bg-secondary-950 sm:size-6"
              >
                <Icon name="lucide:check" class="size-3 text-white sm:size-4" />
              </div>
              <span class="text-sm text-secondary-600 sm:text-base">média</span>
              <span class="inline-block w-4 border-t-2 border-dashed border-secondary-600 sm:w-5" />
            </label>
            <label class="flex cursor-pointer items-center gap-1.5 sm:gap-2">
              <div class="size-5 rounded-sm border border-base-100 bg-white sm:size-6" />
              <span class="text-sm text-base-950 sm:text-base">variação</span>
              <span class="flex items-end gap-0.5">
                <span class="h-4.5 w-1 rounded-sm bg-tertiary-100 sm:h-5.5 sm:w-1.5" />
                <span class="h-3.5 w-1 rounded-sm bg-tertiary-500 sm:h-4.5 sm:w-1.5" />
              </span>
            </label>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold text-base-950">Filtrar por:</span>
            <span
              class="flex h-7 items-center justify-center rounded-full bg-secondary-50 px-3 text-xs font-semibold text-secondary-600 sm:h-8 sm:px-4"
              >drogaria</span
            >
            <span
              class="flex h-7 items-center justify-center rounded-full bg-secondary-50 px-3 text-xs font-semibold text-secondary-600 sm:h-8 sm:px-4"
              >UPA</span
            >
            <span
              class="flex h-7 items-center justify-center rounded-full bg-secondary-50 px-3 text-xs font-semibold text-secondary-600 sm:h-8 sm:px-4"
              >UBS</span
            >
          </div>
        </div>

        <!-- Chart placeholder -->
        <div class="flex h-60 items-center justify-center rounded-lg bg-secondary-50/50 sm:h-104">
          <p class="text-sm text-base-400">Gráfico será implementado com ECharts</p>
        </div>

        <!-- Date axis -->
        <div class="hidden border-t border-secondary-100 pt-2 sm:flex">
          <div class="w-10 shrink-0" />
          <div class="flex flex-1 items-center justify-between text-center text-secondary-600">
            <div v-for="se in epiWeeks" :key="se" class="flex flex-1 flex-col gap-0.5">
              <span class="text-xs font-semibold">{{ se.split('|')[0] }}</span>
              <span class="text-[10px]">{{ se.split('|')[1] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Callout: Análise dos Especialistas -->
      <div
        class="flex flex-col gap-3 rounded-xl border border-secondary-100 bg-secondary-50 p-3 sm:flex-row sm:items-start sm:justify-between sm:p-4"
      >
        <div class="flex flex-1 items-start gap-3">
          <div
            class="flex size-8 shrink-0 items-center justify-center rounded-full border border-secondary-100 bg-white"
          >
            <Icon name="lucide:user" class="size-4 text-secondary-600" />
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-sm font-semibold leading-tight text-secondary-600 sm:text-base">
              Análise dos Especialistas
            </p>
            <p class="text-xs leading-normal text-base-950 sm:text-sm">
              Após 3 semanas com elevado movimento, em 18 de outubro iniciou tendência de
              estabilidade. Rumores indicam
              <a href="#" class="text-danger-600 underline"
                >possível surto de dengue em 4 estados</a
              >
              e
              <a href="#" class="text-danger-600 underline">surto de influenza na Região Sul</a>
              iniciando em 20 de outubro.
            </p>
          </div>
        </div>
        <NuxtLink
          to="/rumores"
          class="flex shrink-0 items-center gap-1 px-0.5 py-px text-sm font-semibold text-secondary-600"
        >
          ir para rumores
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
    </div>

    <!-- Source + action buttons -->
    <div
      class="flex w-full max-w-264 flex-col gap-3 self-center sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-3 text-xs">
        <p class="text-base-400">
          <span class="font-semibold">Fonte</span>: <a href="#" class="underline">Sinapse</a>, 2026.
        </p>
        <div class="h-3 w-px bg-base-300" />
        <div class="flex items-center gap-1.5">
          <Icon name="lucide:lock" class="size-2.5 text-success-900" />
          <span class="text-success-900">Padrão de confiança ITpS</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="flex size-10 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 text-secondary-600 transition-colors hover:bg-secondary-100"
          aria-label="Compartilhar"
        >
          <Icon name="lucide:share-2" class="size-4" />
        </button>
        <button
          class="flex size-10 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 text-secondary-600 transition-colors hover:bg-secondary-100"
          aria-label="Imprimir"
        >
          <Icon name="lucide:printer" class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
