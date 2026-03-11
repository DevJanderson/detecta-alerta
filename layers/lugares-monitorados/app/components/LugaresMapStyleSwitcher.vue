<script setup lang="ts">
const emit = defineEmits<{
  change: [url: string]
}>()

const isOpen = ref(false)
const currentStyle = ref<MapStyleId>('positron')

function selectStyle(style: (typeof MAP_STYLES)[number]) {
  currentStyle.value = style.id
  emit('change', style.url)
  isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <button
      class="flex size-10 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-base-50"
      title="Estilo do mapa"
      @click="isOpen = !isOpen"
    >
      <Icon name="lucide:layers" class="size-5 text-base-700" />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-12 left-0 z-50 min-w-36 rounded-lg border border-base-100 bg-white py-1 shadow-lg"
      >
        <button
          v-for="style in MAP_STYLES"
          :key="style.id"
          class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-base-50"
          :class="currentStyle === style.id ? 'font-semibold text-primary-900' : 'text-base-700'"
          @click="selectStyle(style)"
        >
          <Icon
            :name="currentStyle === style.id ? 'lucide:check' : 'lucide:map'"
            class="size-4 shrink-0"
            :class="currentStyle === style.id ? 'text-primary-700' : 'text-base-400'"
          />
          {{ style.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>
