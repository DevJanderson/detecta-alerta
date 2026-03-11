/**
 * Composable — Formulário de Adicionar/Editar Unidade
 *
 * Gerencia estado do formulário, validação e submit (mock por enquanto).
 */
import type { TipoUnidade } from './types'

export interface FormUnidade {
  placeId: string
  titulo: string
  tipoUnidade: TipoUnidade | ''
  url: string
  endereco: string
  bairro: string
  estado: string
  cidade: string
  codigoIbge: string
  latitude: number | undefined
  longitude: number | undefined
  ativa: boolean
  tempoReal: 0 | 1 | 2
  notaTotal: number | undefined
  totalAvaliacoes: number | undefined
}

function criarFormVazio(): FormUnidade {
  return {
    placeId: '',
    titulo: '',
    tipoUnidade: '',
    url: '',
    endereco: '',
    bairro: '',
    estado: '',
    cidade: '',
    codigoIbge: '',
    latitude: undefined,
    longitude: undefined,
    ativa: true,
    tempoReal: 0,
    notaTotal: undefined,
    totalAvaliacoes: undefined
  }
}

export function useAdicionarUnidadeForm() {
  const route = useRoute()
  const router = useRouter()
  const store = useLugaresMonitoradosStore()

  const form = ref<FormUnidade>(criarFormVazio())
  const touched = ref(new Set<string>())
  const isSubmitting = ref(false)
  const submitError = ref('')
  const submitSuccess = ref(false)

  const editPlaceId = computed(() => route.query.edit as string | undefined)
  const isEditMode = computed(() => !!editPlaceId.value)
  let skipNextEstadoReset = false

  // Carrega unidade para edição (aguarda dados da store)
  function loadUnidade(placeId: string) {
    const unidade = store.unidades.find(u => u.placeId === placeId)
    if (!unidade) return
    skipNextEstadoReset = true
    form.value = {
      placeId: unidade.placeId,
      titulo: unidade.titulo,
      tipoUnidade: unidade.tipoUnidade,
      url: unidade.url ?? '',
      endereco: unidade.endereco ?? '',
      bairro: unidade.bairro ?? '',
      estado: unidade.estado,
      cidade: unidade.cidade,
      codigoIbge: unidade.codigoIbge?.toString() ?? '',
      latitude: unidade.latitude,
      longitude: unidade.longitude,
      ativa: unidade.ativa,
      tempoReal: unidade.tempoReal,
      notaTotal: unidade.notaTotal ?? undefined,
      totalAvaliacoes: unidade.totalAvaliacoes ?? undefined
    }
  }

  // Tenta carregar imediatamente; se não houver dados, observa a store
  if (editPlaceId.value) {
    if (store.unidades.length > 0) {
      loadUnidade(editPlaceId.value)
    } else {
      const stopWatch = watch(
        () => store.unidades,
        unidades => {
          if (unidades.length > 0 && editPlaceId.value) {
            loadUnidade(editPlaceId.value)
            stopWatch()
          }
        }
      )
    }
  }

  // Cidades disponíveis para o estado selecionado
  const cidadesDisponiveis = computed(() => {
    if (!form.value.estado) return []
    const cidades = store.unidades.filter(u => u.estado === form.value.estado).map(u => u.cidade)
    return [...new Set(cidades)].sort()
  })

  // Validação
  const errors = computed(() => {
    const errs: Partial<Record<keyof FormUnidade, string>> = {}
    if (!form.value.titulo.trim()) errs.titulo = 'Nome é obrigatório'
    if (!form.value.tipoUnidade) errs.tipoUnidade = 'Tipo é obrigatório'
    if (!form.value.estado) errs.estado = 'Estado é obrigatório'
    if (!form.value.cidade.trim()) errs.cidade = 'Cidade é obrigatória'
    if (!isEditMode.value && !form.value.placeId.trim()) errs.placeId = 'ID é obrigatório'
    return errs
  })

  const isFormValid = computed(() => Object.keys(errors.value).length === 0)

  function markTouched(field: string) {
    touched.value.add(field)
    touched.value = new Set(touched.value)
  }

  function getFieldError(field: keyof FormUnidade): string | undefined {
    if (!touched.value.has(field)) return undefined
    return errors.value[field]
  }

  function generatePlaceId() {
    const state = form.value.estado || 'XX'
    const city = form.value.cidade?.replace(/\s/g, '_').substring(0, 10) || 'CITY'
    const ts = Date.now().toString(36).toUpperCase()
    form.value.placeId = `MANUAL_${state}_${city}_${ts}`
  }

  // Reset cidade ao mudar estado (ignora ao carregar dados de edição)
  watch(
    () => form.value.estado,
    () => {
      if (skipNextEstadoReset) {
        skipNextEstadoReset = false
        return
      }
      form.value.cidade = ''
    }
  )

  async function handleSubmit() {
    // Marca todos os campos obrigatórios como touched
    for (const key of ['titulo', 'tipoUnidade', 'estado', 'cidade', 'placeId'] as const) {
      markTouched(key)
    }

    if (!isFormValid.value) return

    isSubmitting.value = true
    submitError.value = ''
    submitSuccess.value = false

    try {
      // TODO: substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 800))
      submitSuccess.value = true

      setTimeout(() => {
        router.push('/lugares-monitorados/tabela')
      }, 1500)
    } catch {
      submitError.value = 'Erro ao salvar unidade. Tente novamente.'
    } finally {
      isSubmitting.value = false
    }
  }

  function navigateBack() {
    router.back()
  }

  return {
    form,
    isEditMode,
    editPlaceId,
    cidadesDisponiveis,
    errors,
    isFormValid,
    isSubmitting,
    submitError,
    submitSuccess,
    markTouched,
    getFieldError,
    generatePlaceId,
    handleSubmit,
    navigateBack
  }
}
