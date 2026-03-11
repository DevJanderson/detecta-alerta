<script setup lang="ts">
const props = defineProps<{
  mode: 'active' | 'realtime'
  value: boolean | number
}>()

const label = computed(() => {
  if (props.mode === 'active') {
    return props.value ? 'Ativo' : 'Inativo'
  }
  if (props.value === 1) return 'Tempo real'
  if (props.value === 2) return 'Atualizado'
  return 'Sem dados'
})

const variant = computed(() => {
  if (props.mode === 'active') {
    return props.value ? 'success' : 'neutral'
  }
  if (props.value === 1) return 'success'
  if (props.value === 2) return 'warning'
  return 'neutral'
})
</script>

<template>
  <!-- Modo active: badge com ícone -->
  <span
    v-if="mode === 'active'"
    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="{
      'bg-success-50 text-success-900': variant === 'success',
      'bg-base-100 text-base-600': variant === 'neutral'
    }"
  >
    <Icon :name="value ? 'lucide:check' : 'lucide:x'" class="size-3" />
    {{ label }}
  </span>

  <!-- Modo realtime: texto com bullet colorido -->
  <span v-else class="inline-flex items-center gap-1.5 text-xs text-base-600">
    <span
      v-if="value === 1 || value === 2"
      class="size-2 shrink-0 rounded-full border"
      :class="{
        'border-success-200 bg-success-900': value === 1,
        'border-alert-200 bg-alert-500': value === 2
      }"
    />
    {{ label }}
  </span>
</template>
