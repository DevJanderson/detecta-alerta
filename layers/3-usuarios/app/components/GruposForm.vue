<script setup lang="ts">
interface Props {
  open: boolean
  grupo: { nome: string; descricao?: string | null; ativo?: boolean } | null
  mode: 'create' | 'edit'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: [data: { nome: string; descricao: string; ativo: boolean }]
  'update:open': [value: boolean]
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
  if (!canSubmit.value) return
  emit('save', {
    nome: nome.value.trim(),
    descricao: descricao.value.trim(),
    ativo: ativo.value
  })
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ titulo }}</DialogTitle>
        <DialogDescription>
          {{ mode === 'create' ? 'Preencha os dados do novo grupo.' : 'Altere os dados do grupo.' }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSave">
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

        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" :disabled="!canSubmit">
            <Icon v-if="isLoading" name="lucide:loader-2" class="size-4 animate-spin" />
            {{ mode === 'create' ? 'Criar' : 'Salvar' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
