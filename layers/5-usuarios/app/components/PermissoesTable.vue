<script setup lang="ts">
import type { PermissaoAcessoSchemaList } from '../composables/types'

interface Props {
  permissoes: PermissaoAcessoSchemaList[]
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [permissao: PermissaoAcessoSchemaList]
  delete: [permissao: PermissaoAcessoSchemaList]
}>()
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Descricao</TableHead>
        <TableHead class="text-right">Acoes</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableEmpty v-if="permissoes.length === 0" :colspan="3">
        Nenhuma permissao encontrada.
      </TableEmpty>
      <TableRow v-for="permissao in permissoes" :key="permissao.id">
        <TableCell class="font-medium">{{ permissao.nome }}</TableCell>
        <TableCell class="text-muted-foreground">
          {{ permissao.descricao || '-' }}
        </TableCell>
        <TableCell class="text-right">
          <div class="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" title="Editar" @click="emit('edit', permissao)">
              <Icon name="lucide:pencil" class="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Excluir"
              class="text-danger-600 hover:text-danger-700"
              @click="emit('delete', permissao)"
            >
              <Icon name="lucide:trash-2" class="size-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
