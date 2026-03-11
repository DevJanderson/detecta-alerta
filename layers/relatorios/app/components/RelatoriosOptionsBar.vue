<script setup lang="ts">
defineProps<{
  epiWeek: number
  dateRange: string
}>()
</script>

<template>
  <div
    class="z-10 flex flex-col gap-3 border-b border-base-100 bg-tertiary-100 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:px-6 sm:py-4 lg:px-40"
  >
    <!-- Dropdown semana epidemiológica -->
    <div class="min-w-0 sm:flex-1">
      <button
        class="flex h-10 w-full items-center gap-1 rounded-full border border-base-100 bg-base-0 px-3 sm:w-auto sm:px-4"
      >
        <Icon name="lucide:calendar-days" class="size-4 shrink-0 text-primary-900" />
        <span class="truncate pl-1">
          <span class="text-sm text-base-950">SE {{ epiWeek }}</span>
          <span class="text-xs text-base-950"> ({{ dateRange }})</span>
        </span>
        <Icon name="lucide:chevron-down" class="size-4 shrink-0 text-base-400" />
      </button>
    </div>

    <!-- Busca de município -->
    <button
      class="flex h-10 w-full items-center gap-3 overflow-hidden rounded-full border border-base-100 bg-base-0 px-4 py-2 sm:w-80 lg:w-113"
    >
      <Icon name="lucide:search" class="size-4 shrink-0 text-primary-900" />
      <div class="flex items-baseline gap-2 truncate">
        <span class="text-sm font-semibold text-base-600">meu município:</span>
        <span class="truncate text-sm text-secondary-700">Digite um município...</span>
      </div>
    </button>

    <!-- Editar relatório -->
    <div class="sm:flex-1 sm:text-right">
      <button
        class="flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-secondary-600 transition-colors hover:bg-tertiary-200"
      >
        <span class="hidden sm:inline">editar relatório da equipe</span>
        <span class="sm:hidden">editar</span>
        <Icon name="lucide:pencil" class="size-4 text-primary-900" />
      </button>
    </div>
  </div>
</template>
