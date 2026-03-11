<script setup lang="ts">
import type { FormUnidade } from '../composables/useAdicionarUnidadeForm'

const form = defineModel<FormUnidade>({ required: true })

defineProps<{
  isEditMode: boolean
  getFieldError: (field: keyof FormUnidade) => string | undefined
}>()

const emit = defineEmits<{
  blur: [field: string]
  generateId: []
}>()
</script>

<template>
  <div class="rounded-lg border border-base-200 bg-white">
    <div class="flex items-center gap-2 border-b border-base-100 px-5 py-3">
      <Icon name="lucide:settings-2" class="size-5 text-secondary-700" />
      <h2 class="text-sm font-semibold text-base-900">Informações Técnicas</h2>
    </div>
    <div class="space-y-4 p-5">
      <!-- Status + IBGE -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="ativa" class="mb-1 block text-sm font-medium text-base-700">
            Status operacional <span class="text-danger-500">*</span>
          </label>
          <select
            id="ativa"
            v-model="form.ativa"
            class="h-9 w-full rounded-lg border border-base-200 bg-white px-3 text-sm text-base-700 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
          >
            <option :value="true">Ativa</option>
            <option :value="false">Inativa</option>
          </select>
        </div>
        <div>
          <label for="codigoIbge" class="mb-1 block text-sm font-medium text-base-700">
            Código IBGE
          </label>
          <input
            id="codigoIbge"
            v-model="form.codigoIbge"
            type="text"
            inputmode="numeric"
            maxlength="7"
            placeholder="3550308"
            class="h-9 w-full rounded-lg border border-base-200 bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
          />
          <p class="mt-1 text-xs text-base-400">Código de 7 dígitos do município</p>
        </div>
      </div>

      <!-- Tempo real + Place ID -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="tempoReal" class="mb-1 block text-sm font-medium text-base-700">
            Monitoramento em tempo real <span class="text-danger-500">*</span>
          </label>
          <select
            id="tempoReal"
            v-model.number="form.tempoReal"
            class="h-9 w-full rounded-lg border border-base-200 bg-white px-3 text-sm text-base-700 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
          >
            <option :value="0">Inativo</option>
            <option :value="1">Ativo</option>
            <option :value="2">Parcial</option>
          </select>
        </div>
        <div>
          <label for="placeId" class="mb-1 block text-sm font-medium text-base-700">
            ID do Local <span class="text-danger-500">*</span>
          </label>
          <div class="flex gap-2">
            <input
              id="placeId"
              v-model="form.placeId"
              type="text"
              :disabled="isEditMode"
              placeholder="MANUAL_SP_SAO_PAULO_..."
              class="h-9 w-full rounded-lg border bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:outline-none focus:ring-1 disabled:bg-base-50 disabled:text-base-500"
              :class="
                getFieldError('placeId')
                  ? 'border-danger-300 focus:border-danger-300 focus:ring-danger-300'
                  : 'border-base-200 focus:border-secondary-300 focus:ring-secondary-300'
              "
              @blur="emit('blur', 'placeId')"
            />
            <button
              v-if="!isEditMode"
              type="button"
              class="shrink-0 rounded-lg border border-base-200 px-3 text-xs font-medium text-secondary-700 transition-colors hover:bg-base-50"
              title="Gerar ID automático"
              @click="emit('generateId')"
            >
              Gerar
            </button>
          </div>
          <p v-if="getFieldError('placeId')" class="mt-1 text-xs text-danger-600">
            {{ getFieldError('placeId') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
