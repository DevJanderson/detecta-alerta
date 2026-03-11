<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Relatórios - Detecta Alerta',
  description:
    'Acesse relatórios epidemiológicos detalhados com dados consolidados de vigilância em saúde.'
})

const activeTab = ref('nacionais')

// --- Mock data (será substituído por dados da API) ---
const reports = [
  { number: 45, dateRange: '9 a 15 nov. 2025', region: 'Todo o Brasil', isNew: true },
  { number: 44, dateRange: '2 a 8 nov. 2025', region: 'Todo o Brasil' },
  {
    number: 43,
    dateRange: '26 out. a 1 nov. 2025',
    region: 'Todo o Brasil',
    editedBy: 'Nome do Doutor',
    editedAgo: 'há 2 dias'
  },
  {
    number: 42,
    dateRange: '19 a 25 out. 2025',
    region: 'Todo o Brasil',
    editedBy: 'Nome do Doutor',
    editedAgo: 'há 2 dias'
  },
  {
    number: 41,
    dateRange: '12 a 18 out. 2025',
    region: 'Todo o Brasil',
    editedBy: 'Nome do Doutor',
    editedAgo: 'há 2 dias'
  },
  {
    number: 40,
    dateRange: '5 a 11 out. 2025',
    region: 'Todo o Brasil',
    editedBy: 'Nome do Doutor',
    editedAgo: 'há 2 dias'
  },
  {
    number: 39,
    dateRange: '28 set. a 4 out. 2025',
    region: 'Todo o Brasil',
    editedBy: 'Nome do Doutor',
    editedAgo: 'há 2 dias'
  },
  {
    number: 38,
    dateRange: '21 a 27 set. 2025',
    region: 'Todo o Brasil',
    editedBy: 'Nome do Doutor',
    editedAgo: 'há 2 dias'
  },
  { number: 37, dateRange: '14 a 20 set. 2025', region: 'Todo o Brasil' },
  {
    number: 36,
    dateRange: '7 a 13 set. 2025',
    region: 'Todo o Brasil',
    editedBy: 'Nome do Doutor',
    editedAgo: 'há 2 dias'
  },
  {
    number: 35,
    dateRange: '31 ago. a 6 set. 2025',
    region: 'Todo o Brasil',
    editedBy: 'Nome do Doutor',
    editedAgo: 'há 2 dias'
  },
  { number: 34, dateRange: '24 a 30 ago. 2025', region: 'Todo o Brasil' }
]
</script>

<template>
  <div class="flex flex-col items-center gap-14 px-6 py-16 lg:px-40">
    <!-- Header -->
    <div class="flex w-full items-center gap-3">
      <!-- Ícone losango -->
      <div class="flex size-23 items-center justify-center">
        <div class="-rotate-45 rounded-xl bg-secondary-50 p-4">
          <Icon name="lucide:notepad-text" size="28" class="rotate-45 text-secondary-600" />
        </div>
      </div>

      <!-- Título -->
      <div class="flex flex-col gap-2">
        <h1 class="text-[28px] font-semibold leading-tight text-secondary-600">Relatórios</h1>
        <p class="text-sm text-base-400">Confira ou edite relatórios.</p>
      </div>
    </div>

    <!-- Content switcher + busca + cards -->
    <div class="flex w-full flex-col gap-10">
      <!-- Content switcher -->
      <div class="rounded-full bg-secondary-50 p-2">
        <div class="flex items-center rounded-full border border-secondary-200 bg-white p-1">
          <button
            class="flex-1 rounded-full px-6 py-3 text-center text-base font-semibold transition-colors"
            :class="
              activeTab === 'nacionais'
                ? 'bg-secondary-600 text-white'
                : 'text-secondary-400 hover:text-secondary-600'
            "
            @click="activeTab = 'nacionais'"
          >
            relatório nacionais
          </button>
          <button
            class="flex-1 rounded-full px-6 py-3 text-center text-base transition-colors"
            :class="
              activeTab === 'municipais'
                ? 'bg-secondary-600 text-white font-semibold'
                : 'text-secondary-400 hover:text-secondary-600'
            "
            @click="activeTab = 'municipais'"
          >
            relatório municipais
          </button>
        </div>
      </div>

      <!-- Busca + filtro de ano -->
      <div class="flex gap-2 px-2">
        <div
          class="flex flex-1 items-center gap-1 rounded-full border border-base-100 bg-white px-4 py-3"
        >
          <Icon name="lucide:search" class="size-5 text-base-400" />
          <span class="pl-1 text-base text-base-400">Número ou tema do relatório</span>
        </div>
        <div
          class="flex w-62 items-center gap-1 rounded-full border border-base-100 bg-white px-4 py-3"
        >
          <Icon name="lucide:calendar-days" class="size-5 text-secondary-500" />
          <span class="flex-1 pl-1 text-base text-base-950">Todos os anos</span>
          <Icon name="lucide:chevron-down" class="size-5 text-base-400" />
        </div>
      </div>

      <!-- Grid de cards -->
      <div class="grid grid-cols-4 gap-6 px-2">
        <RelatoriosCard v-for="report in reports" :key="report.number" v-bind="report" />
      </div>
    </div>

    <!-- Carregar mais -->
    <button
      class="flex items-center gap-2 rounded-full border border-secondary-200 bg-secondary-50 px-5 py-3 text-base font-semibold text-secondary-600 transition-colors hover:bg-secondary-100"
    >
      <Icon name="lucide:plus" class="size-5" />
      carregar mais relatórios
    </button>
  </div>
</template>
