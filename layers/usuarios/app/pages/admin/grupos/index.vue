<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { GrupoSchemaList } from '../../../composables/types'

definePageMeta({
  middleware: 'auth-guard',
  requiredGroups: ['administradores']
})

useSeoPage({
  title: 'Gerenciar Grupos - Detecta Alerta'
})

const gruposStore = useGruposStore()

// Dialog de criacao/edicao
const formOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const selectedGrupo = ref<GrupoSchemaList | null>(null)

// Dialog de exclusao
const deleteOpen = ref(false)
const deleteGrupo = ref<{ id: number; nome: string } | null>(null)

onMounted(async () => {
  await gruposStore.fetchAll()
})

function handleCreate() {
  formMode.value = 'create'
  selectedGrupo.value = null
  formOpen.value = true
}

function handleEdit(grupo: GrupoSchemaList) {
  formMode.value = 'edit'
  selectedGrupo.value = grupo
  formOpen.value = true
}

function handleView(id: number) {
  navigateTo(`/admin/grupos/${id}`)
}

function handleDeleteClick(grupo: GrupoSchemaList) {
  deleteGrupo.value = { id: grupo.id, nome: grupo.nome }
  deleteOpen.value = true
}

async function handleSave(data: { nome: string; descricao: string; ativo: boolean }) {
  let success = false
  if (formMode.value === 'create') {
    success = await gruposStore.criar(data)
  } else if (selectedGrupo.value) {
    success = await gruposStore.atualizar(selectedGrupo.value.id, data)
  }
  if (success) {
    formOpen.value = false
    toast.success(
      formMode.value === 'create' ? 'Grupo criado com sucesso' : 'Grupo atualizado com sucesso'
    )
    await gruposStore.fetchAll()
  } else {
    toast.error(gruposStore.error || 'Erro ao salvar grupo')
  }
}

async function handleDeleteConfirm(id: number) {
  const success = await gruposStore.remover(id)
  if (success) {
    deleteOpen.value = false
    toast.success('Grupo removido com sucesso')
    await gruposStore.fetchAll()
  } else {
    toast.error(gruposStore.error || 'Erro ao remover grupo')
  }
}

function handlePageChange(page: number) {
  gruposStore.fetchAll({ page })
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-4 sm:py-8">
    <!-- Header -->
    <div class="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-xl font-bold text-foreground sm:text-2xl">Grupos</h1>
      <Button variant="brand-outline" size="brand-md" @click="handleCreate">
        <Icon name="lucide:plus" class="mr-2 size-4" />
        Novo Grupo
      </Button>
    </div>

    <!-- Loading -->
    <CommonLoadingSpinner v-if="gruposStore.isLoading" />

    <!-- Tabela -->
    <template v-else>
      <GruposTable
        :grupos="gruposStore.items"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDeleteClick"
      />

      <!-- Paginacao -->
      <CommonSimplePagination
        :total="gruposStore.total"
        :per-page="gruposStore.size"
        :current-page="gruposStore.page"
        :pages="gruposStore.pages"
        @update:page="handlePageChange"
      />
    </template>

    <!-- Dialog criar/editar -->
    <GruposForm
      v-model:open="formOpen"
      :grupo="selectedGrupo"
      :mode="formMode"
      @save="handleSave"
    />

    <!-- Dialog excluir -->
    <DeleteConfirmDialog
      v-model:open="deleteOpen"
      title="Excluir grupo"
      :item="deleteGrupo"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
