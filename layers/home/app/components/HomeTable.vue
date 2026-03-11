<script setup lang="ts">
import type { Level, Trend } from '../composables/types'

const store = useHomeStore()

const levelColors: Record<Level, string> = {
  Normal: 'text-success-900',
  Moderado: 'text-alert-950',
  Elevado: 'text-primary-950'
}

const trendIcons: Record<Trend, string> = {
  up: 'lucide:arrow-up',
  down: 'lucide:arrow-down',
  stable: 'lucide:minus'
}

const columns = [
  { key: 'todos', label: 'todos' },
  { key: 'drogarias', label: 'drogarias' },
  { key: 'upa', label: 'UPA' },
  { key: 'ubs', label: 'UBS' }
] as const

function cellColor(level: Level) {
  return levelColors[level]
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- ============================================================
         HEADER: Título + Contadores
         ============================================================ -->
    <header class="flex flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
      <div class="flex flex-col gap-2">
        <h2 class="text-lg font-semibold leading-tight text-base-950 sm:text-xl">
          Lotação por estabelecimento
        </h2>
        <p class="text-sm text-base-800">Confira locais com lotação acima da média esperada.</p>
      </div>

      <!-- Contadores de estabelecimentos -->
      <div
        class="flex flex-col gap-1.5 rounded-md bg-secondary-50 px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2"
      >
        <!-- Drogarias -->
        <span class="flex items-center gap-2 text-xs text-base-800">
          <Icon name="lucide:pill" class="size-3" />
          900 drogarias:
          <span class="flex items-center gap-1 text-primary-950">
            40%
            <Icon name="lucide:arrow-up" class="size-3" />
          </span>
        </span>

        <span class="hidden h-3 w-px bg-base-300 sm:inline-block" />

        <!-- UBS -->
        <span class="flex items-center gap-2 text-xs text-base-800">
          <Icon name="lucide:stethoscope" class="size-3" />
          20 UBS:
          <span class="flex items-center gap-1 text-alert-950">
            7%
            <Icon name="lucide:arrow-up" class="size-3" />
          </span>
        </span>

        <span class="hidden h-3 w-px bg-base-300 sm:inline-block" />

        <!-- UPAs -->
        <span class="flex items-center gap-2 text-xs text-base-800">
          <Icon name="lucide:hospital" class="size-3" />
          20 UPAs:
          <span class="flex items-center gap-1 text-secondary-900">
            4%
            <Icon name="lucide:arrow-down" class="size-3" />
          </span>
        </span>
      </div>
    </header>

    <!-- ============================================================
         TABELA
         ============================================================ -->
    <div class="overflow-x-auto overflow-y-visible px-4 sm:px-6">
      <table class="w-full min-w-[600px] text-sm">
        <thead>
          <tr class="border-b border-base-100">
            <th class="px-4 py-3 text-left font-medium text-secondary-900">
              região
              <Icon name="lucide:info" class="ml-1 inline size-3.5 text-secondary-400" />
            </th>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-left font-medium text-secondary-900"
            >
              {{ col.label }}
              <Icon name="lucide:info" class="ml-1 inline size-3.5 text-secondary-400" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in store.regionRows"
            :key="row.region"
            class="border-b border-base-50 transition-colors hover:bg-base-50"
          >
            <td class="px-4 py-3 font-medium text-base-950">{{ row.region }}</td>
            <td v-for="col in columns" :key="col.key" class="px-4 py-3">
              <span class="flex items-center gap-1.5">
                <span :class="cellColor(row[col.key].level)" class="font-medium">
                  {{ row[col.key].level }}
                </span>
                <span class="text-base-400">&#x2022;</span>
                <span :class="cellColor(row[col.key].level)">
                  {{ row[col.key].value }}
                </span>
                <Icon
                  :name="trendIcons[row[col.key].trend]"
                  :class="cellColor(row[col.key].level)"
                  class="size-3"
                />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ============================================================
         CARD "ANÁLISE DOS ESPECIALISTAS"
         ============================================================ -->
    <div
      class="mx-4 flex flex-col gap-4 rounded-xl border border-secondary-100 bg-secondary-50 p-4 sm:mx-6 sm:flex-row sm:items-start"
    >
      <div class="flex min-w-0 flex-1 items-start gap-3">
        <!-- Ícone avatar -->
        <div
          class="flex size-8 shrink-0 items-center justify-center rounded-full border border-secondary-100 bg-base-0"
        >
          <Icon name="lucide:user" class="size-4 text-secondary-900" />
        </div>
        <!-- Conteúdo -->
        <div class="min-w-0 flex-1 flex-col gap-2">
          <h3 class="text-base font-semibold leading-tight text-secondary-900">
            Análise dos Especialistas
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-base-950">
            A Região Sul encontra-se em cenário de epidemia há 6 semanas. Rumores indicam
            <NuxtLink to="/rumores" class="text-primary-950 underline">
              forte surto de influenza e superlotação em UPAs e UBS</NuxtLink
            >. Além disso, chama a atenção os aumentos de visitas à farmácias na região Nordeste,
            indicando possível epidemia em duas semanas.
          </p>
        </div>
      </div>
      <!-- Link -->
      <NuxtLink
        to="/rumores"
        class="flex shrink-0 items-center gap-1 text-sm font-semibold text-secondary-900 hover:text-secondary-950"
      >
        ir para rumores
        <Icon name="lucide:arrow-right" class="size-4" />
      </NuxtLink>
    </div>

    <!-- ============================================================
         SOURCE BOX
         ============================================================ -->
    <div
      class="flex flex-col gap-2 px-4 text-xs text-base-600 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <p class="flex items-center gap-3">
        <span>
          <span class="font-semibold">Fonte</span>: <span class="underline">Sinapse</span>, 2026
        </span>
        <span class="inline-block h-3 w-px bg-base-300" />
        <span class="flex items-center gap-1.5 text-success-900">
          <Icon name="lucide:lock" class="size-2.5" />
          Padrão de confiança ITpS
        </span>
      </p>
      <NuxtLink
        to="#"
        class="flex items-center gap-1 text-xs font-semibold text-secondary-900 hover:text-secondary-950"
      >
        como são feitos os cálculos
        <Icon name="lucide:circle-help" class="size-4 text-primary-700" />
      </NuxtLink>
    </div>
  </div>
</template>
