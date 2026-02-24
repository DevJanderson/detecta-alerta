<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { AvatarVariants } from '.'
import { AvatarRoot } from 'reka-ui'
import { cn } from '@/layers/0-base/app/utils/utils'
import { avatarVariant } from '.'

const {
  class: propClass = undefined,
  size = 'sm',
  shape = 'circle'
} = defineProps<{
  class?: HTMLAttributes['class']
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
}>()
</script>

<template>
  <AvatarRoot :class="cn(avatarVariant({ size, shape }), propClass)">
    <slot />
  </AvatarRoot>
</template>
