<script setup lang="ts">
const sidebarOpen = ref(false)
const mainRef = ref<HTMLElement>()
const { items, activeId, scan, cleanup } = useDesignSystemToc()

watch(
  () => useRoute().path,
  async () => {
    cleanup()
    await nextTick()
    if (mainRef.value) scan(mainRef.value)
  },
  { flush: 'post' }
)

onMounted(() => {
  if (mainRef.value) scan(mainRef.value)
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 z-30">
      <CommonAppHeader />
    </div>

    <div class="mx-auto flex max-w-screen-2xl">
      <!-- Sidebar desktop -->
      <aside class="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 lg:block">
        <ScrollArea class="h-full">
          <CommonDesignSystemNav />
        </ScrollArea>
      </aside>

      <!-- Sidebar mobile (Sheet) -->
      <Sheet v-model:open="sidebarOpen">
        <SheetTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="fixed bottom-4 left-4 z-40 rounded-full shadow-lg lg:hidden"
            aria-label="Menu Design System"
          >
            <Icon name="lucide:menu" class="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" class="w-72 p-0">
          <SheetHeader class="px-4 py-3">
            <SheetTitle class="text-lg font-bold">Design System</SheetTitle>
          </SheetHeader>
          <ScrollArea class="h-[calc(100vh-4rem)]">
            <CommonDesignSystemNav />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <!-- Conteudo principal -->
      <main ref="mainRef" class="min-w-0 flex-1 px-6 py-8 lg:px-12">
        <div class="mx-auto max-w-3xl">
          <slot />
        </div>
      </main>

      <!-- TOC desktop -->
      <aside class="sticky top-16 hidden h-[calc(100vh-4rem)] w-52 shrink-0 xl:block">
        <div class="h-full overflow-auto px-4 py-8">
          <div v-if="items.length" class="space-y-2">
            <p class="text-sm font-semibold text-foreground">Nesta página</p>
            <nav class="space-y-0.5">
              <a
                v-for="item in items"
                :key="item.id"
                :href="`#${item.id}`"
                class="block text-sm transition-colors"
                :class="[
                  item.depth === 3 ? 'pl-4' : '',
                  activeId === item.id
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                ]"
              >
                {{ item.text }}
              </a>
            </nav>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
