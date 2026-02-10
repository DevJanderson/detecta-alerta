<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
  text?: string
}>()

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8'
}
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <Icon name="lucide:loader-2" :class="[sizeClasses[size || 'md'], 'animate-spin']" />
    <span v-if="text" class="text-sm text-muted-foreground">
      {{ text }}
    </span>
  </div>
</template>
