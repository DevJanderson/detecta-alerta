<script setup lang="ts">
import { toast } from 'vue-sonner'
import type {
  UsuarioSchemaList,
  UsuarioSchemaCreate,
  UsuarioSchemaUpdate
} from '../../../composables/types'

definePageMeta({
  middleware: 'auth-guard',
  requiredGroups: ['administradores']
})

useSeoPage({
  title: 'Gerenciar Usuarios - Detecta Alerta'
})

const usuariosStore = useUsuariosStore()

// Estado do dialog de criacao/edicao
const formOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const selectedUsuario = ref<UsuarioSchemaList | null>(null)

// Estado do dialog de exclusao
const deleteOpen = ref(false)
const deleteUsuario = ref<{ id: number; nome: string } | null>(null)

// Filtros
const filters = ref<{ search?: string; ativo?: boolean }>({})

// Carregar usuarios
onMounted(async () => {
  await usuariosStore.fetchAll()
})

function handleFilter(params: { search?: string; ativo?: boolean }) {
  filters.value = params
  usuariosStore.fetchAll({
    search: params.search,
    ativo: params.ativo,
    page: 1
  })
}

function handlePageChange(page: number) {
  usuariosStore.fetchAll({
    ...filters.value,
    page
  })
}

function handleCreate() {
  formMode.value = 'create'
  selectedUsuario.value = null
  formOpen.value = true
}

function handleEdit(usuario: UsuarioSchemaList) {
  formMode.value = 'edit'
  selectedUsuario.value = usuario
  formOpen.value = true
}

function handleView(id: number) {
  navigateTo(`/admin/usuarios/${id}`)
}

function handleDeleteClick(usuario: UsuarioSchemaList) {
  deleteUsuario.value = { id: usuario.id, nome: usuario.nome }
  deleteOpen.value = true
}

async function handleSave(data: UsuarioSchemaCreate | UsuarioSchemaUpdate) {
  let success = false
  if (formMode.value === 'create') {
    success = !!(await usuariosStore.criar(data as UsuarioSchemaCreate))
  } else if (selectedUsuario.value) {
    success = !!(await usuariosStore.atualizar(
      selectedUsuario.value.id,
      data as UsuarioSchemaUpdate
    ))
  }
  if (success) {
    formOpen.value = false
    toast.success(
      formMode.value === 'create' ? 'Usuario criado com sucesso' : 'Usuario atualizado com sucesso'
    )
    await usuariosStore.fetchAll(filters.value)
  } else {
    toast.error(usuariosStore.error || 'Erro ao salvar usuario')
  }
}

async function handleDeleteConfirm(id: number) {
  const success = await usuariosStore.remover(id)
  if (success) {
    deleteOpen.value = false
    toast.success('Usuario removido com sucesso')
    await usuariosStore.fetchAll(filters.value)
  } else {
    toast.error(usuariosStore.error || 'Erro ao remover usuario')
  }
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-4 sm:py-8">
    <!-- Header -->
    <div class="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-xl font-bold text-foreground sm:text-2xl">Usuarios</h1>
      <Button variant="brand-outline" size="brand-md" @click="handleCreate">
        <Icon name="lucide:plus" class="mr-2 size-4" />
        Novo Usuario
      </Button>
    </div>

    <!-- Filtros -->
    <UsuariosAdminFilters class="mb-4" @filter="handleFilter" />

    <!-- Loading -->
    <CommonLoadingSpinner v-if="usuariosStore.isLoading" />

    <!-- Tabela -->
    <template v-else>
      <UsuariosAdminTable
        :usuarios="usuariosStore.items"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDeleteClick"
      />

      <!-- Paginacao -->
      <CommonSimplePagination
        :total="usuariosStore.total"
        :per-page="usuariosStore.size"
        :current-page="usuariosStore.page"
        :pages="usuariosStore.pages"
        @update:page="handlePageChange"
      />
    </template>

    <!-- Dialog criar/editar -->
    <UsuariosAdminForm
      v-model:open="formOpen"
      :usuario="selectedUsuario"
      :mode="formMode"
      @save="handleSave"
    />

    <!-- Dialog excluir -->
    <DeleteConfirmDialog
      v-model:open="deleteOpen"
      title="Excluir usuario"
      :item="deleteUsuario"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
