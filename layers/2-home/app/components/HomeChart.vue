<script setup lang="ts">
// Mock — gráfico será integrado com ApexCharts ou similar
const chartTypes = [
  { id: 'line', label: 'gráfico de linhas', icon: 'lucide:chart-line' },
  { id: 'area', label: 'gráfico de faixa', icon: 'lucide:chart-area' }
]

const activeChart = ref('line')
const showVariation = ref(true)
const showAverage = ref(true)

const filters = ['UBS', 'UPA', 'drogaria']
const activeFilter = ref('UBS')
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <header class="flex flex-col gap-1 pl-6 pr-0">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-base-900">Lotação Semanal vs. Média Histórica</h2>
        </div>
        <p class="text-sm text-base-500">
          Últimas 8 semanas. Para acessar o histórico completo,
          <NuxtLink to="#" class="text-secondary-700 underline hover:text-secondary-900">
            acesse aqui
          </NuxtLink>
        </p>
      </header>

      <!-- Controles do gráfico -->
      <div class="flex flex-col gap-4 px-6">
        <!-- Tipo de gráfico -->
        <div class="flex items-center gap-4">
          <button
            v-for="type in chartTypes"
            :key="type.id"
            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors"
            :class="
              activeChart === type.id
                ? 'bg-secondary-50 font-medium text-secondary-900'
                : 'text-base-500 hover:text-base-700'
            "
            @click="activeChart = type.id"
          >
            <Icon :name="type.icon" class="size-4" />
            {{ type.label }}
          </button>
        </div>

        <!-- Toggles + filtros -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-6">
            <label class="flex cursor-pointer items-center gap-2 text-sm text-base-700">
              <Switch
                v-model:checked="showVariation"
                default-checked
                class="h-5 w-9 data-[state=checked]:bg-secondary-700 [&>span]:size-4 [&>span]:data-[state=checked]:translate-x-4"
              />
              mostrar variação
            </label>
            <label class="flex cursor-pointer items-center gap-2 text-sm text-base-700">
              <Switch
                v-model:checked="showAverage"
                default-checked
                class="h-5 w-9 data-[state=checked]:bg-secondary-700 [&>span]:size-4 [&>span]:data-[state=checked]:translate-x-4"
              />
              mostrar média
            </label>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-base-600">Filtrar por:</span>
            <button
              v-for="filter in filters"
              :key="filter"
              class="rounded-full border px-3 py-1 text-sm transition-colors"
              :class="
                activeFilter === filter
                  ? 'border-secondary-900 bg-secondary-900 font-medium text-white'
                  : 'border-base-200 text-base-600 hover:border-secondary-300'
              "
              @click="activeFilter = filter"
            >
              {{ filter }}
            </button>
          </div>
        </div>

        <!-- Placeholder do gráfico -->
        <div
          class="flex h-64 items-center justify-center rounded-lg border border-dashed border-base-200 bg-base-50"
        >
          <div class="text-center">
            <Icon name="lucide:chart-line" class="mx-auto size-12 text-base-300" />
            <p class="mt-2 text-sm text-base-400">Gráfico de lotação semanal</p>
            <p class="text-xs text-base-300">(ApexCharts — integração futura)</p>
          </div>
        </div>

        <!-- Legenda -->
        <div class="flex flex-wrap items-center justify-between gap-4 text-xs text-base-500">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-full bg-secondary-700" />
              Lotação Atual
            </span>
            <span class="flex items-center gap-1.5">
              <span class="h-px w-4 border-t border-dashed border-base-400" />
              Média Móvel
            </span>
          </div>
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-full bg-base-200" />
              Normal
            </span>
            <span class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-full bg-alert-400" />
              Moderado
            </span>
            <span class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-full bg-danger-600" />
              Elevado
            </span>
          </div>
        </div>
      </div>

      <!-- Card "Análise dos Especialistas" -->
      <div class="mx-6 flex items-center gap-4 rounded-lg border border-base-100 bg-base-50 p-6">
        <Icon name="lucide:user-round" class="size-8 shrink-0 text-primary-700" />
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-primary-900">Análise dos Especialistas</h3>
          <p class="mt-1 text-sm text-base-600">
            Observa-se tendência de aumento nas últimas semanas. O movimento atual em UBS, UPAs e
            Drogarias está ligeiramente acima da média.
          </p>
        </div>
        <NuxtLink
          to="/rumores"
          class="flex shrink-0 items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-900"
        >
          ir para rumores
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
