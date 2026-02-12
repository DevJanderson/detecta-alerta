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
          <Badge v-if="u.ativo !== false" class="bg-success-100 text-success-800"> Ativo </Badge>
          <Badge v-else class="bg-danger-100 text-danger-800"> Inativo </Badge>
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
          <div class="flex justify-end gap-1">
            <Button variant="ghost" size="icon" @click="emit('view', u.id)">
              <Icon name="lucide:eye" class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" @click="emit('edit', u)">
              <Icon name="lucide:pencil" class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" @click="emit('delete', u)">
              <Icon name="lucide:trash-2" class="size-4 text-danger-600" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
