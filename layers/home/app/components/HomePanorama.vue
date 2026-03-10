<script setup lang="ts">
// TODO: substituir por dados da API quando disponível
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-alert-200">
    <!-- ============================================================
         HEADER AMARELO
         ============================================================ -->
    <div
      class="flex items-start justify-between border-b border-secondary-100 bg-alert-50 px-6 py-8"
    >
      <!-- Texto esquerdo -->
      <div class="flex flex-1 flex-col gap-4">
        <h3 class="text-xl font-semibold leading-tight text-alert-950">
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
        class="flex shrink-0 items-center gap-2 rounded-full border border-alert-200 bg-alert-900 px-4 py-1.5 text-sm font-semibold text-base-950"
      >
        <Icon name="lucide:arrow-up" class="size-4" />
        23% mais alto que o normal
      </span>
    </div>

    <!-- ============================================================
         BARRA DE ESTABELECIMENTOS
         ============================================================ -->
    <div class="flex items-center justify-between bg-alert-200 px-6 py-2">
      <div class="flex items-center gap-4">
        <!-- Drogarias -->
        <span class="flex items-center gap-1.5 text-xs text-base-800">
          <Icon name="lucide:pill" class="size-3" />
          900 drogarias:
          <span class="font-medium text-primary-950">40%</span>
          <Icon name="lucide:arrow-up" class="size-3 text-primary-950" />
        </span>

        <span class="inline-block h-3 w-px bg-base-300" />

        <!-- UBS -->
        <span class="flex items-center gap-1.5 text-xs text-base-800">
          <Icon name="lucide:stethoscope" class="size-3" />
          20 UBS:
          <span class="font-medium text-alert-950">7%</span>
          <Icon name="lucide:arrow-up" class="size-3 text-alert-950" />
        </span>

        <span class="inline-block h-3 w-px bg-base-300" />

        <!-- UPAs -->
        <span class="flex items-center gap-1.5 text-xs text-base-800">
          <Icon name="lucide:hospital" class="size-3" />
          20 UPAs:
          <span class="font-medium text-secondary-900">4%</span>
          <Icon name="lucide:arrow-down" class="size-3 text-secondary-900" />
        </span>
      </div>

      <span class="text-xs text-base-800">940 estabelecimentos analisados</span>
    </div>

    <!-- ============================================================
         AGRAVOS SECTION
         ============================================================ -->
    <div class="bg-white px-6 pt-6 pb-8">
      <!-- Titulo + fonte -->
      <div class="flex items-start justify-between gap-8">
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
           CARDS DE AGRAVOS (3 colunas)
           ======================================================== -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- ── Card 1: Arboviroses (azul / secondary) ── -->
        <div class="flex flex-col gap-3">
          <h5 class="px-4 text-sm font-semibold text-base-950">Arboviroses</h5>
          <div class="overflow-hidden rounded-md border border-secondary-100 shadow-sm">
            <!-- Chart area (azul) -->
            <div class="bg-secondary-50 px-4 pt-4 pb-3">
              <!-- Destaque principal -->
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
              <!-- Placeholder mini-chart -->
              <div
                class="flex h-24 items-center justify-center rounded border border-dashed border-secondary-200"
              >
                <Icon name="lucide:chart-line" class="size-8 text-secondary-300" />
              </div>
              <!-- Trend -->
              <p class="mt-3 text-center text-[10px] text-secondary-900">
                Diminuiu em Todo o Brasil
                <Icon name="lucide:trending-down" class="inline size-3" />
              </p>
            </div>
            <!-- Sub-items -->
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
            <!-- Chart area (amarelo) -->
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
            <!-- Sub-items -->
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
            <!-- Chart area (vermelho) -->
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
            <!-- Sub-items -->
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
</template>
