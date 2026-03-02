<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'

const ALL = '__all__'

const store = useRumoresStore()
const route = useRoute()
const router = useRouter()

const searchTerm = ref('')
const doencaSelecionada = ref(ALL)
const estadoSelecionado = ref(ALL)

// ESTADOS_BR auto-importado de layers/base/app/utils/constants

// Inicializar filtros a partir da URL
onMounted(() => {
  const q = route.query
  if (q.search_term) searchTerm.value = String(q.search_term)
  if (q.doencas) doencaSelecionada.value = String(q.doencas)
  if (q.states) estadoSelecionado.value = String(q.states)
})

// Debounce na busca textual
const debouncedSearch = useDebounce(searchTerm, 500)

watch(debouncedSearch, value => {
  aplicar({ search_term: value || undefined })
})

function onDoencaChange(value: AcceptableValue) {
  const v = String(value ?? ALL)
  doencaSelecionada.value = v
  aplicar({ doencas: v !== ALL ? [v] : undefined })
}

function onEstadoChange(value: AcceptableValue) {
  const v = String(value ?? ALL)
  estadoSelecionado.value = v
  aplicar({ states: v !== ALL ? [v] : undefined })
}

function aplicar(parcial: Record<string, unknown>) {
  const novosFiltros = { ...store.filtros, ...parcial }

  // Limpar valores vazios
  const filtrosLimpos = Object.fromEntries(
    Object.entries(novosFiltros).filter(
      ([, val]) => val !== undefined && val !== '' && !(Array.isArray(val) && val.length === 0)
    )
  )

  // Atualizar URL
  router.replace({ query: { ...filtrosLimpos } })

  store.aplicarFiltros(filtrosLimpos)
}

function limpar() {
  searchTerm.value = ''
  doencaSelecionada.value = ALL
  estadoSelecionado.value = ALL
  router.replace({ query: {} })
  store.limparFiltros()
}
</script>

<template>
  <div class="mb-6 space-y-3">
    <div class="flex flex-wrap items-end gap-3">
      <!-- Busca textual -->
      <div class="min-w-[200px] flex-1">
        <label for="search" class="mb-1 block text-sm font-medium"> Buscar </label>
        <Input id="search" v-model="searchTerm" placeholder="Buscar rumores..." type="search" />
      </div>

      <!-- Doenca -->
      <div class="w-[180px]">
        <label for="doenca" class="mb-1 block text-sm font-medium"> Doença </label>
        <Select :model-value="doencaSelecionada" @update:model-value="onDoencaChange">
          <SelectTrigger id="doenca">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="ALL">Todas</SelectItem>
            <SelectItem v-for="d in store.doencas" :key="d.id" :value="d.name">
              {{ d.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Estado -->
      <div class="w-[120px]">
        <label for="estado" class="mb-1 block text-sm font-medium"> Estado </label>
        <Select :model-value="estadoSelecionado" @update:model-value="onEstadoChange">
          <SelectTrigger id="estado">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="ALL">Todos</SelectItem>
            <SelectItem v-for="uf in ESTADOS_BR" :key="uf" :value="uf">
              {{ uf }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Limpar -->
      <Button v-if="store.filtrosAtivos > 0" variant="ghost" size="sm" @click="limpar">
        Limpar filtros ({{ store.filtrosAtivos }})
      </Button>
    </div>
  </div>
</template>
