<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoPage({
  title: 'Design System - Detecta Alerta',
  description: 'Paleta de cores e componentes do Detecta Alerta'
})

const brandPrimary = [
  { shade: '50', class: 'bg-brand-primary-50' },
  { shade: '100', class: 'bg-brand-primary-100' },
  { shade: '200', class: 'bg-brand-primary-200' },
  { shade: '300', class: 'bg-brand-primary-300' },
  { shade: '400', class: 'bg-brand-primary-400' },
  { shade: '500', class: 'bg-brand-primary-500' },
  { shade: '600', class: 'bg-brand-primary-600' },
  { shade: '700', class: 'bg-brand-primary-700' },
  { shade: '800', class: 'bg-brand-primary-800' },
  { shade: '900', class: 'bg-brand-primary-900' },
  { shade: '950', class: 'bg-brand-primary-950' }
]

const brandSecondary = [
  { shade: '50', class: 'bg-brand-secondary-50' },
  { shade: '100', class: 'bg-brand-secondary-100' },
  { shade: '200', class: 'bg-brand-secondary-200' },
  { shade: '300', class: 'bg-brand-secondary-300' },
  { shade: '400', class: 'bg-brand-secondary-400' },
  { shade: '500', class: 'bg-brand-secondary-500' },
  { shade: '600', class: 'bg-brand-secondary-600' },
  { shade: '700', class: 'bg-brand-secondary-700' },
  { shade: '800', class: 'bg-brand-secondary-800' },
  { shade: '900', class: 'bg-brand-secondary-900' },
  { shade: '950', class: 'bg-brand-secondary-950' }
]

const brandTertiary = [
  { shade: '50', class: 'bg-brand-tertiary-50' },
  { shade: '100', class: 'bg-brand-tertiary-100' },
  { shade: '200', class: 'bg-brand-tertiary-200' },
  { shade: '300', class: 'bg-brand-tertiary-300' },
  { shade: '400', class: 'bg-brand-tertiary-400' },
  { shade: '500', class: 'bg-brand-tertiary-500' }
]

const base = [
  { shade: '0', class: 'bg-base-0' },
  { shade: '50', class: 'bg-base-50' },
  { shade: '100', class: 'bg-base-100' },
  { shade: '200', class: 'bg-base-200' },
  { shade: '300', class: 'bg-base-300' },
  { shade: '400', class: 'bg-base-400' },
  { shade: '500', class: 'bg-base-500' },
  { shade: '600', class: 'bg-base-600' },
  { shade: '700', class: 'bg-base-700' },
  { shade: '800', class: 'bg-base-800' },
  { shade: '900', class: 'bg-base-900' },
  { shade: '950', class: 'bg-base-950' }
]

const success = [
  { shade: '50', class: 'bg-success-50' },
  { shade: '100', class: 'bg-success-100' },
  { shade: '200', class: 'bg-success-200' },
  { shade: '300', class: 'bg-success-300' },
  { shade: '400', class: 'bg-success-400' },
  { shade: '500', class: 'bg-success-500' },
  { shade: '600', class: 'bg-success-600' },
  { shade: '700', class: 'bg-success-700' },
  { shade: '800', class: 'bg-success-800' },
  { shade: '900', class: 'bg-success-900' },
  { shade: '950', class: 'bg-success-950' }
]

const alert = [
  { shade: '50', class: 'bg-alert-50' },
  { shade: '100', class: 'bg-alert-100' },
  { shade: '200', class: 'bg-alert-200' },
  { shade: '300', class: 'bg-alert-300' },
  { shade: '400', class: 'bg-alert-400' },
  { shade: '500', class: 'bg-alert-500' },
  { shade: '600', class: 'bg-alert-600' },
  { shade: '700', class: 'bg-alert-700' },
  { shade: '800', class: 'bg-alert-800' },
  { shade: '900', class: 'bg-alert-900' },
  { shade: '950', class: 'bg-alert-950' }
]

