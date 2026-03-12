<script setup lang="ts">
interface Props {
  active: boolean
  activeLabel?: string
  inactiveLabel?: string
}

withDefaults(defineProps<Props>(), {
  activeLabel: 'Ativo',
  inactiveLabel: 'Inativo'
})
</script>

<template>
  <Badge v-if="active" class="bg-success-100 text-success-800">
    {{ activeLabel }}
  </Badge>
  <Badge v-else class="bg-danger-100 text-danger-800">
    {{ inactiveLabel }}
  </Badge>
</template>
