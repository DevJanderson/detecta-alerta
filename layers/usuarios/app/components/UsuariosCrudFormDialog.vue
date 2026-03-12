<script setup lang="ts">
interface Props {
  mode: 'create' | 'edit'
  title: string
  description?: string
  canSubmit: boolean
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  description: undefined
})

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  save: []
}>()

const defaultDescription = computed(() => {
  if (props.description) return props.description
  return props.mode === 'create' ? `Preencha os dados para criar.` : `Altere os dados para salvar.`
})

function handleSubmit() {
  if (!props.canSubmit) return
  emit('save')
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ defaultDescription }}</DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <slot />

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
