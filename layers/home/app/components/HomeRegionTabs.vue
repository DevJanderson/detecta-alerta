<script setup lang="ts">
const store = useHomeStore()
</script>

<template>
  <div
    class="relative z-50 w-full border-b-2 border-base-0 bg-[url('/patterns/pattern-curve.svg')] px-6 pt-8 pb-10 lg:w-[222.22%] lg:px-20"
  >
    <div class="relative z-10 flex flex-col gap-2">
      <span class="pl-6 text-sm font-semibold leading-tight text-base-0 sm:text-base">
        Selecione uma Região:
      </span>
      <div
        class="flex items-center gap-2 self-stretch overflow-hidden rounded-full border border-secondary-100 bg-base-0 p-1"
      >
        <button
          v-for="region in store.regions"
          :key="region.id"
          :aria-selected="store.filtros.region === region.id"
          class="flex h-12 flex-1 min-w-0 items-center justify-center gap-2 rounded-full px-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2 sm:h-14 lg:px-6"
          :class="
            store.filtros.region === region.id
              ? 'bg-secondary-900 font-semibold text-base-0'
              : 'bg-transparent font-normal text-secondary-700 hover:bg-secondary-50'
          "
          @click="store.setRegion(region.id)"
        >
          <Icon
            v-if="store.filtros.region === region.id"
            name="lucide:map-pin"
            class="size-4 shrink-0"
          />
          <span class="truncate text-sm leading-[150%] sm:text-base">{{ region.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
