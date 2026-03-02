<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  colors: { shade: string; class: string }[]
  classPrefix: string
  showBorder?: boolean
}

withDefaults(defineProps<Props>(), {
  showBorder: false
})
</script>

<template>
  <div>
    <h2 class="mb-1 text-xl font-semibold text-foreground">
      {{ title }}
    </h2>
    <p class="mb-4 text-sm text-muted-foreground">{{ subtitle }}</p>

    <section>
      <div
        class="grid grid-cols-6 gap-2"
        :style="{ gridTemplateColumns: `repeat(${Math.min(colors.length, 12)}, minmax(0, 1fr))` }"
      >
        <div v-for="color in colors" :key="color.shade" class="flex flex-col items-center">
          <div
            class="h-16 w-full rounded-lg shadow-sm"
            :class="[color.class, showBorder ? 'border border-border' : '']"
          />
          <span class="mt-1 text-xs text-muted-foreground">{{ color.shade }}</span>
        </div>
      </div>
      <p class="mt-3 text-sm text-muted-foreground">
        Classe: <code class="rounded bg-muted px-1">{{ classPrefix }}{shade}</code>
      </p>
    </section>
  </div>
</template>
