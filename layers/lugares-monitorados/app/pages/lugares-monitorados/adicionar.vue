<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

const {
  form,
  isEditMode,
  cidadesDisponiveis,
  isSubmitting,
  submitError,
  submitSuccess,
  markTouched,
  getFieldError,
  generatePlaceId,
  handleSubmit,
  navigateBack
} = useAdicionarUnidadeForm()

const store = useLugaresMonitoradosStore()
onMounted(() => {
  if (store.unidades.length === 0) store.fetchUnidades()
})

useSeoPage({
  title: isEditMode.value
    ? 'Editar Unidade - Detecta Alerta'
    : 'Adicionar Unidade - Detecta Alerta',
  description: 'Cadastre ou edite uma unidade de saúde para monitoramento.'
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-6 py-10">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <div class="mb-1 flex items-center gap-1.5 text-sm text-base-400">
          <NuxtLink to="/lugares-monitorados" class="hover:text-secondary-700"
            >Lugares monitorados</NuxtLink
          >
          <Icon name="lucide:chevron-right" class="size-3.5" />
          <span class="text-base-600">{{ isEditMode ? 'Editar' : 'Novo Local' }}</span>
        </div>
        <h1 class="text-2xl font-semibold text-base-900">
          {{ isEditMode ? 'Editar Local' : 'Novo Local' }}
        </h1>
        <p class="mt-1 text-sm text-base-500">Preencha os dados da unidade de saúde.</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-1.5 rounded-full border border-base-200 px-4 py-2 text-sm font-medium text-secondary-900 transition-colors hover:bg-base-50"
          @click="navigateBack"
        >
          <Icon name="lucide:x" class="size-4" />
          Cancelar
        </button>
        <button
          class="inline-flex items-center gap-1.5 rounded-full bg-primary-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800 disabled:opacity-50"
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          <Icon v-if="isSubmitting" name="lucide:loader-2" class="size-4 animate-spin" />
          <Icon v-else name="lucide:save" class="size-4" />
          {{ isSubmitting ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>

    <!-- Feedback -->
    <div
      v-if="submitSuccess"
      class="mb-6 flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-900"
    >
      <Icon name="lucide:check-circle" class="size-5 shrink-0" />
      Unidade salva com sucesso! Redirecionando...
    </div>
    <div
      v-if="submitError"
      class="mb-6 flex items-center gap-2 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-900"
    >
      <Icon name="lucide:alert-circle" class="size-5 shrink-0" />
      {{ submitError }}
    </div>

    <!-- Formulário em 4 cards -->
    <div class="space-y-6">
      <LugaresFormDados
        v-model="form"
        :get-field-error="getFieldError"
        @blur="markTouched($event)"
      />
      <LugaresFormLocalizacao
        v-model="form"
        :cidades-disponiveis="cidadesDisponiveis"
        :get-field-error="getFieldError"
        @blur="markTouched($event)"
      />
      <LugaresFormTecnicas
        v-model="form"
        :is-edit-mode="isEditMode"
        :get-field-error="getFieldError"
        @blur="markTouched($event)"
        @generate-id="generatePlaceId"
      />
      <LugaresFormAvaliacao v-model="form" />
    </div>
  </div>
</template>
