<script setup lang="ts">
import type { UsuarioSchemaList } from '../composables/types'

interface Props {
  usuarios: UsuarioSchemaList[]
}

defineProps<Props>()

const emit = defineEmits<{
  view: [id: number]
  edit: [usuario: UsuarioSchemaList]
  delete: [usuario: UsuarioSchemaList]
}>()
</script>

<template>
  <div class="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Grupos</TableHead>
          <TableHead class="text-right">Acoes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty v-if="!usuarios.length" :colspan="5"> Nenhum usuario encontrado. </TableEmpty>
        <TableRow v-for="u in usuarios" :key="u.id">
          <TableCell class="font-medium">{{ u.nome }}</TableCell>
          <TableCell>{{ u.email }}</TableCell>
          <TableCell>
            <UsuariosStatusBadge :active="u.ativo !== false" />
          </TableCell>
          <TableCell>
            <div class="flex flex-wrap gap-1">
              <Badge v-for="g in u.grupos" :key="g.id" variant="outline">
                {{ g.nome }}
              </Badge>
              <span v-if="!u.grupos?.length" class="text-sm text-muted-foreground">--</span>
            </div>
          </TableCell>
          <TableCell class="text-right">
            <UsuariosTableActions
              @view="emit('view', u.id)"
              @edit="emit('edit', u)"
              @delete="emit('delete', u)"
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
