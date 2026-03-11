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
  <div class="overflow-x-auto">
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
            <TableActions
              :show-view="false"
              @edit="emit('edit', permissao)"
              @delete="emit('delete', permissao)"
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
