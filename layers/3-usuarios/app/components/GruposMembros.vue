<script setup lang="ts">
interface Membro {
  id: number
  nome: string
  email: string
}

interface Props {
  grupoId: number
  membros: Membro[]
}

defineProps<Props>()

const emit = defineEmits<{
  add: [usuarioId: number]
  remove: [usuarioId: number]
}>()

const api = useUsuariosApi()
const search = ref('')
const searchResults = ref<Array<{ id: number; nome: string; email: string }>>([])
const isSearching = ref(false)
const isRemoving = ref<number | null>(null)

watch(search, val => {
  if (!val.trim()) {
    searchResults.value = []
    return
  }
  const timer = setTimeout(() => searchUsers(val.trim()), 300)
  onWatcherCleanup(() => clearTimeout(timer))
})

async function searchUsers(query: string) {
  isSearching.value = true
  try {
    const response = await api.listar({ search: query, size: 5 })
    searchResults.value = response.usuarios.map(u => ({
      id: u.id,
      nome: u.nome,
      email: u.email
    }))
  } catch {
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

function handleAdd(usuarioId: number) {
  emit('add', usuarioId)
  search.value = ''
  searchResults.value = []
}

function handleRemove(usuarioId: number) {
  isRemoving.value = usuarioId
  emit('remove', usuarioId)
  isRemoving.value = null
}
</script>

<template>
  <div class="space-y-4">
    <!-- Buscar usuario -->
    <div class="space-y-2">
      <Label>Adicionar membro</Label>
      <div class="relative">
        <Input
          v-model="search"
          placeholder="Buscar usuario por nome ou email..."
          :disabled="isSearching"
        />
        <Icon
          v-if="isSearching"
          name="lucide:loader-2"
          class="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
        />
      </div>

      <!-- Resultados da busca -->
      <div v-if="searchResults.length > 0" class="rounded-md border bg-background shadow-sm">
        <button
          v-for="usuario in searchResults"
          :key="usuario.id"
          type="button"
          class="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-muted"
          @click="handleAdd(usuario.id)"
        >
          <div>
            <span class="font-medium">{{ usuario.nome }}</span>
            <span class="ml-2 text-muted-foreground">{{ usuario.email }}</span>
          </div>
          <Icon name="lucide:plus" class="size-4 text-brand-secondary-800" />
        </button>
      </div>
    </div>

    <Separator />

    <!-- Lista de membros -->
    <div class="space-y-2">
      <Label>Membros ({{ membros.length }})</Label>

      <p v-if="membros.length === 0" class="text-sm text-muted-foreground">
        Nenhum membro neste grupo.
      </p>

      <div
        v-for="membro in membros"
        :key="membro.id"
        class="flex items-center justify-between rounded-md border px-3 py-2"
      >
        <div>
          <span class="text-sm font-medium">{{ membro.nome }}</span>
          <span class="ml-2 text-sm text-muted-foreground">{{ membro.email }}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          title="Remover membro"
          class="text-danger-600 hover:text-danger-700"
          :disabled="isRemoving === membro.id"
          @click="handleRemove(membro.id)"
        >
          <Icon
            :name="isRemoving === membro.id ? 'lucide:loader-2' : 'lucide:x'"
            class="size-4"
            :class="{ 'animate-spin': isRemoving === membro.id }"
          />
        </Button>
      </div>
    </div>
  </div>
</template>
