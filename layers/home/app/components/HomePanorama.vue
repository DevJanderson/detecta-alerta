<script setup lang="ts">
interface Props {
  region?: string
}

const props = withDefaults(defineProps<Props>(), {
  region: 'Brasil'
})

// Mock data — será substituído por dados da API
const mockData = {
  percentage: '44.7%',
  level: 'Médio',
  description: 'dos estabelecimentos acima da média histórica. Tendência de alta.',
  insight:
    'Centro-Oeste mostra variação moderada. Os demais 4 regiões estão dentro do esperado. Tendência de aumento nas últimas semanas.',
  totalEstabelecimentos: 3365,
  drogarias: 880,
  ubs: 510,
  upas: 244
}
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <header class="flex items-center justify-between pl-6 pr-0">
        <h2 class="text-xl font-bold text-base-900">Panorama - {{ props.region }}</h2>
        <button class="flex items-center gap-1 text-sm text-secondary-700 hover:text-secondary-900">
          como é feito o cálculo
          <Icon name="lucide:help-circle" class="size-4" />
        </button>
      </header>

      <!-- Cards de dados -->
      <div class="flex flex-col gap-4">
        <!-- Porcentagem + insight -->
        <div class="flex flex-col gap-4 rounded-lg border border-base-100 p-6 lg:flex-row">
          <!-- Lado esquerdo: porcentagem -->
          <div class="flex-1 border-base-100 lg:border-r lg:pr-6">
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-primary-900">{{ mockData.percentage }}</span>
              <span
                class="rounded-full border border-alert-200 bg-alert-50 px-2 py-0.5 text-xs font-medium text-alert-900"
              >
                {{ mockData.level }}
              </span>
            </div>
            <p class="mt-2 text-sm text-base-600">{{ mockData.description }}</p>
          </div>
          <!-- Lado direito: insight -->
          <div class="flex-1 lg:pl-6">
            <p class="text-sm text-base-700">
              <strong>Centro-Oeste</strong> mostra variação <strong>moderada</strong>. Os demais 4
              regiões estão dentro do esperado. Tendência de aumento nas últimas semanas.
            </p>
          </div>
        </div>

        <!-- Contadores de estabelecimentos -->
        <div class="flex flex-wrap items-center justify-between gap-4 px-6 text-sm text-base-600">
          <span>
            {{ mockData.totalEstabelecimentos.toLocaleString('pt-BR') }}
            estabelecimentos analisados em
            <strong class="text-base-900">{{ props.region.toLowerCase() }}</strong
            >.
          </span>
          <div class="flex items-center gap-6">
            <span class="flex items-center gap-1.5">
              <Icon name="lucide:pill" class="size-4 text-secondary-600" />
              {{ mockData.drogarias }} drogarias
            </span>
            <span class="flex items-center gap-1.5">
              <Icon name="lucide:stethoscope" class="size-4 text-secondary-600" />
              {{ mockData.ubs }} UBS
            </span>
            <span class="flex items-center gap-1.5">
              <Icon name="lucide:hospital" class="size-4 text-secondary-600" />
              {{ mockData.upas }} UPAs
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
