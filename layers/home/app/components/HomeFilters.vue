<script setup lang="ts">
const estados = [
  { value: '', label: 'Todos os Estados' },
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]

// Mock semanas epidemiológicas
const semanas = [
  { value: '4', label: 'Semana 4 (25 a 31 jan. 2026)' },
  { value: '3', label: 'Semana 3 (18 a 24 jan. 2026)' },
  { value: '2', label: 'Semana 2 (11 a 17 jan. 2026)' },
  { value: '1', label: 'Semana 1 (04 a 10 jan. 2026)' }
]

const selectedEstado = ref('')
const selectedSemana = ref('4')
</script>

<template>
  <div
    class="flex flex-col items-start justify-start gap-4 border-b border-base-50 px-6 pt-6 pb-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:pt-8 lg:pb-6"
  >
    <!-- Filtro de Estado -->
    <div class="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
      <label for="state-select" class="pl-4 text-sm text-base-950 lg:pl-0">Estado:</label>
      <div class="relative">
        <select
          id="state-select"
          v-model="selectedEstado"
          class="h-10 min-w-48 cursor-pointer appearance-none rounded-full border border-base-100 bg-base-0 pr-10 pl-5 text-sm text-base-950 focus:ring-2 focus:ring-primary-500 focus:outline-none lg:w-60"
        >
          <option v-for="estado in estados" :key="estado.value" :value="estado.value">
            {{ estado.label }}
          </option>
        </select>
        <Icon
          name="lucide:chevron-down"
          class="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-base-400"
        />
      </div>
    </div>

    <!-- Separador vertical (desktop) -->
    <div class="hidden h-10 w-0 border-l border-primary-100 lg:block" />

    <!-- Filtro de Semana Epidemiológica -->
    <div class="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
      <label for="week-select" class="pl-4 text-sm whitespace-nowrap text-base-950 lg:pl-0">
        Semana Epidemiológica:
      </label>
      <div class="relative">
        <Icon
          name="lucide:calendar-days"
          class="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-primary-900"
        />
        <select
          id="week-select"
          v-model="selectedSemana"
          class="h-10 min-w-64 cursor-pointer appearance-none rounded-full border border-base-100 bg-base-0 pr-10 pl-11 text-sm text-base-950 focus:ring-2 focus:ring-primary-500 focus:outline-none lg:w-80"
        >
          <option v-for="semana in semanas" :key="semana.value" :value="semana.value">
            {{ semana.label }}
          </option>
        </select>
        <Icon
          name="lucide:chevron-down"
          class="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-base-400"
        />
      </div>
    </div>
  </div>
</template>
