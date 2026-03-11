<script setup lang="ts">
import type { AlertStatus, TrendType } from '#shared/types/sinapse'

const store = useHomeStore()

const alertBorderColors: Record<AlertStatus, string> = {
  green: 'border-success-200',
  yellow: 'border-alert-200',
  red: 'border-primary-200'
}

const alertHeaderBg: Record<AlertStatus, string> = {
  green: 'bg-success-50',
  yellow: 'bg-alert-50',
  red: 'bg-primary-50'
}

const alertTagBg: Record<AlertStatus, string> = {
  green: 'bg-success-200',
  yellow: 'bg-alert-200',
  red: 'bg-primary-200'
}

const alertTagBorder: Record<AlertStatus, string> = {
  green: 'border-success-300',
  yellow: 'border-alert-300',
  red: 'border-primary-300'
}

const alertBarBg: Record<AlertStatus, string> = {
  green: 'bg-success-100',
  yellow: 'bg-alert-200',
  red: 'bg-primary-100'
}

const trendIcons: Record<TrendType, string | null> = {
  up: 'lucide:arrow-up',
  down: 'lucide:arrow-down',
  stable: null
}

const trendColors: Record<TrendType, string> = {
  up: 'text-primary-950',
  down: 'text-success-900',
  stable: 'text-base-600'
}

function formatVariation(value: number): string {
  if (!Number.isFinite(value)) return '--%'
  return `${Math.round(Math.abs(value))}%`
}

function trendLabel(trend: TrendType): string {
  if (trend === 'up') return 'mais alto que o normal'
  if (trend === 'down') return 'mais baixo que o normal'
  return 'estável'
}

const UNIT_TYPES = [
  { key: 'drogarias' as const, icon: 'lucide:pill', label: 'drogarias' },
  { key: 'ubs' as const, icon: 'lucide:stethoscope', label: 'UBS' },
  { key: 'upas' as const, icon: 'lucide:hospital', label: 'UPAs' }
]

const unitTypes = computed(() => {
  if (!store.panorama) return []
  return UNIT_TYPES.map(u => ({ ...u, stats: store.panorama![u.key] })).filter(
    u => u.stats.count > 0
  )
})

const alertStatus = computed(() => store.panorama?.alertStatus ?? 'green')
</script>

