<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  item: { id: number; nome: string } | null
}

defineProps<Props>()

const emit = defineEmits<{
  confirm: [id: number]
  'update:open': [value: boolean]
}>()
</script>

<template>
  <AlertDialog :open="open" @update:open="emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir
          <strong>{{ item?.nome }}</strong
          >? Esta acao nao pode ser desfeita.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          class="bg-danger-600 text-white hover:bg-danger-700"
          @click="item && emit('confirm', item.id)"
        >
          Excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
