<script setup lang="ts">
const store = useHomeStore()

function onEstadoChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  store.setEstado(value)
}

function onSemanaChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  store.setSemana(value)
}
</script>

<template>
  <div
    class="flex flex-col items-stretch gap-4 px-4 pt-6 pb-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:pt-8 lg:pb-6"
  >
    <!-- Filtro de Estado -->
    <div class="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
      <label for="state-select" class="pl-4 text-sm text-base-950 lg:pl-0">Estado:</label>
      <div class="relative">
        <select
          id="state-select"
          :value="store.filtros.estado"
          class="h-10 w-full cursor-pointer appearance-none rounded-full border border-base-100 bg-base-0 pr-10 pl-5 text-sm text-base-950 focus:ring-2 focus:ring-primary-500 focus:outline-none lg:w-60"
          @change="onEstadoChange"
        >
          <option v-for="estado in store.estados" :key="estado.value" :value="estado.value">
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

    <!-- Filtro de Semana Epidemiologica -->
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
          :value="store.filtros.semana"
          class="h-10 w-full cursor-pointer appearance-none rounded-full border border-base-100 bg-base-0 pr-10 pl-11 text-sm text-base-950 focus:ring-2 focus:ring-primary-500 focus:outline-none lg:w-80"
          @change="onSemanaChange"
        >
          <option v-for="semana in store.semanas" :key="semana.value" :value="semana.value">
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
