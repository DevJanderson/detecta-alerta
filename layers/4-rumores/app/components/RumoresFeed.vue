<script setup lang="ts">
const store = useRumoresStore()

// Infinite scroll via IntersectionObserver
const sentinelRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!sentinelRef.value) return

  const observer = new IntersectionObserver(
    entries => {
      if (entries[0]?.isIntersecting && store.hasMore && !store.isLoading) {
        store.fetchRumores()
      }
    },
    { rootMargin: '200px' }
  )

  observer.observe(sentinelRef.value)

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div>
    <!-- Error state -->
    <Alert v-if="store.error && !store.isLoading" variant="destructive" class="mb-4">
      <AlertDescription class="flex items-center justify-between">
        <span>{{ store.error }}</span>
        <Button variant="outline" size="sm" @click="store.fetchRumores(true)">
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>

    <!-- Loading skeleton (initial) -->
    <div v-if="store.isLoading && store.items.length === 0" class="space-y-3">
      <Card v-for="i in 6" :key="i" class="p-4">
        <div class="flex gap-4">
          <div class="hidden h-24 w-36 animate-pulse rounded-md bg-muted sm:block" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div class="h-3 w-full animate-pulse rounded bg-muted" />
            <div class="h-3 w-1/2 animate-pulse rounded bg-muted" />
            <div class="flex gap-2">
              <div class="h-5 w-16 animate-pulse rounded-full bg-muted" />
              <div class="h-5 w-12 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Feed -->
    <div v-else-if="store.items.length > 0" class="space-y-3">
      <RumoresCard v-for="noticia in store.items" :key="noticia.unique_id" :noticia="noticia" />

      <!-- Sentinel para infinite scroll -->
      <div ref="sentinelRef">
        <div v-if="store.isLoading" class="flex justify-center py-4">
          <div
            class="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
          />
        </div>
      </div>

      <p
        v-if="!store.hasMore && !store.isLoading"
        class="py-4 text-center text-sm text-muted-foreground"
      >
        Todos os rumores foram carregados.
      </p>
    </div>

    <!-- Empty state -->
    <div v-else-if="!store.isLoading && !store.error" class="py-12 text-center">
      <p class="text-lg font-medium text-muted-foreground">
        {{
          store.filtrosAtivos > 0
            ? 'Nenhum resultado para os filtros selecionados.'
            : 'Nenhum rumor disponível.'
        }}
      </p>
      <Button
        v-if="store.filtrosAtivos > 0"
        variant="outline"
        class="mt-4"
        @click="store.limparFiltros()"
      >
        Limpar filtros
      </Button>
    </div>
  </div>
</template>
