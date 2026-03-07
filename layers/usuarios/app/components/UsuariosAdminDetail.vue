<script setup lang="ts">
import type { UsuarioSchemaDetalhes } from '../composables/types'

interface Props {
  usuario: UsuarioSchemaDetalhes
}

defineProps<Props>()

const emit = defineEmits<{
  edit: []
  back: []
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>{{ usuario.nome }}</CardTitle>
          <CardDescription>{{ usuario.email }}</CardDescription>
        </div>
        <Badge v-if="usuario.ativo !== false" class="bg-success-100 text-success-800">
          Ativo
        </Badge>
        <Badge v-else class="bg-danger-100 text-danger-800"> Inativo </Badge>
      </div>
    </CardHeader>

    <CardContent class="space-y-4">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-muted-foreground">Telefone</span>
          <p>{{ usuario.telefone || '--' }}</p>
        </div>
        <div>
          <span class="text-muted-foreground">Estado</span>
          <p>{{ usuario.estado || '--' }}</p>
        </div>
        <div>
          <span class="text-muted-foreground">Cidade</span>
          <p>{{ usuario.cidade || '--' }}</p>
        </div>
        <div>
          <span class="text-muted-foreground">Funcao</span>
          <p>{{ usuario.funcao || '--' }}</p>
        </div>
        <div>
          <span class="text-muted-foreground">Instituicao</span>
          <p>{{ usuario.instituicao || '--' }}</p>
        </div>
      </div>

      <Separator />

      <div class="space-y-2">
        <span class="text-sm text-muted-foreground">Grupos</span>
        <div class="flex flex-wrap gap-1">
          <Badge v-for="g in usuario.grupos" :key="g.id" variant="outline">
            {{ g.nome }}
          </Badge>
          <span v-if="!usuario.grupos?.length" class="text-sm text-muted-foreground">
            Nenhum grupo
          </span>
        </div>
      </div>

      <div class="space-y-2">
        <span class="text-sm text-muted-foreground">Permissoes</span>
        <div class="flex flex-wrap gap-1">
          <Badge v-for="p in usuario.permissoes" :key="p.id" variant="secondary">
            {{ p.nome }}
          </Badge>
          <span v-if="!usuario.permissoes?.length" class="text-sm text-muted-foreground">
            Nenhuma permissao
          </span>
        </div>
      </div>

      <Separator />

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-muted-foreground">Criado em</span>
          <p>{{ formatDate(usuario.created_at) }}</p>
        </div>
        <div>
          <span class="text-muted-foreground">Ultimo login</span>
          <p>{{ formatDate(usuario.ultimo_login) }}</p>
        </div>
      </div>
    </CardContent>

    <CardFooter class="flex justify-end gap-2">
      <Button variant="outline" @click="emit('back')">
        <Icon name="lucide:arrow-left" class="size-4" />
        Voltar
      </Button>
      <Button variant="brand-outline" @click="emit('edit')">
        <Icon name="lucide:pencil" class="size-4" />
        Editar
      </Button>
    </CardFooter>
  </Card>
</template>
