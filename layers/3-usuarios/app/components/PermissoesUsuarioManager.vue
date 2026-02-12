<script setup lang="ts">
import type { PermissaoAcessoSchemaList } from '../composables/types'

interface Props {
  usuarioId: number
  permissoesUsuario: number[]
  todasPermissoes: PermissaoAcessoSchemaList[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: []
}>()

const permissoesStore = usePermissoesStore()
const loadingId = ref<number | null>(null)

function hasPermissao(id: number): boolean {
  return props.permissoesUsuario.includes(id)
}

async function togglePermissao(permId: number) {
  loadingId.value = permId
  try {
    if (hasPermissao(permId)) {
      await permissoesStore.removeFromUser(props.usuarioId, permId)
    } else {
      await permissoesStore.addToUser(props.usuarioId, permId)
    }
    emit('update')
  } finally {
    loadingId.value = null
  }
}
</script>

<template>
  <div class="space-y-3">
    <p v-if="todasPermissoes.length === 0" class="text-sm text-muted-foreground">
      Nenhuma permissao disponivel.
    </p>

    <div
      v-for="permissao in todasPermissoes"
      :key="permissao.id"
      class="flex items-center gap-3 rounded-md border px-3 py-2"
    >
      <div class="relative flex items-center">
        <Checkbox
          :id="`perm-${permissao.id}`"
          :checked="hasPermissao(permissao.id)"
          :disabled="loadingId === permissao.id"
          @update:checked="togglePermissao(permissao.id)"
        />
        <Icon
          v-if="loadingId === permissao.id"
          name="lucide:loader-2"
          class="absolute -right-5 size-3 animate-spin text-muted-foreground"
        />
      </div>
      <Label :for="`perm-${permissao.id}`" class="flex-1 cursor-pointer">
        <span class="font-medium">{{ permissao.nome }}</span>
        <span v-if="permissao.descricao" class="ml-2 text-muted-foreground">
          {{ permissao.descricao }}
        </span>
      </Label>
    </div>
  </div>
</template>
