<script setup lang="ts">
import { Lightbulb, Info, AlertTriangle, XCircle } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    type?: 'tip' | 'info' | 'warning' | 'danger'
    title?: string
  }>(),
  {
    type: 'info',
    title: undefined
  }
)

const config = computed(() => {
  const configs = {
    tip: {
      icon: Lightbulb,
      defaultTitle: 'Dica',
      border: 'border-success-600',
      bg: 'bg-success-50',
      iconColor: 'text-success-700'
    },
    info: {
      icon: Info,
      defaultTitle: 'Info',
      border: 'border-secondary-400',
      bg: 'bg-secondary-50',
      iconColor: 'text-secondary-700'
    },
    warning: {
      icon: AlertTriangle,
      defaultTitle: 'Atenção',
      border: 'border-alert-600',
      bg: 'bg-alert-50',
      iconColor: 'text-alert-950'
    },
    danger: {
      icon: XCircle,
      defaultTitle: 'Perigo',
      border: 'border-danger-600',
      bg: 'bg-danger-50',
      iconColor: 'text-danger-900'
    }
  }
  return configs[props.type]
})

const displayTitle = computed(() => props.title ?? config.value.defaultTitle)
</script>

<template>
  <div class="my-4 rounded-lg border-l-4 p-4" :class="[config.border, config.bg]" role="note">
    <div class="flex items-center gap-2 font-semibold">
      <component :is="config.icon" class="h-4 w-4 shrink-0" :class="config.iconColor" />
      <span class="text-sm">{{ displayTitle }}</span>
    </div>
    <div class="mt-2 text-sm [&>p]:m-0">
      <slot />
    </div>
  </div>
</template>
