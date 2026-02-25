<script setup lang="ts">
const estados = [
  'Todos os Estados',
  'Acre',
  'Alagoas',
  'Amapá',
  'Amazonas',
  'Bahia',
  'Ceará',
  'Distrito Federal',
  'Espírito Santo',
  'Goiás',
  'Maranhão',
  'Mato Grosso',
  'Mato Grosso do Sul',
  'Minas Gerais',
  'Pará',
  'Paraíba',
  'Paraná',
  'Pernambuco',
  'Piauí',
  'Rio de Janeiro',
  'Rio Grande do Norte',
  'Rio Grande do Sul',
  'Rondônia',
  'Roraima',
  'Santa Catarina',
  'São Paulo',
  'Sergipe',
  'Tocantins'
]

const selectedEstado = ref(estados[0])
const selectedSemana = ref('Semana 4 (25 a 31 jan. 2026)')
</script>

<template>
  <div
    class="flex flex-col items-start justify-start gap-4 border-b border-base-50 px-6 pt-6 pb-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:pt-8 lg:pb-6"
  >
    <!-- Filtro de Estado -->
    <div class="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
      <span class="text-sm font-medium text-base-600">Estado:</span>
      <select
        v-model="selectedEstado"
        class="rounded-md border border-base-100 bg-base-0 px-3 py-2 text-sm text-base-900 focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500 focus:outline-none"
      >
        <option v-for="estado in estados" :key="estado" :value="estado">
          {{ estado }}
        </option>
      </select>
    </div>

    <!-- Separador vertical (desktop) -->
    <div class="hidden h-12 w-0 border-l border-primary-100 lg:block" />

    <!-- Filtro de Semana Epidemiológica -->
    <div class="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
      <span class="text-sm font-medium text-base-600">Semana Epidemiológica:</span>
      <div
        class="flex items-center gap-2 rounded-md border border-base-100 bg-base-0 px-3 py-2 text-sm text-base-900"
      >
        <Icon name="lucide:calendar" class="size-4 text-secondary-600" />
        <span>{{ selectedSemana }}</span>
        <Icon name="lucide:chevron-down" class="size-4 text-base-400" />
      </div>
    </div>
  </div>
</template>
