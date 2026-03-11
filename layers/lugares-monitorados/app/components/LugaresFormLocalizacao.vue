<script setup lang="ts">
import type { FormUnidade } from '../composables/useAdicionarUnidadeForm'

const form = defineModel<FormUnidade>({ required: true })

defineProps<{
  cidadesDisponiveis: string[]
  getFieldError: (field: keyof FormUnidade) => string | undefined
}>()

const emit = defineEmits<{
  blur: [field: string]
}>()
</script>

<template>
  <div class="rounded-lg border border-base-200 bg-white">
    <div class="flex items-center gap-2 border-b border-base-100 px-5 py-3">
      <Icon name="lucide:map-pin" class="size-5 text-secondary-700" />
      <h2 class="text-sm font-semibold text-base-900">Localização</h2>
    </div>
    <div class="space-y-4 p-5">
      <!-- Endereço + Bairro -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="endereco" class="mb-1 block text-sm font-medium text-base-700"
            >Rua e número</label
          >
          <input
            id="endereco"
            v-model="form.endereco"
            type="text"
            placeholder="Rua, avenida, número..."
            class="h-9 w-full rounded-lg border border-base-200 bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
          />
        </div>
        <div>
          <label for="bairro" class="mb-1 block text-sm font-medium text-base-700">Bairro</label>
          <input
            id="bairro"
            v-model="form.bairro"
            type="text"
            placeholder="Bairro"
            class="h-9 w-full rounded-lg border border-base-200 bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
          />
        </div>
      </div>

      <!-- Estado + Cidade -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="estado" class="mb-1 block text-sm font-medium text-base-700">
            Estado <span class="text-danger-500">*</span>
          </label>
          <select
            id="estado"
            v-model="form.estado"
            class="h-9 w-full rounded-lg border bg-white px-3 text-sm text-base-700 focus:outline-none focus:ring-1"
            :class="
              getFieldError('estado')
                ? 'border-danger-300 focus:border-danger-300 focus:ring-danger-300'
                : 'border-base-200 focus:border-secondary-300 focus:ring-secondary-300'
            "
            @blur="emit('blur', 'estado')"
          >
            <option value="">Selecione</option>
            <option v-for="uf in ESTADOS_BR" :key="uf" :value="uf">{{ uf }}</option>
          </select>
          <p v-if="getFieldError('estado')" class="mt-1 text-xs text-danger-600">
            {{ getFieldError('estado') }}
          </p>
        </div>
        <div>
          <label for="cidade" class="mb-1 block text-sm font-medium text-base-700">
            Município <span class="text-danger-500">*</span>
          </label>
          <input
            v-if="cidadesDisponiveis.length === 0"
            id="cidade"
            v-model="form.cidade"
            type="text"
            placeholder="Digite o município"
            class="h-9 w-full rounded-lg border bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:outline-none focus:ring-1"
            :class="
              getFieldError('cidade')
                ? 'border-danger-300 focus:border-danger-300 focus:ring-danger-300'
                : 'border-base-200 focus:border-secondary-300 focus:ring-secondary-300'
            "
            @blur="emit('blur', 'cidade')"
          />
          <select
            v-else
            id="cidade"
            v-model="form.cidade"
            class="h-9 w-full rounded-lg border bg-white px-3 text-sm text-base-700 focus:outline-none focus:ring-1"
            :class="
              getFieldError('cidade')
                ? 'border-danger-300 focus:border-danger-300 focus:ring-danger-300'
                : 'border-base-200 focus:border-secondary-300 focus:ring-secondary-300'
            "
            @blur="emit('blur', 'cidade')"
          >
            <option value="">Selecione</option>
            <option v-for="c in cidadesDisponiveis" :key="c" :value="c">{{ c }}</option>
          </select>
          <p v-if="getFieldError('cidade')" class="mt-1 text-xs text-danger-600">
            {{ getFieldError('cidade') }}
          </p>
        </div>
      </div>

      <!-- Coordenadas -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="latitude" class="mb-1 block text-sm font-medium text-base-700"
            >Latitude</label
          >
          <input
            id="latitude"
            v-model.number="form.latitude"
            type="number"
            step="any"
            placeholder="-23.5505"
            class="h-9 w-full rounded-lg border border-base-200 bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
          />
        </div>
        <div>
          <label for="longitude" class="mb-1 block text-sm font-medium text-base-700"
            >Longitude</label
          >
          <input
            id="longitude"
            v-model.number="form.longitude"
            type="number"
            step="any"
            placeholder="-46.6333"
            class="h-9 w-full rounded-lg border border-base-200 bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
          />
        </div>
      </div>
      <p class="text-xs text-base-400">
        As coordenadas podem ser preenchidas manualmente ou via integração futura com mapa
        interativo.
      </p>
    </div>
  </div>
</template>