const danger = [
  { shade: '50', class: 'bg-danger-50' },
  { shade: '100', class: 'bg-danger-100' },
  { shade: '200', class: 'bg-danger-200' },
  { shade: '300', class: 'bg-danger-300' },
  { shade: '400', class: 'bg-danger-400' },
  { shade: '500', class: 'bg-danger-500' },
  { shade: '600', class: 'bg-danger-600' },
  { shade: '700', class: 'bg-danger-700' },
  { shade: '800', class: 'bg-danger-800' },
  { shade: '900', class: 'bg-danger-900' },
  { shade: '950', class: 'bg-danger-950' }
]

const semanticColors = [
  { name: 'background', class: 'bg-background' },
  { name: 'foreground', class: 'bg-foreground' },
  { name: 'primary', class: 'bg-primary' },
  { name: 'secondary', class: 'bg-secondary' },
  { name: 'muted', class: 'bg-muted' },
  { name: 'accent', class: 'bg-accent' },
  { name: 'destructive', class: 'bg-destructive' },
  { name: 'border', class: 'bg-border' },
  { name: 'ring', class: 'bg-ring' }
]
</script>

<template>
  <div class="min-h-screen bg-background p-8">
    <div class="mx-auto max-w-6xl">
      <h1 class="mb-2 text-3xl font-bold text-foreground">Style Guide</h1>
      <p class="mb-8 text-muted-foreground">Paleta de cores do Detecta Alerta</p>

      <!-- Brand Primary -->
      <section class="mb-10">
        <h2 class="mb-4 text-xl font-semibold text-foreground">
          Brand Primary
          <span class="text-sm font-normal text-muted-foreground"> (Vermelho/Coral) </span>
        </h2>
        <div class="grid grid-cols-6 gap-2 md:grid-cols-11">
          <div v-for="color in brandPrimary" :key="color.shade" class="flex flex-col items-center">
            <div class="h-16 w-full rounded-lg shadow-sm" :class="color.class" />
            <span class="mt-1 text-xs text-muted-foreground">{{ color.shade }}</span>
          </div>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          Classe: <code class="rounded bg-muted px-1">bg-brand-primary-{shade}</code>
        </p>
      </section>

      <!-- Brand Secondary -->
      <section class="mb-10">
        <h2 class="mb-4 text-xl font-semibold text-foreground">
          Brand Secondary
          <span class="text-sm font-normal text-muted-foreground">(Azul)</span>
        </h2>
        <div class="grid grid-cols-6 gap-2 md:grid-cols-11">
          <div
            v-for="color in brandSecondary"
            :key="color.shade"
            class="flex flex-col items-center"
          >
            <div class="h-16 w-full rounded-lg shadow-sm" :class="color.class" />
            <span class="mt-1 text-xs text-muted-foreground">{{ color.shade }}</span>
          </div>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          Classe: <code class="rounded bg-muted px-1">bg-brand-secondary-{shade}</code>
        </p>
      </section>

      <!-- Brand Tertiary -->
      <section class="mb-10">
        <h2 class="mb-4 text-xl font-semibold text-foreground">
          Brand Tertiary
          <span class="text-sm font-normal text-muted-foreground"> (Verde/Cinza) </span>
        </h2>
        <div class="grid grid-cols-6 gap-2">
          <div v-for="color in brandTertiary" :key="color.shade" class="flex flex-col items-center">
            <div class="h-16 w-full rounded-lg shadow-sm" :class="color.class" />
            <span class="mt-1 text-xs text-muted-foreground">{{ color.shade }}</span>
          </div>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          Classe: <code class="rounded bg-muted px-1">bg-brand-tertiary-{shade}</code>
        </p>
      </section>

      <!-- Base (Cinzas) -->
      <section class="mb-10">
        <h2 class="mb-4 text-xl font-semibold text-foreground">
          Base
          <span class="text-sm font-normal text-muted-foreground">(Neutros)</span>
        </h2>
        <div class="grid grid-cols-6 gap-2 md:grid-cols-12">
          <div v-for="color in base" :key="color.shade" class="flex flex-col items-center">
            <div
              class="h-16 w-full rounded-lg border border-border shadow-sm"
              :class="color.class"
            />
            <span class="mt-1 text-xs text-muted-foreground">{{ color.shade }}</span>
          </div>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          Classe: <code class="rounded bg-muted px-1">bg-base-{shade}</code>
        </p>
      </section>

      <!-- Success -->
      <section class="mb-10">
        <h2 class="mb-4 text-xl font-semibold text-foreground">
          Success
          <span class="text-sm font-normal text-muted-foreground">(Feedback positivo)</span>
        </h2>
        <div class="grid grid-cols-6 gap-2 md:grid-cols-11">
          <div v-for="color in success" :key="color.shade" class="flex flex-col items-center">
            <div class="h-16 w-full rounded-lg shadow-sm" :class="color.class" />
            <span class="mt-1 text-xs text-muted-foreground">{{ color.shade }}</span>
          </div>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          Classe: <code class="rounded bg-muted px-1">bg-success-{shade}</code>
        </p>
      </section>

      <!-- Alert -->
      <section class="mb-10">
        <h2 class="mb-4 text-xl font-semibold text-foreground">
          Alert
          <span class="text-sm font-normal text-muted-foreground">(Avisos)</span>
        </h2>
        <div class="grid grid-cols-6 gap-2 md:grid-cols-11">
          <div v-for="color in alert" :key="color.shade" class="flex flex-col items-center">
            <div class="h-16 w-full rounded-lg shadow-sm" :class="color.class" />
            <span class="mt-1 text-xs text-muted-foreground">{{ color.shade }}</span>
          </div>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          Classe: <code class="rounded bg-muted px-1">bg-alert-{shade}</code>
        </p>
      </section>

      <!-- Danger -->
      <section class="mb-10">
        <h2 class="mb-4 text-xl font-semibold text-foreground">
          Danger
          <span class="text-sm font-normal text-muted-foreground">(Erros)</span>
        </h2>
        <div class="grid grid-cols-6 gap-2 md:grid-cols-11">
          <div v-for="color in danger" :key="color.shade" class="flex flex-col items-center">
            <div class="h-16 w-full rounded-lg shadow-sm" :class="color.class" />
            <span class="mt-1 text-xs text-muted-foreground">{{ color.shade }}</span>
          </div>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          Classe: <code class="rounded bg-muted px-1">bg-danger-{shade}</code>
        </p>
      </section>

      <!-- Cores Semânticas -->
      <section class="mb-10">
        <h2 class="mb-4 text-xl font-semibold text-foreground">
          Cores Semânticas
          <span class="text-sm font-normal text-muted-foreground">(shadcn/ui)</span>
        </h2>
        <div class="grid grid-cols-3 gap-4 md:grid-cols-5">
          <div v-for="color in semanticColors" :key="color.name" class="flex flex-col items-center">
            <div
              class="h-16 w-full rounded-lg border border-border shadow-sm"
              :class="color.class"
            />
            <span class="mt-1 text-xs text-muted-foreground">
              {{ color.name }}
            </span>
          </div>
        </div>
      </section>

      <!-- Botões da Marca -->
      <section class="mb-10">
        <h2 class="mb-4 text-xl font-semibold text-foreground">
          Botões da Marca
          <span class="text-sm font-normal text-muted-foreground">(Design System Figma)</span>
        </h2>

        <!-- Brand Outline (Primário) -->
        <div class="mb-6">
          <h3 class="mb-3 text-lg font-medium text-foreground">Brand Outline (Primário)</h3>
          <div class="flex flex-wrap items-end gap-4">
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-outline" size="brand-sm">Small</Button>
              <span class="text-xs text-muted-foreground">brand-sm</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-outline" size="brand-md">Medium</Button>
              <span class="text-xs text-muted-foreground">brand-md</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-outline" size="brand-lg">Large</Button>
              <span class="text-xs text-muted-foreground">brand-lg</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-outline" size="brand-md" disabled>Disabled</Button>
              <span class="text-xs text-muted-foreground">disabled</span>
            </div>
          </div>
        </div>

        <!-- Brand Secondary Soft -->
        <div class="mb-6">
          <h3 class="mb-3 text-lg font-medium text-foreground">
            Brand Secondary Soft (Secundário)
          </h3>
          <div class="flex flex-wrap items-end gap-4">
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-secondary-soft" size="brand-sm">Small</Button>
              <span class="text-xs text-muted-foreground">brand-sm</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-secondary-soft" size="brand-md">Medium</Button>
              <span class="text-xs text-muted-foreground">brand-md</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-secondary-soft" size="brand-lg">Large</Button>
              <span class="text-xs text-muted-foreground">brand-lg</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-secondary-soft" size="brand-md" disabled>Disabled</Button>
              <span class="text-xs text-muted-foreground">disabled</span>
            </div>
          </div>
        </div>

        <!-- Primário com Ícones -->
        <div class="mb-6">
          <h3 class="mb-3 text-lg font-medium text-foreground">Primário com Ícones</h3>
          <div class="flex flex-wrap items-end gap-4">
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-outline" size="brand-md">
                <Icon name="lucide:arrow-left" class="size-4" />
                Voltar
              </Button>
              <span class="text-xs text-muted-foreground">left icon</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-outline" size="brand-md">
                Próximo
                <Icon name="lucide:arrow-right" class="size-4" />
              </Button>
              <span class="text-xs text-muted-foreground">right icon</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-outline" size="brand-md" disabled>
                <Icon name="lucide:loader-2" class="size-4 animate-spin" />
                Loading...
              </Button>
              <span class="text-xs text-muted-foreground">loading</span>
            </div>
          </div>
        </div>

        <!-- Secundário com Ícones (ícone em tom vermelho) -->
        <div class="mb-6">
          <h3 class="mb-3 text-lg font-medium text-foreground">Secundário com Ícones</h3>
          <div class="flex flex-wrap items-end gap-4">
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-secondary-soft" size="brand-md">
                <Icon name="lucide:arrow-left" class="size-4" />
                Voltar
              </Button>
              <span class="text-xs text-muted-foreground">left icon</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-secondary-soft" size="brand-md">
                Próximo
                <Icon name="lucide:arrow-right" class="size-4" />
              </Button>
              <span class="text-xs text-muted-foreground">right icon</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Button variant="brand-secondary-soft" size="brand-md" disabled>
                <Icon name="lucide:loader-2" class="size-4 animate-spin" />
                Loading...
              </Button>
              <span class="text-xs text-muted-foreground">loading</span>
            </div>
          </div>
        </div>

        <!-- Código de exemplo -->
        <div class="rounded-lg bg-muted p-4">
          <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
          <code class="text-xs text-muted-foreground">
            &lt;Button variant="brand-outline" size="brand-md"&gt;Texto&lt;/Button&gt;<br />
            &lt;Button variant="brand-secondary-soft" size="brand-lg"&gt;Texto&lt;/Button&gt;
          </code>
        </div>
      </section>

      <!-- Exemplo de uso -->
      <section class="mb-10">
        <h2 class="mb-4 text-xl font-semibold text-foreground">Exemplo de Uso</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="rounded-lg border border-border bg-card p-4">
            <h3 class="font-semibold text-card-foreground">Card Padrão</h3>
            <p class="text-sm text-muted-foreground">Usando cores semânticas</p>
            <button class="mt-3 rounded bg-primary px-4 py-2 text-sm text-primary-foreground">
              Botão Primary
            </button>
          </div>

          <div class="rounded-lg bg-success-100 p-4">
            <h3 class="font-semibold text-success-800">Sucesso!</h3>
            <p class="text-sm text-success-700">Operação realizada com sucesso.</p>
          </div>

          <div class="rounded-lg bg-danger-100 p-4">
            <h3 class="font-semibold text-danger-800">Erro!</h3>
            <p class="text-sm text-danger-700">Algo deu errado.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
