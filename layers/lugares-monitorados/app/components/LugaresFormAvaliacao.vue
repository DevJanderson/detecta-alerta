<script setup lang="ts">
import type { FormUnidade } from '../composables/useAdicionarUnidadeForm'

const form = defineModel<FormUnidade>({ required: true })
</script>

<template>
  <div class="rounded-lg border border-base-200 bg-white">
    <div class="flex items-center gap-2 border-b border-base-100 px-5 py-3">
      <Icon name="lucide:star" class="size-5 text-secondary-700" />
      <h2 class="text-sm font-semibold text-base-900">Avaliação</h2>
    </div>
    <div class="space-y-4 p-5">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="notaTotal" class="mb-1 block text-sm font-medium text-base-700">
            Pontuação Total
          </label>
          <input
            id="notaTotal"
            v-model.number="form.notaTotal"
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="0 a 5"
            class="h-9 w-full rounded-lg border border-base-200 bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
          />
        </div>
        <div>
          <label for="totalAvaliacoes" class="mb-1 block text-sm font-medium text-base-700">
            Número de avaliações
          </label>
          <input
            id="totalAvaliacoes"
            v-model.number="form.totalAvaliacoes"
            type="number"
            min="0"
            placeholder="0"
            class="h-9 w-full rounded-lg border border-base-200 bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>
