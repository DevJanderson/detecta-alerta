<script setup lang="ts">
// TODO: receber timestamp real da última atualização via props/store
const lastUpdate = ref('3 minutos')
</script>

<template>
  <div
    class="flex flex-row items-center gap-3 rounded-full border border-success-200 bg-base-0 px-3 py-2"
  >
    <img src="/brand/sinapse.webp" alt="Sinapse" class="h-4 shrink-0" />
    <span class="whitespace-nowrap text-xs font-normal text-success-900">
      Dados via Sinapse, há {{ lastUpdate }}.
    </span>
    <div class="flex size-4 shrink-0 items-center justify-center rounded-full bg-success-200">
      <div class="size-2 rounded-full bg-success-800" />
    </div>
  </div>
</template>
