<script setup lang="ts">
interface Props {
  isOpen: boolean
  closeLabel?: string
}

withDefaults(defineProps<Props>(), {
  closeLabel: 'Fechar painel'
})

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[1100] bg-base-950/60 backdrop-blur-sm lg:hidden"
      @click="emit('close')"
    >
      <div class="absolute left-4 right-4 top-4" @click.stop>
        <div class="relative">
          <button
            type="button"
            :aria-label="closeLabel"
            class="absolute -right-2 -top-2 z-10 flex size-8 items-center justify-center rounded-full border border-secondary-100 bg-base-0 shadow-md"
            @click="emit('close')"
          >
            <Icon name="lucide:x" class="size-4 text-base-950" aria-hidden="true" />
          </button>
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>
