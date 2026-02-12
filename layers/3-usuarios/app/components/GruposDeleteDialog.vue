<script setup lang="ts">
interface Props {
  open: boolean
  grupo: { id: number; nome: string } | null
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
        <AlertDialogTitle>Excluir grupo</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir o grupo
          <strong>{{ grupo?.nome }}</strong
          >? Esta acao nao pode ser desfeita.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          class="bg-danger-600 text-white hover:bg-danger-700"
          @click="grupo && emit('confirm', grupo.id)"
        >
          Excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
