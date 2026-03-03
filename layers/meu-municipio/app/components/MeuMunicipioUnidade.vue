<script setup lang="ts">
import type { Level, UnitType } from '../composables/types'

const store = useMeuMunicipioStore()

const activeTab = ref<'resumo' | 'sobre'>('resumo')

const typeLabels: Record<UnitType, string> = {
  drogaria: 'Drogaria',
  ubs: 'UBS',
  upa: 'UPA'
}

const typeIcons: Record<UnitType, string> = {
  drogaria: 'lucide:pill',
  ubs: 'lucide:heart-pulse',
  upa: 'lucide:hospital'
}

const levelColors: Record<Level, string> = {
  Baixo: 'border-success-200 bg-success-50 text-success-700',
  Médio: 'border-alert-200 bg-alert-50 text-alert-700',
  Alto: 'border-danger-200 bg-danger-50 text-danger-700'
}

function getOcupacaoLevel(ocupacao: number): Level {
  if (ocupacao >= 80) return 'Alto'
  if (ocupacao >= 50) return 'Médio'
  return 'Baixo'
}

function getOcupacaoColor(ocupacao: number) {
  if (ocupacao >= 80) return 'bg-danger-500'
  if (ocupacao >= 50) return 'bg-alert-500'
  return 'bg-success-500'
}
</script>

<template>
  <div v-if="store.unidadeSelecionada">
    <!-- Header com botão voltar -->
    <div class="flex items-center gap-3 border-b border-base-100 px-5 py-4">
      <button
        class="rounded-lg p-1.5 text-base-500 transition-colors hover:bg-base-50 hover:text-base-700"
        title="Voltar ao município"
        @click="store.voltarParaMunicipio()"
      >
        <Icon name="lucide:arrow-left" class="size-5" />
      </button>
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <Icon
            :name="typeIcons[store.unidadeSelecionada.tipo]"
            class="size-4 text-secondary-600"
          />
          <span class="text-xs font-medium text-secondary-600">
            {{ typeLabels[store.unidadeSelecionada.tipo] }}
          </span>
        </div>
        <h2 class="mt-0.5 text-base font-bold text-base-900">
          {{ store.unidadeSelecionada.nome }}
        </h2>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-base-200">
      <button
        class="flex flex-1 items-center justify-center gap-2 border-b-2 py-2.5 text-sm font-medium transition-colors"
        :class="
          activeTab === 'resumo'
            ? 'border-secondary-600 text-secondary-700'
            : 'border-transparent text-base-500 hover:text-base-700'
        "
        @click="activeTab = 'resumo'"
      >
        Resumo
      </button>
      <button
        class="flex flex-1 items-center justify-center gap-2 border-b-2 py-2.5 text-sm font-medium transition-colors"
        :class="
          activeTab === 'sobre'
            ? 'border-secondary-600 text-secondary-700'
            : 'border-transparent text-base-500 hover:text-base-700'
        "
        @click="activeTab = 'sobre'"
      >
        Sobre
      </button>
    </div>

    <!-- Tab: Resumo -->
    <div v-if="activeTab === 'resumo'" class="space-y-5 p-5">
      <!-- Card ocupação -->
      <div class="rounded-lg border border-base-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-base-500">Ocupação atual</p>
            <p class="mt-1 text-2xl font-bold text-base-900">
              {{ store.unidadeSelecionada.ocupacao }}%
            </p>
          </div>
          <span
            class="rounded-md border px-2 py-0.5 text-xs font-medium"
            :class="levelColors[getOcupacaoLevel(store.unidadeSelecionada.ocupacao)]"
          >
            {{ getOcupacaoLevel(store.unidadeSelecionada.ocupacao) }}
          </span>
        </div>
        <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-base-100">
          <div
            class="h-full rounded-full transition-all"
            :class="getOcupacaoColor(store.unidadeSelecionada.ocupacao)"
            :style="{ width: `${Math.min(store.unidadeSelecionada.ocupacao, 100)}%` }"
          />
        </div>
      </div>

      <!-- Lotação temporal -->
      <div v-if="store.unidadeLotacao">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-base font-bold text-base-900">Lotação</h3>
            <p class="text-xs text-base-500">Movimento das últimas semanas</p>
          </div>
          <span
            class="rounded-md border px-2 py-0.5 text-xs font-medium"
            :class="levelColors[store.unidadeLotacao.level]"
          >
            {{ store.unidadeLotacao.level }}
          </span>
        </div>
        <div
          class="mt-3 flex h-40 items-center justify-center rounded-lg border border-dashed border-base-200"
        >
          <div class="text-center">
            <Icon name="lucide:chart-line" class="mx-auto size-8 text-base-200" />
            <p class="mt-1 text-xs text-base-400">Gráfico temporal</p>
            <p class="text-xs text-base-300">(ApexCharts — integração futura)</p>
          </div>
        </div>
      </div>

      <!-- Status -->
      <div class="flex items-center gap-3 text-xs text-base-500">
        <span class="flex items-center gap-1.5">
          <span
            class="size-2 rounded-full"
            :class="store.unidadeSelecionada.ativa ? 'bg-success-500' : 'bg-base-300'"
          />
          {{ store.unidadeSelecionada.ativa ? 'Ativa' : 'Inativa' }}
        </span>
        <span class="flex items-center gap-1.5">
          <Icon
            name="lucide:radio"
            class="size-3.5"
            :class="store.unidadeSelecionada.dadosTempoReal ? 'text-success-500' : 'text-base-300'"
          />
          {{ store.unidadeSelecionada.dadosTempoReal ? 'Tempo real' : 'Sem tempo real' }}
        </span>
      </div>
    </div>

    <!-- Tab: Sobre -->
    <div v-if="activeTab === 'sobre'" class="space-y-4 p-5">
      <dl class="space-y-3 text-sm">
        <div>
          <dt class="text-xs font-medium text-base-500">Endereço</dt>
          <dd class="mt-0.5 text-base-900">{{ store.unidadeSelecionada.endereco }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-base-500">Cidade</dt>
          <dd class="mt-0.5 text-base-900">
            {{ store.unidadeSelecionada.cidade }} — {{ store.unidadeSelecionada.uf }}
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-base-500">Tipo</dt>
          <dd class="mt-0.5 flex items-center gap-1.5 text-base-900">
            <Icon
              :name="typeIcons[store.unidadeSelecionada.tipo]"
              class="size-4 text-secondary-600"
            />
            {{ typeLabels[store.unidadeSelecionada.tipo] }}
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-base-500">Coordenadas</dt>
          <dd class="mt-0.5 font-mono text-xs text-base-600">
            {{ store.unidadeSelecionada.coordinates.lat.toFixed(4) }},
            {{ store.unidadeSelecionada.coordinates.lng.toFixed(4) }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
