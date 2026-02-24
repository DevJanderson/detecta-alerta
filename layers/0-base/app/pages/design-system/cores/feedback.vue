<script setup lang="ts">
definePageMeta({
  layout: 'design-system'
})

useSeoPage({
  title: 'Cores de Feedback - Design System',
  description: 'Paletas Success, Alert e Danger do Detecta Alerta'
})

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
</script>

<template>
  <div>
    <h1 class="mb-2 text-3xl font-bold text-foreground">Cores de Feedback</h1>
    <p class="mb-8 text-muted-foreground">Paletas para estados de sucesso, alerta e erro</p>

    <CommonDesignSystemPalette
      title="Success"
      subtitle="Verde — Confirmações, status positivo e operações concluídas"
      :colors="success"
      class-prefix="bg-success-"
    />

    <CommonDesignSystemPalette
      class="mt-12"
      title="Alert"
      subtitle="Amarelo — Avisos, atenção e informações importantes"
      :colors="alert"
      class-prefix="bg-alert-"
    />

    <CommonDesignSystemPalette
      class="mt-12"
      title="Danger"
      subtitle="Vermelho — Erros, exclusão e ações destrutivas"
      :colors="danger"
      class-prefix="bg-danger-"
    />
  </div>
</template>
