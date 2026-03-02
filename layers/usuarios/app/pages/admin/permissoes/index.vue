<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { PermissaoAcessoSchemaList } from '../../../composables/types'

definePageMeta({
  middleware: 'auth-guard',
  requiredGroups: ['administradores']
})

useSeoPage({
  title: 'Gerenciar Permissoes - Detecta Alerta'
})

const permissoesStore = usePermissoesStore()

// Dialog de criacao/edicao
const formOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const selectedPermissao = ref<PermissaoAcessoSchemaList | null>(null)

// Dialog de exclusao
const deleteOpen = ref(false)
const deletePermissao = ref<{ id: number; nome: string } | null>(null)

onMounted(async () => {
  await permissoesStore.fetchAll()
})

function handleCreate() {
  formMode.value = 'create'
  selectedPermissao.value = null
  formOpen.value = true
}

function handleEdit(permissao: PermissaoAcessoSchemaList) {
  formMode.value = 'edit'
  selectedPermissao.value = permissao
  formOpen.value = true
}

function handleDeleteClick(permissao: PermissaoAcessoSchemaList) {
  deletePermissao.value = { id: permissao.id, nome: permissao.nome }
  deleteOpen.value = true
}

async function handleSave(data: { nome: string; descricao: string }) {
  let success = false
  if (formMode.value === 'create') {
    success = await permissoesStore.criar(data)
  } else if (selectedPermissao.value) {
    success = await permissoesStore.atualizar(selectedPermissao.value.id, data)
  }
  if (success) {
    formOpen.value = false
    toast.success(
      formMode.value === 'create'
        ? 'Permissao criada com sucesso'
        : 'Permissao atualizada com sucesso'
    )
    await permissoesStore.fetchAll()
  } else {
    toast.error(permissoesStore.error || 'Erro ao salvar permissao')
  }
}

async function handleDeleteConfirm(id: number) {
  const success = await permissoesStore.remover(id)
  if (success) {
    deleteOpen.value = false
    toast.success('Permissao removida com sucesso')
    await permissoesStore.fetchAll()
  } else {
    toast.error(permissoesStore.error || 'Erro ao remover permissao')
  }
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-foreground">Permissoes</h1>
      <Button variant="brand-outline" size="brand-md" @click="handleCreate">
        <Icon name="lucide:plus" class="mr-2 size-4" />
        Nova Permissao
      </Button>
    </div>

    <!-- Loading -->
    <div v-if="permissoesStore.isLoading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="size-6 animate-spin text-muted-foreground" />
    </div>

    <!-- Tabela -->
    <PermissoesTable
      v-else
      :permissoes="permissoesStore.items"
      @edit="handleEdit"
      @delete="handleDeleteClick"
    />

    <!-- Dialog criar/editar -->
    <PermissoesForm
      v-model:open="formOpen"
      :permissao="selectedPermissao"
      :mode="formMode"
      @save="handleSave"
    />

    <!-- Dialog excluir -->
    <DeleteConfirmDialog
      v-model:open="deleteOpen"
      title="Excluir permissao"
      :item="deletePermissao"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
