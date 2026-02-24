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
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-foreground">Grupos</h1>
      <Button variant="brand-outline" size="brand-md" @click="handleCreate">
        <Icon name="lucide:plus" class="mr-2 size-4" />
        Novo Grupo
      </Button>
    </div>

    <!-- Loading -->
    <div v-if="gruposStore.isLoading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="size-6 animate-spin text-muted-foreground" />
    </div>

    <!-- Tabela -->
    <template v-else>
      <GruposTable
        :grupos="gruposStore.items"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDeleteClick"
      />

      <!-- Paginacao -->
      <div v-if="gruposStore.pages > 1" class="mt-4 flex justify-center">
        <Pagination
          :total="gruposStore.total"
          :items-per-page="gruposStore.size"
          :sibling-count="1"
          show-edges
          :default-page="gruposStore.page"
          @update:page="handlePageChange"
        >
          <PaginationContent>
            <PaginationFirst />
            <PaginationPrevious />
            <PaginationItem v-for="item in gruposStore.pages" :key="item" :value="item" />
            <PaginationNext />
            <PaginationLast />
          </PaginationContent>
        </Pagination>
      </div>
    </template>

    <!-- Dialog criar/editar -->
    <GruposForm
      :open="formOpen"
      :grupo="selectedGrupo"
      :mode="formMode"
      @save="handleSave"
      @update:open="formOpen = $event"
    />

    <!-- Dialog excluir -->
    <DeleteConfirmDialog
      :open="deleteOpen"
      title="Excluir grupo"
      :item="deleteGrupo"
      @confirm="handleDeleteConfirm"
      @update:open="deleteOpen = $event"
    />
  </div>
</template>