<template>
  <div
    v-if="store.panorama"
    class="overflow-hidden rounded-xl border"
    :class="alertBorderColors[alertStatus]"
  >
    <!-- ============================================================
         HEADER
         ============================================================ -->
    <div
      class="flex flex-col gap-4 border-b border-secondary-100 px-4 py-5 sm:px-6 sm:py-8 md:flex-row md:items-start md:justify-between"
      :class="alertHeaderBg[alertStatus]"
    >
      <!-- Texto esquerdo -->
      <div class="flex flex-1 flex-col gap-3 sm:gap-4">
        <h3 class="text-base font-semibold leading-tight text-alert-950 sm:text-lg md:text-xl">
          Movimento em estabelecimentos de saúde
        </h3>
        <p class="flex items-start gap-2 text-xs leading-normal text-base-800">
          <Icon name="lucide:lightbulb" class="mt-0.5 size-3 shrink-0 text-base-800" />
          <span>
            <span class="underline">
              Estudos do Instituto Todos pela Saúde (ITpS) indicam que movimento em estabelecimentos
              de saúde podem indicar cenário futuro de epidemia</span
            >. Em geral, drogarias são as primeiras a perceber o aumento de movimento.
          </span>
        </p>
      </div>

      <!-- Tag direita -->
      <span
        class="flex shrink-0 items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs font-semibold text-base-950 sm:px-4 sm:text-sm"
        :class="[alertTagBg[alertStatus], alertTagBorder[alertStatus]]"
      >
        <Icon
          v-if="trendIcons[store.panorama.trend]"
          :name="trendIcons[store.panorama.trend]!"
          class="size-3.5 sm:size-4"
        />
        {{ formatVariation(store.panorama.variation) }} {{ trendLabel(store.panorama.trend) }}
      </span>
    </div>

    <!-- ============================================================
         BARRA DE ESTABELECIMENTOS
         ============================================================ -->
    <div
      class="flex flex-col gap-2 px-4 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2 sm:px-6"
      :class="alertBarBg[alertStatus]"
    >
      <div class="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
        <template v-for="(unit, idx) in unitTypes" :key="unit.key">
          <span v-if="idx > 0" class="hidden h-3 w-px bg-base-300 sm:inline-block" />
          <span class="flex items-center gap-1.5 text-xs text-base-800">
            <Icon :name="unit.icon" class="size-3" />
            {{ unit.stats.count }} {{ unit.label }}:
            <span class="font-medium" :class="trendColors[unit.stats.trend]">
              {{ formatVariation(unit.stats.variation) }}
            </span>
            <Icon
              v-if="trendIcons[unit.stats.trend]"
              :name="trendIcons[unit.stats.trend]!"
              class="size-3"
              :class="trendColors[unit.stats.trend]"
            />
          </span>
        </template>
      </div>

      <span class="text-xs text-base-800">
        {{ store.panorama.totalEstabelecimentos }} estabelecimentos analisados
      </span>
    </div>

    <!-- ============================================================
         AGRAVOS SECTION (mock — aguardando API)
         ============================================================ -->
    <div class="bg-white px-4 pt-6 pb-8 sm:px-6">
      <!-- Titulo + fonte -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <h4 class="shrink-0 text-base font-semibold leading-tight text-base-950">
          Número de casos por agravo
        </h4>
        <p class="text-right text-xs leading-normal text-base-800">
          Porcentagem de casos conforme
          <span class="underline">Ministério da Saúde (MS)</span> e
          <span class="underline"
            >Rede de Análise de Dados Integrados para Monitoramento de Doenças Infecciosas
            (Radim)</span
          >
        </p>
      </div>

      <hr class="my-6 border-base-100" />

      <!-- ========================================================
           CARDS DE AGRAVOS (3 colunas) — mock aguardando API
           ======================================================== -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <!-- ── Card 1: Arboviroses (azul / secondary) ── -->
        <div class="flex flex-col gap-3">
          <h5 class="px-4 text-sm font-semibold text-base-950">Arboviroses</h5>
          <div class="overflow-hidden rounded-md border border-secondary-100 shadow-sm">
            <div class="bg-secondary-50 px-4 pt-4 pb-3">
              <div class="flex items-start justify-between pb-2">
                <div>
                  <p class="text-xs font-semibold text-base-800">Dengue</p>
                  <p class="text-[10px] text-base-800">Ministério (MS): +21%</p>
                </div>
                <span class="text-[10px] text-base-800">
                  Radim:
                  <span class="text-xs font-medium text-primary-950">2%</span>
                  <Icon name="lucide:arrow-up" class="inline size-3 text-primary-950" />
                </span>
              </div>
              <div
                class="flex h-24 items-center justify-center rounded border border-dashed border-secondary-200"
              >
                <Icon name="lucide:chart-line" class="size-8 text-secondary-300" />
              </div>
              <p class="mt-3 text-center text-[10px] text-secondary-900">
                Diminuiu em Todo o Brasil
                <Icon name="lucide:trending-down" class="inline size-3" />
              </p>
            </div>
            <div class="flex flex-col px-4 py-4">
              <div class="flex items-center justify-between border-b border-base-50 py-2">
                <div>
                  <p class="text-xs font-semibold text-base-800">Chikungunya</p>
                  <p class="text-[10px] text-base-600">Ministério (MS): -4%</p>
                </div>
                <span class="text-[10px] text-base-600">
                  Radim:
                  <span class="text-xs text-secondary-900">4%</span>
                  <Icon name="lucide:arrow-down" class="inline size-3 text-secondary-900" />
                </span>
              </div>
              <div class="flex items-center justify-between pt-2">
                <div>
                  <p class="text-xs font-semibold text-base-800">Zika Vírus</p>
                  <p class="text-[10px] text-base-600">Ministério (MS): +7%</p>
                </div>
                <span class="text-[10px] text-base-600">
                  Radim:
                  <span class="text-xs text-alert-950">7%</span>
                  <Icon name="lucide:arrow-up" class="inline size-3 text-alert-950" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Card 2: Síndromes Respiratórias (amarelo / alert) ── -->
        <div class="flex flex-col gap-3">
          <h5 class="px-4 text-sm font-semibold text-base-950">Síndromes Respiratórias</h5>
          <div class="overflow-hidden rounded-md border border-alert-200 shadow-sm">
            <div class="bg-alert-50 px-4 pt-4 pb-3">
              <div class="flex items-start justify-between pb-2">
                <div>
                  <p class="text-xs font-semibold text-base-800">Covid-19</p>
                  <p class="text-[10px] text-base-800">Ministério (MS): +21%</p>
                </div>
                <span class="text-[10px] text-base-800">
                  Radim:
                  <span class="text-xs font-medium text-primary-950">21%</span>
                  <Icon name="lucide:arrow-up" class="inline size-3 text-primary-950" />
                </span>
              </div>
              <div
                class="flex h-24 items-center justify-center rounded border border-dashed border-alert-300"
              >
                <Icon name="lucide:chart-line" class="size-8 text-alert-500" />
              </div>
              <p class="mt-3 text-center text-[10px] text-alert-950">
                Aumento leve no Sul
                <Icon name="lucide:trending-up" class="inline size-3" />
              </p>
            </div>
            <div class="flex flex-col px-4 py-4">
              <div class="flex items-center justify-between border-b border-base-50 py-2">
                <div>
                  <p class="text-xs font-semibold text-base-800">Influenza A</p>
                  <p class="text-[10px] text-base-600">Ministério (MS): -4%</p>
                </div>
                <span class="text-[10px] text-base-600">
                  Radim:
                  <span class="text-xs text-secondary-900">4%</span>
                  <Icon name="lucide:arrow-down" class="inline size-3 text-secondary-900" />
                </span>
              </div>
              <div class="flex items-center justify-between pt-2">
                <div>
                  <p class="text-xs font-semibold text-base-800">Influenza B</p>
                  <p class="text-[10px] text-base-600">Ministério (MS): +7%</p>
                </div>
                <span class="text-[10px] text-base-600">
                  Radim:
                  <span class="text-xs text-alert-950">7%</span>
                  <Icon name="lucide:arrow-up" class="inline size-3 text-alert-950" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Card 3: Outras síndromes (vermelho / danger) ── -->
        <div class="flex flex-col gap-3">
          <h5 class="px-4 text-sm font-semibold text-base-950">Outras síndromes</h5>
          <div class="overflow-hidden rounded-md border border-danger-200 shadow-sm">
            <div class="bg-danger-50 px-4 pt-4 pb-3">
              <div class="flex items-start justify-between pb-2">
                <div>
                  <p class="text-xs font-semibold text-base-800">Agravo 1</p>
                  <p class="text-[10px] text-base-800">Ministério (MS): +21%</p>
                </div>
                <span class="text-[10px] text-base-800">
                  Radim:
                  <span class="text-xs font-medium text-primary-950">21%</span>
                  <Icon name="lucide:arrow-up" class="inline size-3 text-primary-950" />
                </span>
              </div>
              <div
                class="flex h-24 items-center justify-center rounded border border-dashed border-danger-300"
              >
                <Icon name="lucide:chart-line" class="size-8 text-danger-400" />
              </div>
              <p class="mt-3 text-center text-[10px] text-primary-950">
                Aumento expressivo em São Paulo
                <Icon name="lucide:trending-up" class="inline size-3" />
              </p>
            </div>
            <div class="flex flex-col px-4 py-4">
              <div class="flex items-center justify-between border-b border-base-50 py-2">
                <div>
                  <p class="text-xs font-semibold text-base-800">Agravo 2</p>
                  <p class="text-[10px] text-base-600">Ministério (MS): -4%</p>
                </div>
                <span class="text-[10px] text-base-600">
                  Radim:
                  <span class="text-xs text-secondary-900">4%</span>
                  <Icon name="lucide:arrow-down" class="inline size-3 text-secondary-900" />
                </span>
              </div>
              <div class="flex items-center justify-between pt-2">
                <div>
                  <p class="text-xs font-semibold text-base-800">Agravo 3</p>
                  <p class="text-[10px] text-base-600">Ministério (MS): +7%</p>
                </div>
                <span class="text-[10px] text-base-600">
                  Radim:
                  <span class="text-xs text-alert-950">7%</span>
                  <Icon name="lucide:arrow-up" class="inline size-3 text-alert-950" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading state -->
  <div
    v-else-if="store.isLoading"
    class="flex items-center justify-center rounded-xl border border-base-100 py-20"
  >
    <Icon name="lucide:loader-2" class="size-6 animate-spin text-base-400" />
  </div>
</template>
