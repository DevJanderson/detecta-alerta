<script setup lang="ts">
const chartTypes = [
  { id: 'line', label: 'gráfico de linha', icon: 'lucide:chart-line' },
  { id: 'area', label: 'gráfico de faixa', icon: 'lucide:chart-area' }
]

const activeChart = ref('line')
const showAverage = ref(true)
const showVariation = ref(false)

const filters = ['drogaria', 'UPA', 'UBS']
const activeFilter = ref('drogaria')
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- ============================================================
         HEADER: Título + Card de destaque
         ============================================================ -->
    <header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-semibold text-base-950 sm:text-xl">Lotação vs. Média Histórica</h2>
        <p class="text-sm text-base-800">Confira quando a lotação está acima da média histórica.</p>
      </div>
      <div
        class="flex flex-col items-start gap-1 rounded-lg border border-secondary-100 bg-secondary-50 px-4 py-2.5 sm:items-end"
      >
        <p class="flex items-center gap-1.5 text-xs font-semibold text-alert-950">
          23% mais alto que o normal
          <Icon name="lucide:trending-up" class="size-3.5 text-alert-950" />
        </p>
        <p class="text-[10px] text-secondary-900">Tendência de aumento nas próximas semanas.</p>
      </div>
    </header>

    <!-- ============================================================
         CONTROLES DO GRÁFICO
         ============================================================ -->

    <!-- Content Switcher (pill shape) -->
    <div
      class="relative flex h-12 items-center gap-2 rounded-full border border-secondary-100 bg-base-0 p-1"
    >
      <button
        v-for="type in chartTypes"
        :key="type.id"
        class="relative z-10 flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-sm transition-colors"
        :class="
          activeChart === type.id
            ? 'bg-secondary-900 font-semibold text-base-0'
            : 'font-normal text-secondary-700 hover:text-secondary-900'
        "
        @click="activeChart = type.id"
      >
        <Icon :name="type.icon" class="size-4" />
        {{ type.label }}
      </button>
    </div>

    <!-- Checkboxes + filtros -->
    <div
      class="flex flex-col gap-3 px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-6"
    >
      <div class="flex items-center gap-4 sm:gap-5">
        <div class="flex items-center gap-2">
          <label class="flex cursor-pointer items-center gap-2 text-sm text-base-800 sm:text-base">
            <Checkbox
              :checked="showAverage"
              class="size-5 rounded-sm border-base-100 data-[state=checked]:border-secondary-950 data-[state=checked]:bg-secondary-950 sm:size-6"
              @update:checked="showAverage = $event"
            />
            média
          </label>
          <!-- Legenda: linha tracejada da média -->
          <span class="inline-block w-5 border-t-2 border-dashed border-secondary-400 opacity-50" />
        </div>
        <div class="flex items-center gap-2">
          <label class="flex cursor-pointer items-center gap-2 text-sm text-base-800 sm:text-base">
            <Checkbox
              :checked="showVariation"
              class="size-5 rounded-sm border-base-100 sm:size-6"
              @update:checked="showVariation = $event"
            />
            variação
          </label>
          <!-- Legenda: barrinhas de variação -->
          <span class="flex items-end gap-0.5">
            <span class="inline-block h-5.5 w-1.25 bg-tertiary-100" />
            <span class="inline-block h-4.5 w-1.25 bg-tertiary-500" />
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-base-800">Filtrar por:</span>
        <button
          v-for="filter in filters"
          :key="filter"
          class="flex h-7 items-center justify-center rounded-full px-3 text-xs font-semibold transition-colors sm:h-8 sm:px-4"
          :class="
            activeFilter === filter
              ? 'bg-secondary-900 text-base-0'
              : 'bg-secondary-50 text-secondary-900 hover:bg-secondary-100'
          "
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <!-- Gráfico ECharts -->
    <HomeChartLine :show-average="showAverage" :show-variation="showVariation" />

    <!-- ============================================================
         CARD "ANÁLISE DOS ESPECIALISTAS"
         ============================================================ -->
    <div
      class="flex flex-col gap-4 rounded-xl border border-secondary-100 bg-secondary-50 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-6"
    >
      <!-- Ícone avatar -->
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-full border border-secondary-200 bg-base-0"
      >
        <Icon name="lucide:user-round" class="size-5 text-secondary-900" />
      </div>
      <!-- Conteúdo -->
      <div class="min-w-0 flex-1">
        <h3 class="text-base font-semibold text-secondary-900">Análise dos Especialistas</h3>
        <p class="mt-1 text-sm leading-relaxed text-base-800">
          Após 3 semanas com elevado movimento, em 18 de outubro iniciou tendência de estabilidade.
          Rumores indicam
          <NuxtLink to="/rumores" class="font-medium text-primary-950 underline">
            possível surto de dengue em 4 estados </NuxtLink
          >e
          <NuxtLink to="/rumores" class="font-medium text-primary-950 underline">
            surto de influenza na Região Sul
          </NuxtLink>
          iniciando em 20 de outubro.
        </p>
      </div>
      <!-- Link -->
      <NuxtLink
        to="/rumores"
        class="flex shrink-0 items-center gap-1 text-sm font-semibold text-secondary-900 hover:text-secondary-950"
      >
        ir para rumores
        <Icon name="lucide:arrow-right" class="size-4 text-primary-700" />
      </NuxtLink>
    </div>

    <!-- ============================================================
         SOURCE BOX
         ============================================================ -->
    <div
      class="flex flex-col gap-2 text-xs text-base-600 sm:flex-row sm:items-center sm:justify-between"
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
