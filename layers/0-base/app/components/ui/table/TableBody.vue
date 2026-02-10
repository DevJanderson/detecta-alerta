<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/layers/0-base/app/utils/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tbody :class="cn('[&_tr:last-child]:border-0', props.class)">
    <slot />
  </tbody>
</template>
