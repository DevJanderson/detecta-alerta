<script setup lang="ts">
interface Props {
  open: boolean
  usuario: { id: number; nome: string } | null
}

defineProps<Props>()

const emit = defineEmits<{
  confirm: [id: number]
  'update:open': [value: boolean]
}>()
</script>

<template>
  <AlertDialog :open="open" @update:open="val => emit('update:open', val)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir usuario</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir o usuario
          <strong>{{ usuario?.nome }}</strong
          >? Esta acao nao pode ser desfeita.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          class="bg-danger-600 text-white hover:bg-danger-700"
          @click="usuario && emit('confirm', usuario.id)"
        >
          Excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
