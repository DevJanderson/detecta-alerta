<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { UsuarioSchemaDetalhes } from '../../../composables/types'

definePageMeta({
  middleware: 'auth-guard',
  requiredGroups: ['administradores']
})

useSeoPage({
  title: 'Detalhes do Usuario - Detecta Alerta'
})

const route = useRoute()
const router = useRouter()
const usuariosStore = useUsuariosStore()

const usuario = ref<UsuarioSchemaDetalhes | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Dialog de edicao
const formOpen = ref(false)

// Dialog de exclusao
const deleteOpen = ref(false)

const id = computed(() => Number(route.params.id))

onMounted(async () => {
  await loadUsuario()
})

async function loadUsuario() {
  isLoading.value = true
  error.value = null
  try {
    usuario.value = await useUsuariosApi().obter(id.value)
  } catch (e: unknown) {
    const fetchError = e as { statusMessage?: string }
    error.value = fetchError.statusMessage || 'Erro ao carregar usuario'
  } finally {
    isLoading.value = false
  }
}

function handleEdit() {
  formOpen.value = true
}

function handleBack() {
  router.push('/admin/usuarios')
}

async function handleSave(data: Record<string, unknown>) {
  const success = await usuariosStore.atualizar(id.value, data as never)
  if (success) {
    formOpen.value = false
    toast.success('Usuario atualizado com sucesso')
    await loadUsuario()
  } else {
    toast.error(usuariosStore.error || 'Erro ao atualizar usuario')
  }
}

async function handleDeleteConfirm() {
  const success = await usuariosStore.remover(id.value)
  if (success) {
    toast.success('Usuario removido com sucesso')
    router.push('/admin/usuarios')
  } else {
    toast.error(usuariosStore.error || 'Erro ao remover usuario')
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="size-6 animate-spin text-muted-foreground" />
    </div>

    <!-- Erro -->
    <Alert v-else-if="error" variant="destructive">
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- Detalhes -->
    <template v-else-if="usuario">
      <div class="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" @click="handleBack">
          <Icon name="lucide:arrow-left" class="mr-2 size-4" />
          Voltar
        </Button>
        <h1 class="text-2xl font-bold text-foreground">{{ usuario.nome }}</h1>
      </div>

      <UsuariosAdminDetail :usuario="usuario" @edit="handleEdit" @back="handleBack" />

      <!-- Dialog editar -->
      <UsuariosAdminForm
        :open="formOpen"
        :usuario="usuario"
        mode="edit"
        @save="handleSave"
        @update:open="formOpen = $event"
      />

      <!-- Dialog excluir -->
      <DeleteConfirmDialog
        :open="deleteOpen"
        title="Excluir usuario"
        :item="{ id: usuario.id, nome: usuario.nome }"
        @confirm="handleDeleteConfirm"
        @update:open="deleteOpen = $event"
      />
    </template>
  </div>
</template>
