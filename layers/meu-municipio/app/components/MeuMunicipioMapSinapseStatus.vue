<script setup lang="ts">
// TODO: receber timestamp real da última atualização via props/store
const lastUpdate = ref('3 minutos')
</script>

<template>
  <div
    class="flex flex-row items-center gap-2 rounded-full border border-success-200 bg-base-0 px-2.5 py-1.5 sm:gap-3 sm:px-3 sm:py-2"
  >
    <img src="/brand/sinapse.webp" alt="Sinapse" class="h-3.5 shrink-0 sm:h-4" />
    <span class="truncate text-[11px] font-normal text-success-900 sm:whitespace-nowrap sm:text-xs">
      Sinapse, há {{ lastUpdate }}
    </span>
    <div
      class="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-success-200 sm:size-4"
    >
      <div class="size-1.5 rounded-full bg-success-800 sm:size-2" />
    </div>
  </div>
</template>
