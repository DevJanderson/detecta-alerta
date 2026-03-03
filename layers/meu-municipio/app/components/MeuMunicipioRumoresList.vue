<script setup lang="ts">
const store = useMeuMunicipioStore()

function formatDate(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr + 'T00:00:00')
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias atrás`

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div>
    <div class="mb-3">
      <h3 class="text-base font-bold text-base-900">Últimos rumores</h3>
      <p class="text-xs text-base-500">Confira as informações mais recentes.</p>
    </div>

    <div v-if="store.rumores.length === 0" class="py-8 text-center">
      <Icon name="lucide:newspaper" class="mx-auto size-8 text-base-200" />
      <p class="mt-2 text-sm text-base-400">Nenhum rumor encontrado.</p>
    </div>

    <div class="space-y-3">
      <article
        v-for="rumor in store.rumores"
        :key="rumor.id"
        class="rounded-lg border border-base-200 bg-white p-4"
      >
        <h4 class="text-sm font-semibold leading-snug text-base-900">
          {{ rumor.titulo }}
        </h4>
        <div class="mt-2 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-base-500">
            <Icon v-if="rumor.fonteUrl" name="lucide:globe" class="size-3.5 text-base-400" />
            <a
              v-if="rumor.fonteUrl"
              :href="rumor.fonteUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-secondary-600 hover:text-secondary-800"
            >
              {{ rumor.fonte }}
            </a>
            <span v-else class="font-medium">{{ rumor.fonte }}</span>
            <span class="text-base-300">|</span>
            <span>{{ formatDate(rumor.data) }}</span>
          </div>
          <button
            class="flex items-center gap-1 text-xs font-medium text-secondary-600 hover:text-secondary-800"
          >
            ver rumor
            <Icon name="lucide:arrow-right" class="size-3.5" />
          </button>
        </div>
      </article>

      <!-- Botão ir para rumores -->
      <button
        class="flex w-full items-center justify-center gap-1.5 rounded-lg border border-base-200 py-2.5 text-sm font-medium text-secondary-600 hover:bg-secondary-50"
      >
        ir para rumores
        <Icon name="lucide:arrow-right" class="size-4" />
      </button>
    </div>
  </div>
</template>
