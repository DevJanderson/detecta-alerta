<script setup lang="ts">
interface Props {
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
}

withDefaults(defineProps<Props>(), {
  showView: true,
  showEdit: true,
  showDelete: true
})

defineEmits<{
  view: []
  edit: []
  delete: []
}>()
</script>

<template>
  <div class="flex items-center justify-end gap-1">
    <Button v-if="showView" variant="ghost" size="icon" title="Ver detalhes" @click="$emit('view')">
      <Icon name="lucide:eye" class="size-4" />
    </Button>
    <Button v-if="showEdit" variant="ghost" size="icon" title="Editar" @click="$emit('edit')">
      <Icon name="lucide:pencil" class="size-4" />
    </Button>
    <Button
      v-if="showDelete"
      variant="ghost"
      size="icon"
      title="Excluir"
      class="text-danger-600 hover:text-danger-700"
      @click="$emit('delete')"
    >
      <Icon name="lucide:trash-2" class="size-4" />
    </Button>
  </div>
</template>
