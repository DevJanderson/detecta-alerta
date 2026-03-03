<script setup lang="ts">
import type { Level, Trend } from '../composables/types'

const store = useHomeStore()

const levelColors: Record<Level, string> = {
  Baixo: 'text-success-800',
  Médio: 'text-alert-900',
  Alto: 'text-danger-900'
}

const trendIcons: Record<Trend, string> = {
  up: 'lucide:trending-up',
  down: 'lucide:trending-down',
  stable: 'lucide:minus'
}

const trendColors: Record<Trend, string> = {
  up: 'text-danger-700',
  down: 'text-success-700',
  stable: 'text-base-400'
}

const columns = [
  { key: 'todos', label: 'todos' },
  { key: 'drogarias', label: 'Drogarias' },
  { key: 'upa', label: 'UPA' },
  { key: 'ubs', label: 'UBS' }
] as const
</script>

<template>
  <div class="px-6 py-6">
    <div class="mb-20 flex flex-col gap-6">
      <!-- Header -->
      <header class="pl-6 pr-0">
        <h2 class="text-xl font-bold text-base-900">Lotação por estabelecimento</h2>
        <p class="mt-1 text-sm text-base-500">
          Confira locais com lotação acima da média esperada.
        </p>
      </header>

      <!-- Tabela -->
      <div class="overflow-x-auto overflow-y-visible">
        <table class="w-full min-w-[600px] text-sm">
          <thead>
            <tr class="border-b border-base-100">
              <th class="px-4 py-3 text-left font-medium text-secondary-700">
                região
                <Icon name="lucide:info" class="ml-1 inline size-3.5 text-base-400" />
              </th>
              <th
                v-for="col in columns"
                :key="col.key"
                class="px-4 py-3 text-left font-medium text-secondary-700"
              >
                {{ col.label }}
                <Icon name="lucide:info" class="ml-1 inline size-3.5 text-base-400" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in store.regionRows"
              :key="row.region"
              class="border-b border-base-50 transition-colors hover:bg-base-50"
            >
              <td class="px-4 py-3 font-medium text-base-900">{{ row.region }}</td>
              <td v-for="col in columns" :key="col.key" class="px-4 py-3">
                <span class="flex items-center gap-1.5">
                  <span :class="levelColors[row[col.key].level]" class="font-medium">
                    {{ row[col.key].level }}
                  </span>
                  <span class="text-base-500">&#x2022; {{ row[col.key].value }}</span>
                  <Icon
                    :name="trendIcons[row[col.key].trend]"
                    :class="trendColors[row[col.key].trend]"
                    class="size-3.5"
                  />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
