<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'design-system',
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Feedback - Design System',
  description: 'Padrões de feedback e notificações do design system Detecta Alerta'
})

// Demo: diálogo de confirmação
const deleteDialogOpen = ref(false)
const deleteItem = ref<{ id: number; nome: string } | null>(null)

function openDeleteDialog() {
  deleteItem.value = { id: 1, nome: 'Item de exemplo' }
  deleteDialogOpen.value = true
}

function onDeleteConfirm(_id: number) {
  deleteDialogOpen.value = false
  deleteItem.value = null
  toast.success('Item excluido com sucesso (demo)')
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-3xl font-bold text-foreground">Feedback</h1>
    <p class="mb-8 text-muted-foreground">
      Padrões de notificações e feedback visual da plataforma
    </p>

    <!-- Toasts (vue-sonner) -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">Toasts (vue-sonner)</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Notificações temporárias no canto superior direito. Configurado com
        <code class="rounded bg-muted px-1.5 py-0.5 text-xs">rich-colors</code>,
        <code class="rounded bg-muted px-1.5 py-0.5 text-xs">close-button</code>
        e duração de 4 segundos.
      </p>

      <div class="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          @click="toast.success('Operacao realizada com sucesso')"
        >
          <Icon name="lucide:check" class="size-4 text-success-600" />
          Success
        </Button>
        <Button variant="outline" size="sm" @click="toast.error('Erro ao processar a requisicao')">
          <Icon name="lucide:x" class="size-4 text-danger-600" />
          Error
        </Button>
        <Button
          variant="outline"
          size="sm"
          @click="toast.warning('Atencao: dados podem estar desatualizados')"
        >
          <Icon name="lucide:triangle-alert" class="size-4 text-alert-600" />
          Warning
        </Button>
        <Button variant="outline" size="sm" @click="toast.info('Nova versao disponivel')">
          <Icon name="lucide:info" class="size-4 text-brand-secondary-600" />
          Info
        </Button>
      </div>

      <div class="mt-4 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
        <code class="text-xs text-muted-foreground">
          import { toast } from 'vue-sonner'<br /><br />
          toast.success('Salvo com sucesso')<br />
          toast.error(store.error || 'Erro ao salvar')
        </code>
      </div>

      <div class="mt-3 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Configuração (app.vue):</p>
        <code class="text-xs text-muted-foreground">
          &lt;Toaster position="top-right" :duration="4000" rich-colors close-button /&gt;
        </code>
      </div>
    </section>

    <!-- Alerts -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">Alerts</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Mensagens persistentes no conteúdo da página. Usados para erros com opção de retry e
        informações contextuais.
      </p>

      <div class="space-y-4">
        <div>
          <p class="mb-2 text-sm font-medium text-foreground">Default</p>
          <Alert>
            <AlertDescription> Informacao importante sobre os dados exibidos. </AlertDescription>
          </Alert>
        </div>

        <div>
          <p class="mb-2 text-sm font-medium text-foreground">Destructive (erro)</p>
          <Alert variant="destructive">
            <AlertDescription> Erro ao carregar dados do servidor. </AlertDescription>
          </Alert>
        </div>

        <div>
          <p class="mb-2 text-sm font-medium text-foreground">Destructive com retry</p>
          <Alert variant="destructive">
            <AlertDescription class="flex items-center justify-between">
              <span>Falha na conexao com o servidor</span>
              <Button
                variant="outline"
                size="sm"
                @click="toast.info('Tentando novamente... (demo)')"
              >
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div class="mt-4 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
        <code class="text-xs text-muted-foreground">
          &lt;Alert variant="destructive"&gt;<br />
          &nbsp;&nbsp;&lt;AlertDescription&gt;&#123;&#123; error
          &#125;&#125;&lt;/AlertDescription&gt;<br />
          &lt;/Alert&gt;
        </code>
      </div>
    </section>

    <!-- Diálogo de Confirmação -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">Diálogo de Confirmação</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Componente
        <code class="rounded bg-muted px-1.5 py-0.5 text-xs">DeleteConfirmDialog</code>
        para ações destrutivas. Exibe nome do item e requer confirmação explícita.
      </p>

      <Button variant="outline" size="sm" class="text-danger-600" @click="openDeleteDialog">
        <Icon name="lucide:trash-2" class="size-4" />
        Excluir item (demo)
      </Button>

      <CommonDeleteConfirmDialog
        v-model:open="deleteDialogOpen"
        title="Excluir item"
        :item="deleteItem"
        @confirm="onDeleteConfirm"
      />

      <div class="mt-4 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
        <code class="text-xs text-muted-foreground">
          &lt;CommonDeleteConfirmDialog<br />
          &nbsp;&nbsp;v-model:open="deleteDialogOpen"<br />
          &nbsp;&nbsp;title="Excluir usuario"<br />
          &nbsp;&nbsp;:item="selectedItem"<br />
          &nbsp;&nbsp;@confirm="onDelete"<br />
          /&gt;
        </code>
      </div>

      <div class="mt-3 rounded-lg border p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Props:</p>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b text-left text-muted-foreground">
                <th class="pb-2 pr-4">Prop</th>
                <th class="pb-2 pr-4">Tipo</th>
                <th class="pb-2">Descrição</th>
              </tr>
            </thead>
            <tbody class="text-foreground">
              <tr class="border-b">
                <td class="py-2 pr-4 font-mono">open</td>
                <td class="py-2 pr-4">boolean (v-model)</td>
                <td class="py-2">Controla visibilidade do diálogo</td>
              </tr>
              <tr class="border-b">
                <td class="py-2 pr-4 font-mono">title</td>
                <td class="py-2 pr-4">string</td>
                <td class="py-2">Título do diálogo</td>
              </tr>
              <tr>
                <td class="py-2 pr-4 font-mono">item</td>
                <td class="py-2 pr-4">{ id: number; nome: string } | null</td>
                <td class="py-2">Item a ser excluído (exibe nome na mensagem)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>
