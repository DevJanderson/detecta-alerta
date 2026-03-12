<script setup lang="ts">
import type { PermissaoAcessoSchemaList } from '../composables/types'

interface Props {
  permissao: PermissaoAcessoSchemaList | null
  mode: 'create' | 'edit'
}

const props = defineProps<Props>()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  save: [data: { nome: string; descricao: string }]
}>()

const nome = ref('')
const descricao = ref('')
const isLoading = ref(false)

const canSubmit = computed(() => nome.value.trim() !== '' && !isLoading.value)

const titulo = computed(() => (props.mode === 'create' ? 'Criar permissao' : 'Editar permissao'))

watch(
  () => props.permissao,
  permissao => {
    if (permissao) {
      nome.value = permissao.nome
      descricao.value = permissao.descricao ?? ''
    } else {
      nome.value = ''
      descricao.value = ''
    }
  },
  { immediate: true }
)

function handleSave() {
  emit('save', {
    nome: nome.value.trim(),
    descricao: descricao.value.trim()
  })
}
</script>

<template>
  <UsuariosCrudFormDialog
    v-model:open="open"
    :mode="mode"
    :title="titulo"
    :can-submit="canSubmit"
    :is-loading="isLoading"
    @save="handleSave"
  >
    <div class="space-y-2">
      <Label for="permissao-nome">Nome</Label>
      <Input
        id="permissao-nome"
        v-model="nome"
        placeholder="Nome da permissao"
        :disabled="isLoading"
      />
    </div>

    <div class="space-y-2">
      <Label for="permissao-descricao">Descricao</Label>
      <Textarea
        id="permissao-descricao"
        v-model="descricao"
        placeholder="Descricao da permissao"
        :disabled="isLoading"
      />
    </div>
  </UsuariosCrudFormDialog>
</template>
