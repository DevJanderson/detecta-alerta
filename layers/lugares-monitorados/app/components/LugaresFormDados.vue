<script setup lang="ts">
import type { FormUnidade } from '../composables/useAdicionarUnidadeForm'
import { TIPO_UNIDADE_LABELS } from '../composables/types'
import type { TipoUnidade } from '../composables/types'

const form = defineModel<FormUnidade>({ required: true })

defineProps<{
  getFieldError: (field: keyof FormUnidade) => string | undefined
}>()

const emit = defineEmits<{
  blur: [field: string]
}>()

const tipoOptions: { value: TipoUnidade; label: string }[] = [
  { value: 'ubs', label: TIPO_UNIDADE_LABELS.ubs },
  { value: 'upa', label: TIPO_UNIDADE_LABELS.upa },
  { value: 'drogarias', label: TIPO_UNIDADE_LABELS.drogarias },
  { value: 'pet_shop', label: TIPO_UNIDADE_LABELS.pet_shop },
  { value: 'pet_atend', label: TIPO_UNIDADE_LABELS.pet_atend }
]
</script>

<template>
  <div class="rounded-lg border border-base-200 bg-white">
    <div class="flex items-center gap-2 border-b border-base-100 px-5 py-3">
      <Icon name="lucide:building-2" class="size-5 text-secondary-700" />
      <h2 class="text-sm font-semibold text-base-900">Dados da Unidade</h2>
    </div>
    <div class="space-y-4 p-5">
      <!-- Nome -->
      <div>
        <label for="titulo" class="mb-1 block text-sm font-medium text-base-700">
          Nome <span class="text-danger-500">*</span>
        </label>
        <input
          id="titulo"
          v-model="form.titulo"
          type="text"
          placeholder="Nome oficial da unidade"
          class="h-9 w-full rounded-lg border bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:outline-none focus:ring-1"
          :class="
            getFieldError('titulo')
              ? 'border-danger-300 focus:border-danger-300 focus:ring-danger-300'
              : 'border-base-200 focus:border-secondary-300 focus:ring-secondary-300'
          "
          @blur="emit('blur', 'titulo')"
        />
        <p v-if="getFieldError('titulo')" class="mt-1 text-xs text-danger-600">
          {{ getFieldError('titulo') }}
        </p>
      </div>

      <!-- Tipo + Website -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="tipoUnidade" class="mb-1 block text-sm font-medium text-base-700">
            Tipo de estabelecimento <span class="text-danger-500">*</span>
          </label>
          <select
            id="tipoUnidade"
            v-model="form.tipoUnidade"
            class="h-9 w-full rounded-lg border bg-white px-3 text-sm text-base-700 focus:outline-none focus:ring-1"
            :class="
              getFieldError('tipoUnidade')
                ? 'border-danger-300 focus:border-danger-300 focus:ring-danger-300'
                : 'border-base-200 focus:border-secondary-300 focus:ring-secondary-300'
            "
            @blur="emit('blur', 'tipoUnidade')"
          >
            <option value="">Selecione</option>
            <option v-for="opt in tipoOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <p v-if="getFieldError('tipoUnidade')" class="mt-1 text-xs text-danger-600">
            {{ getFieldError('tipoUnidade') }}
          </p>
        </div>
        <div>
          <label for="url" class="mb-1 block text-sm font-medium text-base-700">Website</label>
          <input
            id="url"
            v-model="form.url"
            type="url"
            placeholder="https://..."
            class="h-9 w-full rounded-lg border border-base-200 bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>
