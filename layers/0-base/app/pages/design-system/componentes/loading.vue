<script setup lang="ts">
definePageMeta({
  layout: 'design-system',
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Loading - Design System',
  description: 'Padrões de loading states do design system Detecta Alerta'
})

// Demo: estados do padrão 3-state
const demoState = ref<'loading' | 'error' | 'content'>('loading')

function cycleDemoState() {
  if (demoState.value === 'loading') demoState.value = 'error'
  else if (demoState.value === 'error') demoState.value = 'content'
  else demoState.value = 'loading'
}

// Demo: curiosidades do loader
const demoCuriosidades = [
  {
    texto: 'O mosquito da dengue ja foi oficialmente erradicado do Brasil uma vez.',
    fonte: 'Fiocruz',
    fonteUrl:
      'https://fiocruz.br/pergunta/e-verdade-que-o-mosquito-aedes-aegypti-ja-foi-eliminado-e-depois-voltou-ao-brasil'
  },
  {
    texto:
      'O governo pagava a populacao por cada rato entregue durante a campanha contra a peste bubonica.',
    fonte: 'Toda Materia'
  }
]

// Demo: botão loading
const buttonLoading = ref(false)

function simulateButtonLoading() {
  buttonLoading.value = true
  setTimeout(() => {
    buttonLoading.value = false
  }, 2000)
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-3xl font-bold text-foreground">Loading States</h1>
    <p class="mb-8 text-muted-foreground">Padrões de carregamento usados na plataforma</p>

    <!-- Loader Losango (Página) -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">Loader Losango</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Loader de marca com losangos concêntricos animados. Segue o mesmo padrão visual da página de
        erro. Disponível em 3 tamanhos.
      </p>

      <!-- Tamanhos -->
      <div class="mb-6 flex flex-wrap items-end gap-8">
        <div class="flex flex-col items-center gap-2">
          <CommonLoaderLosango size="sm" />
          <span class="text-xs text-muted-foreground">sm</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <CommonLoaderLosango size="md" />
          <span class="text-xs text-muted-foreground">md</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <CommonLoaderLosango size="lg" />
          <span class="text-xs text-muted-foreground">lg</span>
        </div>
      </div>

      <!-- Preview: Loader Discreto - Texto -->
      <p class="mb-2 text-sm font-medium text-foreground">Loader Discreto - Texto</p>
      <div class="overflow-hidden rounded-lg border">
        <CommonLoaderBackground variant="discreto" class="min-h-100!">
          <div class="flex flex-col items-center gap-10">
            <CommonLoaderLosango size="md" />
            <div class="flex flex-col items-center gap-4 text-brand-secondary-900">
              <p class="flex items-baseline gap-1 text-xl font-semibold">
                <span>Carregando</span>
                <span class="mx-1">&bull;</span>
                <span>12%</span>
              </p>
              <p class="text-base">Gerando Relatorios</p>
            </div>
          </div>
        </CommonLoaderBackground>
      </div>

      <!-- Preview: Loader Discreto - Curiosidades -->
      <p class="mb-2 mt-6 text-sm font-medium text-foreground">Loader Discreto - Curiosidades</p>
      <p class="mb-3 text-sm text-muted-foreground">
        Exibe curiosidades de saude que rotacionam a cada 8 segundos enquanto carrega. Losango
        grande decorativo com loader interno.
      </p>
      <div class="overflow-hidden rounded-lg border">
        <CommonLoaderBackground variant="discreto" class="min-h-150!">
          <CommonLoaderCuriosidades :curiosidades="demoCuriosidades" :percentage="12" />
        </CommonLoaderBackground>
      </div>

      <div class="mt-4 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
        <code class="text-xs text-muted-foreground">
          &lt;CommonLoaderBackground variant="discreto"&gt;<br />
          &nbsp;&nbsp;&lt;CommonLoaderCuriosidades<br />
          &nbsp;&nbsp;&nbsp;&nbsp;:curiosidades="curiosidades"<br />
          &nbsp;&nbsp;&nbsp;&nbsp;:percentage="progress"<br />
          &nbsp;&nbsp;/&gt;<br />
          &lt;/CommonLoaderBackground&gt;
        </code>
      </div>

      <!-- Preview: Loader Chamativo - Texto -->
      <p class="mb-2 mt-6 text-sm font-medium text-foreground">Loader Chamativo - Texto</p>
      <p class="mb-3 text-sm text-muted-foreground">
        Fundo branco com losangos concêntricos decorativos e losango central sólido com texto de
        progresso. Usado em operações longas que precisam de destaque visual.
      </p>
      <div class="overflow-hidden rounded-lg border">
        <CommonLoaderBackground variant="chamativo" class="min-h-100!">
          <CommonLoaderChamativoTexto loading-text="gerando relatório" :percentage="12" />
        </CommonLoaderBackground>
      </div>

      <div class="mt-4 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
        <code class="text-xs text-muted-foreground">
          &lt;CommonLoaderBackground variant="chamativo"&gt;<br />
          &nbsp;&nbsp;&lt;CommonLoaderChamativoTexto<br />
          &nbsp;&nbsp;&nbsp;&nbsp;loading-text="gerando relatório"<br />
          &nbsp;&nbsp;&nbsp;&nbsp;:percentage="progress"<br />
          &nbsp;&nbsp;/&gt;<br />
          &lt;/CommonLoaderBackground&gt;
        </code>
      </div>

      <!-- Preview: Loader Chamativo - Curiosidades -->
      <p class="mb-2 mt-6 text-sm font-medium text-foreground">Loader Chamativo - Curiosidades</p>
      <p class="mb-3 text-sm text-muted-foreground">
        Losango grande com curiosidades de saúde dentro (texto branco). Texto de progresso embaixo
        em vermelho. Curiosidades rotacionam a cada 8 segundos.
      </p>
      <div class="overflow-hidden rounded-lg border">
        <CommonLoaderBackground variant="chamativo" class="min-h-150!">
          <CommonLoaderChamativoCuriosidades
            :curiosidades="demoCuriosidades"
            loading-text="gerando relatório"
            :percentage="12"
          />
        </CommonLoaderBackground>
      </div>

      <div class="mt-4 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
        <code class="text-xs text-muted-foreground">
          &lt;CommonLoaderBackground variant="chamativo"&gt;<br />
          &nbsp;&nbsp;&lt;CommonLoaderChamativoCuriosidades<br />
          &nbsp;&nbsp;&nbsp;&nbsp;:curiosidades="curiosidades"<br />
          &nbsp;&nbsp;&nbsp;&nbsp;loading-text="gerando relatório"<br />
          &nbsp;&nbsp;&nbsp;&nbsp;:percentage="progress"<br />
          &nbsp;&nbsp;/&gt;<br />
          &lt;/CommonLoaderBackground&gt;
        </code>
      </div>
    </section>

    <!-- AppLoading (Spinner) -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">AppLoading (Spinner)</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Componente reutilizável com 3 tamanhos. Usa o ícone
        <code class="rounded bg-muted px-1.5 py-0.5 text-xs">lucide:loader-2</code>.
      </p>
      <div class="flex flex-wrap items-end gap-8">
        <div class="flex flex-col items-center gap-2">
          <CommonAppLoading size="sm" />
          <span class="text-xs text-muted-foreground">sm</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <CommonAppLoading size="md" />
          <span class="text-xs text-muted-foreground">md</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <CommonAppLoading size="lg" />
          <span class="text-xs text-muted-foreground">lg</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <CommonAppLoading size="md" text="Carregando dados..." />
          <span class="text-xs text-muted-foreground">com texto</span>
        </div>
      </div>

      <div class="mt-4 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
        <code class="text-xs text-muted-foreground">
          &lt;CommonAppLoading size="md" text="Carregando..." /&gt;
        </code>
      </div>
    </section>

    <!-- Spinner em Botões -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">Spinner em Botões</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Substitui o ícone padrão por um spinner durante ações assíncronas. O botão fica
        desabilitado.
      </p>
      <div class="flex flex-wrap items-end gap-4">
        <div class="flex flex-col items-center gap-2">
          <Button
            variant="brand-outline"
            size="brand-md"
            :disabled="buttonLoading"
            @click="simulateButtonLoading"
          >
            <Icon v-if="buttonLoading" name="lucide:loader-2" class="size-4 animate-spin" />
            <Icon v-else name="lucide:save" class="size-4" />
            {{ buttonLoading ? 'Salvando...' : 'Salvar' }}
          </Button>
          <span class="text-xs text-muted-foreground">clique para simular</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-outline" size="brand-md" disabled>
            <Icon name="lucide:loader-2" class="size-4 animate-spin" />
            Entrando...
          </Button>
          <span class="text-xs text-muted-foreground">estado loading</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-secondary-soft" size="brand-md" disabled>
            <Icon name="lucide:loader-2" class="size-4 animate-spin" />
            Enviando...
          </Button>
          <span class="text-xs text-muted-foreground">secondary soft</span>
        </div>
      </div>

      <div class="mt-4 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
        <code class="text-xs text-muted-foreground">
          &lt;Button :disabled="isLoading"&gt;<br />
          &nbsp;&nbsp;&lt;Icon v-if="isLoading" name="lucide:loader-2" class="size-4 animate-spin"
          /&gt;<br />
          &nbsp;&nbsp;&lt;Icon v-else name="lucide:save" class="size-4" /&gt;<br />
          &nbsp;&nbsp;&#123;&#123; isLoading ? 'Salvando...' : 'Salvar' &#125;&#125;<br />
          &lt;/Button&gt;
        </code>
      </div>
    </section>

    <!-- Skeleton -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">Skeleton</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Placeholders animados que indicam onde o conteúdo será carregado. Usam
        <code class="rounded bg-muted px-1.5 py-0.5 text-xs">animate-pulse</code>
        com fundo
        <code class="rounded bg-muted px-1.5 py-0.5 text-xs">bg-muted</code>.
      </p>

      <div class="grid gap-6 sm:grid-cols-2">
        <!-- Card skeleton -->
        <div>
          <p class="mb-2 text-sm font-medium text-foreground">Card com imagem</p>
          <div class="rounded-lg border p-4">
            <div class="flex gap-4">
              <div class="hidden h-24 w-36 animate-pulse rounded-md bg-muted sm:block" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div class="h-3 w-full animate-pulse rounded bg-muted" />
                <div class="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>

        <!-- User skeleton -->
        <div>
          <p class="mb-2 text-sm font-medium text-foreground">Avatar + texto</p>
          <div class="rounded-lg border p-4">
            <div class="flex items-center gap-3">
              <div class="size-10 animate-pulse rounded-full bg-muted" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div class="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>

        <!-- Text skeleton -->
        <div>
          <p class="mb-2 text-sm font-medium text-foreground">Bloco de texto</p>
          <div class="rounded-lg border p-4 space-y-2">
            <div class="h-4 w-full animate-pulse rounded bg-muted" />
            <div class="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div class="h-4 w-4/6 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <!-- Button skeleton -->
        <div>
          <p class="mb-2 text-sm font-medium text-foreground">Botão / badge</p>
          <div class="rounded-lg border p-4 flex items-center gap-3">
            <div class="h-9 w-28 animate-pulse rounded-full bg-muted" />
            <div class="h-6 w-16 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </div>

      <div class="mt-4 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
        <code class="text-xs text-muted-foreground">
          &lt;div class="h-4 w-3/4 animate-pulse rounded bg-muted" /&gt;
        </code>
      </div>
    </section>

    <!-- Border Spinner -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">Border Spinner</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Spinner CSS leve, usado em infinite scroll e transições de página.
      </p>
      <div class="flex flex-wrap items-end gap-8">
        <div class="flex flex-col items-center gap-2">
          <div
            class="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
          />
          <span class="text-xs text-muted-foreground">sm (infinite scroll)</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <div
            class="size-8 animate-spin rounded-full border-4 border-brand-primary-200 border-t-brand-primary-900"
          />
          <span class="text-xs text-muted-foreground">md (brand)</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <div
            class="size-10 animate-spin rounded-full border-4 border-brand-secondary-200 border-t-brand-secondary-900"
          />
          <span class="text-xs text-muted-foreground">lg (secondary)</span>
        </div>
      </div>

      <div class="mt-4 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
        <code class="text-xs text-muted-foreground">
          &lt;div class="size-6 animate-spin rounded-full border-2 border-muted-foreground
          border-t-transparent" /&gt;
        </code>
      </div>
    </section>

    <!-- Padrão 3 estados -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">Padrão de 3 Estados</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Todas as páginas com dados assíncronos seguem o padrão
        <code class="rounded bg-muted px-1.5 py-0.5 text-xs">loading → error → content</code>.
        Clique no botão para alternar entre os estados.
      </p>

      <div class="mb-4">
        <Button variant="outline" size="sm" @click="cycleDemoState">
          <Icon name="lucide:arrow-right" class="size-4" />
          Estado atual: {{ demoState }}
        </Button>
      </div>

      <div class="rounded-lg border p-6">
        <!-- Loading -->
        <div v-if="demoState === 'loading'" class="flex items-center justify-center py-8">
          <Icon name="lucide:loader-2" class="size-6 animate-spin text-muted-foreground" />
        </div>

        <!-- Error -->
        <Alert v-else-if="demoState === 'error'" variant="destructive">
          <AlertDescription class="flex items-center justify-between">
            <span>Erro ao carregar dados do servidor</span>
            <Button variant="outline" size="sm" @click="demoState = 'loading'">
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>

        <!-- Content -->
        <div v-else class="space-y-3">
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-full bg-brand-secondary-100 text-sm font-semibold text-brand-secondary-900"
            >
              JS
            </div>
            <div>
              <p class="font-medium text-foreground">Joao Silva</p>
              <p class="text-sm text-muted-foreground">joao@exemplo.com</p>
            </div>
          </div>
          <p class="text-sm text-muted-foreground">Dados carregados com sucesso.</p>
        </div>
      </div>

      <div class="mt-4 rounded-lg bg-muted p-4">
        <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
        <code class="text-xs text-muted-foreground">
          &lt;div v-if="isLoading"&gt; spinner &lt;/div&gt;<br />
          &lt;Alert v-else-if="error" variant="destructive"&gt; ... &lt;/Alert&gt;<br />
          &lt;template v-else&gt; conteudo &lt;/template&gt;
        </code>
      </div>
    </section>
  </div>
</template>
