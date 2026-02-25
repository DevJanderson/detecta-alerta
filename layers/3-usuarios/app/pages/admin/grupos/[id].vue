<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { GrupoSchemaDetalhes } from '../../../composables/types'

definePageMeta({
  middleware: 'auth-guard',
  requiredGroups: ['administradores']
})

useSeoPage({
  title: 'Detalhes do Grupo - Detecta Alerta'
})

const route = useRoute()
const router = useRouter()
const gruposStore = useGruposStore()

const grupo = ref<GrupoSchemaDetalhes | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Dialog de edicao
const formOpen = ref(false)

const id = computed(() => Number(route.params.id))

onMounted(async () => {
  await loadGrupo()
})

async function loadGrupo() {
  isLoading.value = true
  error.value = null
  try {
    grupo.value = await useGruposApi().obter(id.value)
  } catch (e: unknown) {
    const fetchError = e as { statusMessage?: string }
    error.value = fetchError.statusMessage || 'Erro ao carregar grupo'
  } finally {
    isLoading.value = false
  }
}

function handleBack() {
  router.push('/admin/grupos')
}

async function handleSave(data: { nome: string; descricao: string; ativo: boolean }) {
  const success = await gruposStore.atualizar(id.value, data)
  if (success) {
    formOpen.value = false
    toast.success('Grupo atualizado com sucesso')
    await loadGrupo()
  } else {
    toast.error(gruposStore.error || 'Erro ao atualizar grupo')
  }
}

async function handleAddMembro(usuarioId: number) {
  const success = await gruposStore.addUsuario(id.value, usuarioId)
  if (success) {
    toast.success('Membro adicionado ao grupo')
    await loadGrupo()
  } else {
    toast.error(gruposStore.error || 'Erro ao adicionar membro')
  }
}

async function handleRemoveMembro(usuarioId: number) {
  const success = await gruposStore.removeUsuario(id.value, usuarioId)
  if (success) {
    toast.success('Membro removido do grupo')
    await loadGrupo()
  } else {
    toast.error(gruposStore.error || 'Erro ao remover membro')
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
    <template v-else-if="grupo">
      <div class="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" @click="handleBack">
          <Icon name="lucide:arrow-left" class="mr-2 size-4" />
          Voltar
        </Button>
        <h1 class="text-2xl font-bold text-foreground">{{ grupo.nome }}</h1>
        <Badge :variant="grupo.ativo ? 'default' : 'destructive'">
          {{ grupo.ativo ? 'Ativo' : 'Inativo' }}
        </Badge>
      </div>

      <div class="grid gap-6">
        <!-- Info do grupo -->
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>Informacoes do Grupo</CardTitle>
              <Button variant="outline" size="sm" @click="formOpen = true">
                <Icon name="lucide:pencil" class="mr-2 size-4" />
                Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <dl class="grid gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Nome</dt>
                <dd class="text-sm text-foreground">{{ grupo.nome }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Descricao</dt>
                <dd class="text-sm text-foreground">
                  {{ grupo.descricao || 'Sem descricao' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Total de Usuarios</dt>
                <dd class="text-sm text-foreground">{{ grupo.total_usuarios ?? 0 }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Criado em</dt>
                <dd class="text-sm text-foreground">
                  {{ new Date(grupo.created_at).toLocaleDateString('pt-BR') }}
                </dd>
              </div>
            </dl>

            <!-- Permissoes do grupo -->
            <div v-if="grupo.permissoes?.length" class="mt-4">
              <p class="mb-2 text-sm font-medium text-muted-foreground">Permissoes</p>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="perm in grupo.permissoes" :key="perm.id" variant="secondary">
                  {{ perm.nome }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Membros -->
        <Card>
          <CardHeader>
            <CardTitle>Membros</CardTitle>
            <CardDescription> Gerencie os usuarios deste grupo </CardDescription>
          </CardHeader>
          <CardContent>
            <GruposMembros
              :grupo-id="id"
              :membros="[]"
              @add="handleAddMembro"
              @remove="handleRemoveMembro"
            />
          </CardContent>
        </Card>
      </div>

      <!-- Dialog editar -->
      <GruposForm v-model:open="formOpen" :grupo="grupo" mode="edit" @save="handleSave" />
    </template>
  </div>
</template>
