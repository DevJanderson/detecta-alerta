<script setup lang="ts">
const store = useMeuMunicipioStore()
const emit = defineEmits<{ collapse: [] }>()

const totalUnidades = computed(() => store.unitTypeSummaries.reduce((sum, s) => sum + s.count, 0))
</script>

<template>
  <div class="flex items-start justify-between gap-3 px-5 pb-3 pt-5">
    <div>
      <h2 class="text-lg font-bold text-base-900">
        {{ store.municipioLabel }}
      </h2>
      <p class="mt-0.5 text-sm text-base-500">
        {{ totalUnidades.toLocaleString('pt-BR') }} unidades ativas
      </p>
    </div>
    <div class="flex items-center gap-1">
      <button
        class="rounded-lg p-2 text-base-400 transition-colors hover:bg-base-50 hover:text-base-600"
        title="Compartilhar"
      >
        <Icon name="lucide:share-2" class="size-4" />
      </button>
      <button
        class="rounded-lg p-2 text-base-400 transition-colors hover:bg-base-50 hover:text-base-600"
        title="Imprimir"
      >
        <Icon name="lucide:printer" class="size-4" />
      </button>
      <button
        class="rounded-lg p-2 text-base-400 transition-colors hover:bg-base-50 hover:text-base-600"
        title="Colapsar menu"
        @click="emit('collapse')"
      >
        <Icon name="lucide:panel-right-close" class="size-4" />
      </button>
    </div>
  </div>
</template>
