<script setup lang="ts">
interface Props {
  grupo: { nome: string; descricao?: string | null; ativo?: boolean } | null
  mode: 'create' | 'edit'
}

const props = defineProps<Props>()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  save: [data: { nome: string; descricao: string; ativo: boolean }]
}>()

const nome = ref('')
const descricao = ref('')
const ativo = ref(true)
const isLoading = ref(false)

const canSubmit = computed(() => nome.value.trim() !== '' && !isLoading.value)

const titulo = computed(() => (props.mode === 'create' ? 'Criar grupo' : 'Editar grupo'))

watch(
  () => props.grupo,
  grupo => {
    if (grupo) {
      nome.value = grupo.nome
      descricao.value = grupo.descricao ?? ''
      ativo.value = grupo.ativo !== false
    } else {
      nome.value = ''
      descricao.value = ''
      ativo.value = true
    }
  },
  { immediate: true }
)

function handleSave() {
  emit('save', {
    nome: nome.value.trim(),
    descricao: descricao.value.trim(),
    ativo: ativo.value
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
      <Label for="grupo-nome">Nome</Label>
      <Input id="grupo-nome" v-model="nome" placeholder="Nome do grupo" :disabled="isLoading" />
    </div>

    <div class="space-y-2">
      <Label for="grupo-descricao">Descricao</Label>
      <Textarea
        id="grupo-descricao"
        v-model="descricao"
        placeholder="Descricao do grupo"
        :disabled="isLoading"
      />
    </div>

    <div class="flex items-center gap-2">
      <Switch id="grupo-ativo" :checked="ativo" @update:checked="ativo = $event" />
      <Label for="grupo-ativo">Ativo</Label>
    </div>
  </UsuariosCrudFormDialog>
</template>
