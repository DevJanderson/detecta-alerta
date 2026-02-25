<script setup lang="ts">
definePageMeta({
  layout: 'design-system',
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Página de Erro - Design System',
  description: 'Página de erro do Detecta Alerta com variantes discreto e chamativo'
})
</script>

<template>
  <div>
    <h1 class="mb-2 text-3xl font-bold text-foreground">Página de Erro</h1>
    <p class="mb-8 text-muted-foreground">
      Componente reutilizável para páginas de erro. Duas variantes de fundo: discreto (azul claro) e
      chamativo (losangos concêntricos).
    </p>

    <!-- Variante Discreto -->
    <h2 class="mb-4 text-xl font-semibold text-foreground">Discreto</h2>
    <p class="mb-4 text-sm text-muted-foreground">
      Fundo azul claro sólido (<code class="text-xs">bg-secondary-50</code>). Usado como padrão.
    </p>
    <div class="mb-12 overflow-hidden rounded-lg border border-border">
      <CommonErrorPageBackground variant="discreto" class="min-h-[700px] !py-12">
        <CommonErrorPageContent
          title="Página não encontrada!"
          description="Nossa equipe foi avisada para investigar este surto. Enquanto isso, lave as mãos e"
          error-code="Código do erro: Erro 404"
          show-home-link
          @action="navigateTo('/')"
        />
      </CommonErrorPageBackground>
    </div>

    <!-- Variante Chamativo -->
    <h2 class="mb-4 text-xl font-semibold text-foreground">Chamativo</h2>
    <p class="mb-4 text-sm text-muted-foreground">
      Fundo branco com losangos concêntricos SVG em
      <code class="text-xs">primary-900</code> semi-transparente.
    </p>
    <div class="mb-12 overflow-hidden rounded-lg border border-border">
      <CommonErrorPageBackground variant="chamativo" class="min-h-[700px] !py-12">
        <CommonErrorPageContent
          title="Página não encontrada!"
          description="Nossa equipe foi avisada para investigar este surto. Enquanto isso, lave as mãos e"
          error-code="Código do erro: Erro 404"
          show-home-link
          @action="navigateTo('/')"
        />
      </CommonErrorPageBackground>
    </div>

    <!-- Tokens utilizados -->
    <h2 class="mb-4 text-xl font-semibold text-foreground">Tokens utilizados</h2>
    <div class="overflow-x-auto rounded-lg border border-border">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border bg-muted/50">
            <th class="px-4 py-2 text-left font-medium text-foreground">Elemento</th>
            <th class="px-4 py-2 text-left font-medium text-foreground">Token</th>
            <th class="px-4 py-2 text-left font-medium text-foreground">Classe</th>
          </tr>
        </thead>
        <tbody class="text-muted-foreground">
          <tr class="border-b border-border">
            <td class="px-4 py-2">Fundo discreto</td>
            <td class="px-4 py-2">secondary-50</td>
            <td class="px-4 py-2"><code class="text-xs">bg-secondary-50</code></td>
          </tr>
          <tr class="border-b border-border">
            <td class="px-4 py-2">Fundo chamativo</td>
            <td class="px-4 py-2">SVG losangos concêntricos</td>
            <td class="px-4 py-2">
              <code class="text-xs">error-losangos.svg</code>
            </td>
          </tr>
          <tr class="border-b border-border">
            <td class="px-4 py-2">Título</td>
            <td class="px-4 py-2">primary-950</td>
            <td class="px-4 py-2"><code class="text-xs">text-primary-950</code></td>
          </tr>
          <tr class="border-b border-border">
            <td class="px-4 py-2">Descrição</td>
            <td class="px-4 py-2">secondary-900</td>
            <td class="px-4 py-2"><code class="text-xs">text-secondary-900</code></td>
          </tr>
          <tr class="border-b border-border">
            <td class="px-4 py-2">Losango do robô</td>
            <td class="px-4 py-2">primary-900</td>
            <td class="px-4 py-2"><code class="text-xs">bg-primary-900</code></td>
          </tr>
          <tr class="border-b border-border">
            <td class="px-4 py-2">Botão CTA</td>
            <td class="px-4 py-2">brand-outline / brand-xl</td>
            <td class="px-4 py-2">
              <code class="text-xs">variant="brand-outline" size="brand-xl"</code>
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2">Link inline</td>
            <td class="px-4 py-2">primary-950</td>
            <td class="px-4 py-2">
              <code class="text-xs">text-primary-950 underline</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
