<script setup lang="ts">
interface ReportSource {
  name: string
  portal: string
  year: string
}

interface TrendingRumor {
  title: string
  description: string
  highlight?: string
  highlightExtra?: string
  tag: string
  time: string
}

defineProps<{
  sources: ReportSource[]
  rumors: TrendingRumor[]
}>()
</script>

<template>
  <section
    class="flex flex-col items-center gap-10 bg-secondary-50 px-4 py-16 sm:gap-16 sm:px-6 sm:py-24 lg:py-32"
  >
    <!-- Parte superior: título + lista numerada -->
    <div class="flex w-full max-w-332 flex-col gap-10 lg:flex-row lg:items-start lg:gap-20">
      <!-- Esquerda: título grande + ornamento + crédito -->
      <div class="flex flex-col gap-6 sm:gap-10 lg:flex-1">
        <p class="text-4xl font-bold leading-[1.25] text-secondary-600 sm:text-5xl lg:text-[60px]">
          Rumores<br />
          &amp; fontes
        </p>
        <div class="flex h-3 w-60 items-start gap-2">
          <div class="h-full flex-1 bg-primary-900" />
          <div class="h-full w-[17.5px] bg-primary-950" />
          <div class="h-full w-14 bg-secondary-900" />
        </div>

        <!-- Crédito do relatório -->
        <p class="text-sm leading-normal text-secondary-600 lg:mt-auto">
          Relatório automático criado em
          <a href="#" class="text-danger-600 underline">Detecta Alerta</a>, utilizando dados do
          <a href="#" class="text-danger-600 underline">Sinapse</a>.
        </p>
      </div>

      <!-- Direita: lista numerada de fontes -->
      <div class="lg:flex-1">
        <ol
          class="list-decimal space-y-3 pl-6 text-sm leading-normal text-secondary-600 sm:text-base"
        >
          <li v-for="(source, i) in sources" :key="i">
            <a href="#" class="text-danger-600 underline">{{ source.name }}</a
            >, {{ source.portal }}, {{ source.year }}.
          </li>
        </ol>
      </div>
    </div>

    <!-- Separador -->
    <div class="h-px w-full max-w-332 bg-secondary-200" />

    <!-- Rumores em alta -->
    <div class="flex w-full max-w-332 flex-col gap-6">
      <h3 class="text-xl font-semibold leading-[1.4] text-secondary-600 sm:text-[28px]">
        Rumores em alta!
      </h3>

      <!-- Grid de cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <RumoresCardSmall
          v-for="rumor in rumors"
          :key="rumor.title"
          :title="rumor.title"
          :description="rumor.description"
          :highlight-label="rumor.highlight"
          :highlight-count="rumor.highlightExtra"
          :disease-tag="rumor.tag"
          :time-ago="rumor.time"
          class="shadow-md"
        />
      </div>
    </div>
  </section>
</template>
