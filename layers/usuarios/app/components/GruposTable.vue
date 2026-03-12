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
  <div class="overflow-x-auto">
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
            <UsuariosStatusBadge :active="grupo.ativo !== false" />
          </TableCell>
          <TableCell class="text-right">
            <UsuariosTableActions
              @view="emit('view', grupo.id)"
              @edit="emit('edit', grupo)"
              @delete="emit('delete', grupo)"
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
