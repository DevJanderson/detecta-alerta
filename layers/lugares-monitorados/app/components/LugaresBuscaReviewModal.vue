<script setup lang="ts">
import type { ResultadoBusca } from '../composables/useBuscaExterna'
import { TIPO_UNIDADE_LABELS } from '../composables/types'
import type { TipoUnidade } from '../composables/types'

const props = defineProps<{
  places: ResultadoBusca[]
}>()

const emit = defineEmits<{
  close: []
  remove: [placeId: string]
  updateField: [placeId: string, field: string, value: string]
  updateType: [placeId: string, tipo: TipoUnidade]
}>()

const isImporting = ref(false)
const importDone = ref(false)
const importProgress = ref(0)
const successCount = ref(0)
const importTotal = ref(0)

const tipoOptions = Object.entries(TIPO_UNIDADE_LABELS).map(([value, label]) => ({
  value: value as TipoUnidade,
  label
}))

async function handleImport() {
  isImporting.value = true
  importProgress.value = 0
  importTotal.value = props.places.length

  for (let i = 0; i < props.places.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 400))
    importProgress.value = Math.round(((i + 1) / props.places.length) * 100)
  }

  successCount.value = props.places.length
  importDone.value = true
  isImporting.value = false
}

const progressPercent = computed(() => `${importProgress.value}%`)

function updateField(placeId: string, field: string, event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('updateField', placeId, field, value)
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="emit('close')"
    >
      <div
        class="mx-4 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-base-100 bg-secondary-50 px-6 py-4"
        >
          <div class="flex items-center gap-2">
            <Icon name="lucide:file-check" class="size-5 text-secondary-700" />
            <div>
              <h2 class="text-sm font-semibold text-base-900">Revisar Unidades</h2>
              <p class="text-xs text-base-500">
                {{ places.length }} unidade{{ places.length !== 1 ? 's' : '' }} para importar
              </p>
            </div>
          </div>
          <button
            class="flex size-8 items-center justify-center rounded-md text-base-400 hover:bg-base-100 hover:text-base-600"
            @click="emit('close')"
          >
            <Icon name="lucide:x" class="size-4" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Success -->
          <div v-if="importDone" class="flex flex-col items-center gap-3 py-8 text-center">
            <div class="flex size-12 items-center justify-center rounded-full bg-success-50">
              <Icon name="lucide:check" class="size-6 text-success-600" />
            </div>
            <h3 class="text-lg font-semibold text-base-900">Importação Concluída!</h3>
            <p class="text-sm text-base-500">
              {{ successCount }} unidade{{ successCount !== 1 ? 's' : '' }} importada{{
                successCount !== 1 ? 's' : ''
              }}
              com sucesso.
            </p>
          </div>

          <!-- Progress -->
          <div v-else-if="isImporting" class="flex flex-col items-center gap-4 py-8">
            <CommonLoadingSpinner />
            <p class="text-sm font-medium text-base-700">Importando unidades...</p>
            <div class="w-full max-w-xs">
              <div class="h-2 w-full overflow-hidden rounded-full bg-base-100">
                <div
                  class="h-full rounded-full bg-secondary-500 transition-all duration-300"
                  :style="{ width: progressPercent }"
                />
              </div>
              <p class="mt-1 text-center text-xs text-base-400">
                {{ Math.round((importProgress / 100) * importTotal) }} de {{ importTotal }}
              </p>
            </div>
          </div>

          <!-- Review cards -->
          <div v-else class="space-y-4">
            <div
              v-for="(place, index) in places"
              :key="place.placeId"
              class="rounded-lg border border-base-200 p-4"
            >
              <!-- Card header -->
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span
                    class="flex size-6 items-center justify-center rounded-full bg-secondary-100 text-xs font-medium text-secondary-700"
                  >
                    {{ index + 1 }}
                  </span>
                  <select
                    :value="place.tipo"
                    class="h-7 rounded border border-base-200 bg-white px-2 text-xs text-base-700 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
                    @change="
                      emit(
                        'updateType',
                        place.placeId,
                        ($event.target as HTMLSelectElement).value as TipoUnidade
                      )
                    "
                  >
                    <option v-for="opt in tipoOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
                <button
                  class="flex size-7 items-center justify-center rounded-md text-base-400 hover:bg-danger-50 hover:text-danger-600"
                  title="Remover"
                  @click="emit('remove', place.placeId)"
                >
                  <Icon name="lucide:x" class="size-4" />
                </button>
              </div>

              <!-- Fields editáveis -->
              <div class="space-y-2">
                <!-- Nome -->
                <div>
                  <label class="mb-0.5 block text-xs text-base-400">Nome</label>
                  <input
                    :value="place.nome"
                    type="text"
                    class="h-8 w-full rounded border border-base-200 bg-white px-2 text-sm text-base-900 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
                    @input="updateField(place.placeId, 'nome', $event)"
                  />
                </div>

                <!-- Endereço -->
                <div>
                  <label class="mb-0.5 block text-xs text-base-400">Endereço</label>
                  <input
                    :value="place.endereco"
                    type="text"
                    class="h-8 w-full rounded border border-base-200 bg-white px-2 text-sm text-base-900 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
                    @input="updateField(place.placeId, 'endereco', $event)"
                  />
                </div>

                <!-- Cidade, UF, Bairro, IBGE -->
                <div class="grid grid-cols-4 gap-2">
                  <div>
                    <label class="mb-0.5 block text-xs text-base-400">Cidade</label>
                    <input
                      :value="place.cidade"
                      type="text"
                      class="h-8 w-full rounded border border-base-200 bg-white px-2 text-sm text-base-900 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
                      @input="updateField(place.placeId, 'cidade', $event)"
                    />
                  </div>
                  <div>
                    <label class="mb-0.5 block text-xs text-base-400">UF</label>
                    <input
                      :value="place.estado"
                      type="text"
                      maxlength="2"
                      class="h-8 w-full rounded border border-base-200 bg-white px-2 text-sm uppercase text-base-900 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
                      @input="updateField(place.placeId, 'estado', $event)"
                    />
                  </div>
                  <div>
                    <label class="mb-0.5 block text-xs text-base-400">Bairro</label>
                    <input
                      :value="place.bairro"
                      type="text"
                      class="h-8 w-full rounded border border-base-200 bg-white px-2 text-sm text-base-900 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
                      @input="updateField(place.placeId, 'bairro', $event)"
                    />
                  </div>
                  <div>
                    <label class="mb-0.5 block text-xs text-base-400">Avaliação</label>
                    <input
                      :value="place.nota ? `${place.nota} (${place.avaliacoes})` : '—'"
                      type="text"
                      disabled
                      class="h-8 w-full rounded border border-base-200 bg-base-50 px-2 text-sm text-base-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 border-t border-base-100 px-6 py-3">
          <button
            class="inline-flex items-center gap-1.5 rounded-lg border border-base-200 px-4 py-2 text-sm font-medium text-base-700 transition-colors hover:bg-base-50"
            @click="emit('close')"
          >
            {{ importDone ? 'Fechar' : 'Cancelar' }}
          </button>
          <button
            v-if="!importDone"
            class="inline-flex items-center gap-1.5 rounded-lg bg-secondary-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary-800 disabled:opacity-50"
            :disabled="isImporting || places.length === 0"
            @click="handleImport"
          >
            <Icon v-if="isImporting" name="lucide:loader-2" class="size-4 animate-spin" />
            <Icon v-else name="lucide:download" class="size-4" />
            Salvar Todas as Unidades
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
