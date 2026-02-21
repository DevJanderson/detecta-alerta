<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { UsuarioSchemaList } from '../../../composables/types'

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

async function handleSave(data: Record<string, unknown>) {
  let success = false
  if (formMode.value === 'create') {
    success = await usuariosStore.criar(data as never)
  } else if (selectedUsuario.value) {
    success = await usuariosStore.atualizar(selectedUsuario.value.id, data as never)
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
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-foreground">Usuarios</h1>
      <Button variant="brand-outline" size="brand-md" @click="handleCreate">
        <Icon name="lucide:plus" class="mr-2 size-4" />
        Novo Usuario
      </Button>
    </div>

    <!-- Filtros -->
    <UsuariosAdminFilters class="mb-4" @filter="handleFilter" />

    <!-- Loading -->
    <div v-if="usuariosStore.isLoading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="size-6 animate-spin text-muted-foreground" />
    </div>

    <!-- Tabela -->
    <template v-else>
      <UsuariosAdminTable
        :usuarios="usuariosStore.items"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDeleteClick"
      />

      <!-- Paginacao -->
      <div v-if="usuariosStore.pages > 1" class="mt-4 flex justify-center">
        <Pagination
          :total="usuariosStore.total"
          :items-per-page="usuariosStore.size"
          :sibling-count="1"
          show-edges
          :default-page="usuariosStore.page"
          @update:page="handlePageChange"
        >
          <PaginationContent>
            <PaginationFirst />
            <PaginationPrevious />
            <PaginationItem v-for="item in usuariosStore.pages" :key="item" :value="item" />
            <PaginationNext />
            <PaginationLast />
          </PaginationContent>
        </Pagination>
      </div>
    </template>

    <!-- Dialog criar/editar -->
    <UsuariosAdminForm
      :open="formOpen"
      :usuario="selectedUsuario"
      :mode="formMode"
      @save="handleSave"
      @update:open="formOpen = $event"
    />

    <!-- Dialog excluir -->
    <UsuariosAdminDeleteDialog
      :open="deleteOpen"
      :usuario="deleteUsuario"
      @confirm="handleDeleteConfirm"
      @update:open="deleteOpen = $event"
    />
  </div>
</template>
