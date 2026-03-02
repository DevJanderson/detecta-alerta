<script setup lang="ts">
import type { GrupoSchemaList } from '../composables/types'

interface Props {
  grupos: GrupoSchemaList[]
}

defineProps<Props>()

const emit = defineEmits<{
  view: [id: number]
  edit: [grupo: GrupoSchemaList]
  delete: [grupo: GrupoSchemaList]
}>()
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Descricao</TableHead>
        <TableHead>Status</TableHead>
        <TableHead class="text-right">Acoes</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableEmpty v-if="grupos.length === 0" :colspan="4"> Nenhum grupo encontrado. </TableEmpty>
      <TableRow v-for="grupo in grupos" :key="grupo.id">
        <TableCell class="font-medium">{{ grupo.nome }}</TableCell>
        <TableCell class="text-muted-foreground">
          {{ grupo.descricao || '-' }}
        </TableCell>
        <TableCell>
          <Badge
            :variant="grupo.ativo !== false ? 'default' : 'destructive'"
            :class="
              grupo.ativo !== false
                ? 'bg-success-100 text-success-700 hover:bg-success-200'
                : 'bg-danger-100 text-danger-700 hover:bg-danger-200'
            "
          >
            {{ grupo.ativo !== false ? 'Ativo' : 'Inativo' }}
          </Badge>
        </TableCell>
        <TableCell class="text-right">
          <div class="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              title="Ver detalhes"
              @click="emit('view', grupo.id)"
            >
              <Icon name="lucide:eye" class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Editar" @click="emit('edit', grupo)">
              <Icon name="lucide:pencil" class="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Excluir"
              class="text-danger-600 hover:text-danger-700"
              @click="emit('delete', grupo)"
            >
              <Icon name="lucide:trash-2" class="size-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
