import type { MunicipioSelecionado, AsideTab, Noticia } from './types'

export const useMeuMunicipioStore = defineStore('meu-municipio', () => {
  // Estado
  // Mock: município padrão até integração com API de busca
  const municipio = ref<MunicipioSelecionado | null>({
    nome: 'São Paulo',
    estado: 'São Paulo, SP',
    regiao: 'Sudeste'
  })
  const showOnboarding = ref(false)
  const activeTab = ref<AsideTab>('resumo')
  const noticias = shallowRef<Noticia[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Derivados
  const hasMunicipio = computed(() => municipio.value !== null)

  const municipioDisplay = computed(() => {
    if (!municipio.value) return null
    return {
      nome: municipio.value.nome,
      subtitulo: `${municipio.value.estado} — Região ${municipio.value.regiao}`
    }
  })

  // Actions
  function setMunicipio(m: MunicipioSelecionado) {
    municipio.value = m
    showOnboarding.value = false
  }

  function openOnboarding() {
    showOnboarding.value = true
  }

  function closeOnboarding() {
    showOnboarding.value = false
  }

  function setActiveTab(tab: AsideTab) {
    activeTab.value = tab
  }

  return {
    // Estado
    municipio,
    showOnboarding,
    activeTab,
    noticias,
    isLoading,
    error,
    // Derivados
    hasMunicipio,
    municipioDisplay,
    // Actions
    setMunicipio,
    openOnboarding,
    closeOnboarding,
    setActiveTab
  }
})
