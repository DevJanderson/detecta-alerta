<script setup lang="ts">
definePageMeta({
  layout: 'design-system',
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Cards - Design System',
  description: 'Variantes de action cards do design system Detecta Alerta'
})
</script>

<template>
  <div>
    <h1 class="mb-2 text-3xl font-bold text-foreground">Action Cards</h1>
    <p class="mb-8 text-muted-foreground">
      Cards de ação com variantes de borda e tamanho — componente base do Figma
    </p>

    <!-- Outline -->
    <section class="mb-12">
      <h2 class="mb-1 text-xl font-semibold text-foreground">Outline</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Borda <code class="text-xs">secondary-100</code>, hover muda para
        <code class="text-xs">primary-100</code>
      </p>
      <div class="flex flex-wrap items-end gap-10">
        <!-- default -->
        <div class="flex flex-col items-center gap-2">
          <p class="text-xs text-muted-foreground">default</p>
          <ActionCard variant="outline" size="medium" class="h-58 w-80">
            <div
              class="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-primary-50"
            >
              <div class="relative">
                <Icon name="lucide:image" size="48" class="text-primary-900" />
                <span
                  class="absolute -right-2 -top-1 flex size-8 items-center justify-center rounded-full border-2 border-primary-50 bg-secondary-900"
                >
                  <Icon name="lucide:component" size="20" class="text-white" />
                </span>
              </div>
              <p class="text-center text-sm font-semibold leading-tight text-primary-950">
                Image or<br />Component Slot
              </p>
            </div>
          </ActionCard>
        </div>
        <!-- hover -->
        <div class="flex flex-col items-center gap-2">
          <p class="text-xs text-muted-foreground">hover</p>
          <ActionCard
            variant="outline"
            size="medium"
            class="h-58 w-80 border-primary-100! bg-primary-50!"
          >
            <div
              class="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-primary-50"
            >
              <div class="relative">
                <Icon name="lucide:image" size="48" class="text-primary-900" />
                <span
                  class="absolute -right-2 -top-1 flex size-8 items-center justify-center rounded-full border-2 border-primary-50 bg-secondary-900"
                >
                  <Icon name="lucide:component" size="20" class="text-white" />
                </span>
              </div>
              <p class="text-center text-sm font-semibold leading-tight text-primary-950">
                Image or<br />Component Slot
              </p>
            </div>
          </ActionCard>
        </div>
        <!-- large -->
        <div class="flex flex-col items-center gap-2">
          <p class="text-xs text-muted-foreground">large</p>
          <ActionCard variant="outline" size="large" class="h-70 w-100">
            <div
              class="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-primary-50"
            >
              <div class="relative">
                <Icon name="lucide:image" size="56" class="text-primary-900" />
                <span
                  class="absolute -right-2 -top-1 flex size-8 items-center justify-center rounded-full border-2 border-primary-50 bg-secondary-900"
                >
                  <Icon name="lucide:component" size="20" class="text-white" />
                </span>
              </div>
              <p class="text-center font-semibold leading-tight text-primary-950">
                Image or<br />Component Slot
              </p>
            </div>
          </ActionCard>
        </div>
      </div>
    </section>

    <!-- Elevated -->
    <section class="mb-12">
      <h2 class="mb-1 text-xl font-semibold text-foreground">Elevated</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Outline + sombra <code class="text-xs">shadow-md shadow-secondary-950/10</code>
      </p>
      <div class="flex flex-wrap items-end gap-10">
        <!-- default -->
        <div class="flex flex-col items-center gap-2">
          <p class="text-xs text-muted-foreground">default</p>
          <ActionCard variant="elevated" size="medium" class="h-58 w-80">
            <div
              class="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-primary-50"
            >
              <div class="relative">
                <Icon name="lucide:image" size="48" class="text-primary-900" />
                <span
                  class="absolute -right-2 -top-1 flex size-8 items-center justify-center rounded-full border-2 border-primary-50 bg-secondary-900"
                >
                  <Icon name="lucide:component" size="20" class="text-white" />
                </span>
              </div>
              <p class="text-center text-sm font-semibold leading-tight text-primary-950">
                Image or<br />Component Slot
              </p>
            </div>
          </ActionCard>
        </div>
        <!-- hover -->
        <div class="flex flex-col items-center gap-2">
          <p class="text-xs text-muted-foreground">hover</p>
          <ActionCard
            variant="elevated"
            size="medium"
            class="h-58 w-80 border-primary-100! bg-primary-50!"
          >
            <div
              class="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-primary-50"
            >
              <div class="relative">
                <Icon name="lucide:image" size="48" class="text-primary-900" />
                <span
                  class="absolute -right-2 -top-1 flex size-8 items-center justify-center rounded-full border-2 border-primary-50 bg-secondary-900"
                >
                  <Icon name="lucide:component" size="20" class="text-white" />
                </span>
              </div>
              <p class="text-center text-sm font-semibold leading-tight text-primary-950">
                Image or<br />Component Slot
              </p>
            </div>
          </ActionCard>
        </div>
        <!-- large -->
        <div class="flex flex-col items-center gap-2">
          <p class="text-xs text-muted-foreground">large</p>
          <ActionCard variant="elevated" size="large" class="h-70 w-100">
            <div
              class="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-primary-50"
            >
              <div class="relative">
                <Icon name="lucide:image" size="56" class="text-primary-900" />
                <span
                  class="absolute -right-2 -top-1 flex size-8 items-center justify-center rounded-full border-2 border-primary-50 bg-secondary-900"
                >
                  <Icon name="lucide:component" size="20" class="text-white" />
                </span>
              </div>
              <p class="text-center font-semibold leading-tight text-primary-950">
                Image or<br />Component Slot
              </p>
            </div>
          </ActionCard>
        </div>
      </div>
    </section>

    <!-- Exemplo de uso real -->
    <section class="mb-12">
      <h2 class="mb-1 text-xl font-semibold text-foreground">Exemplo de uso</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Cards com conteúdo real (passe o mouse para ver hover)
      </p>
      <div class="flex flex-wrap items-start gap-6">
        <ActionCard variant="elevated" size="medium" class="w-80">
          <div class="flex flex-col gap-3">
            <div class="flex size-10 items-center justify-center rounded-lg bg-secondary-50">
              <Icon name="lucide:activity" class="size-5 text-secondary-700" />
            </div>
            <div>
              <p class="text-sm font-semibold text-foreground">Monitoramento</p>
              <p class="mt-1 text-xs text-muted-foreground">
                Acompanhe indicadores epidemiológicos em tempo real
              </p>
            </div>
          </div>
        </ActionCard>
        <ActionCard variant="outline" size="medium" class="w-80">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <Icon name="lucide:shield-check" class="size-5 text-primary-700" />
            </div>
            <div>
              <p class="text-sm font-semibold text-foreground">Alerta Epidemiológico</p>
              <p class="text-xs text-muted-foreground">Detecção precoce de surtos</p>
            </div>
          </div>
        </ActionCard>
        <ActionCard variant="outline" size="medium" class="w-80">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <Icon name="lucide:map-pin" class="size-5 text-primary-700" />
            </div>
            <div>
              <p class="text-sm font-semibold text-foreground">Meu Município</p>
              <p class="text-xs text-muted-foreground">Dados locais da sua região</p>
            </div>
          </div>
        </ActionCard>
      </div>
    </section>

    <!-- Código -->
    <div class="rounded-lg bg-muted p-4">
      <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
      <code class="text-xs leading-relaxed text-muted-foreground">
        &lt;ActionCard variant="outline" size="medium"&gt;...&lt;/ActionCard&gt;<br />
        &lt;ActionCard variant="outline" size="large"&gt;...&lt;/ActionCard&gt;<br />
        &lt;ActionCard variant="elevated" size="medium"&gt;...&lt;/ActionCard&gt;
      </code>
    </div>
  </div>
</template>
