<script setup lang="ts">
// --- Mock data (será substituído por dados da API) ---
const boletim = {
  label: 'Boletim Semanal • 30 nov. a 06 dez. (SE 49), Região Nordeste'
}

const headline = {
  prefix: 'Aumento no surto de ',
  highlights: [
    { text: 'Dengue (+3%)', href: '#' },
    { text: 'Chikungunya (+12%)', href: '#' },
    { text: 'Influenza A', href: '#' }
  ],
  connectors: ['. Aparecimento\nde ', ' e ', ' no Nordeste do Brasil.']
}

const sources = {
  text: 'UOL, United Health e ',
  linkText: 'mais 3 fontes',
  linkHref: '#'
}

const tabs = [
  { id: 'galeria', label: 'galeria', icon: 'lucide:image' },
  { id: 'feed', label: 'feed', icon: 'lucide:newspaper' },
  { id: 'lista', label: 'lista', icon: 'lucide:layout-list' }
]

const activeTab = defineModel<string>({ default: 'galeria' })
</script>

<template>
  <section class="relative bg-secondary-50 px-4 pb-24 pt-10 sm:px-6 sm:pt-16 lg:px-40 lg:pb-32">
    <!-- Dot pattern background -->
    <div class="bg-dot-grid absolute inset-0 opacity-50" />

    <!-- Conteúdo -->
    <div class="relative flex flex-col gap-10">
      <!-- Header: Boletim info + Botões -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <Icon name="lucide:megaphone" class="size-5 shrink-0 text-primary-950" />
          <p class="text-xs font-semibold text-primary-950 sm:text-sm">
            {{ boletim.label }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Botão receber boletim -->
          <button
            class="flex h-10 items-center gap-2 rounded-full border border-primary-600 px-4 text-sm font-semibold text-secondary-900 transition-colors hover:bg-secondary-50 sm:h-12 sm:px-5 sm:text-base"
          >
            <Icon name="lucide:mail" class="size-4 sm:size-5" />
            <span class="hidden sm:inline">receber boletim</span>
            <span class="sm:hidden">boletim</span>
          </button>

          <!-- Botão compartilhar -->
          <button
            class="flex size-10 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 text-secondary-900 transition-colors hover:bg-secondary-100 sm:size-12"
          >
            <Icon name="lucide:share-2" class="size-4 sm:size-5" />
          </button>
        </div>
      </div>

      <!-- Headline principal -->
      <div class="flex flex-col gap-8">
        <h1
          class="max-w-4xl text-2xl font-semibold leading-relaxed text-secondary-900 sm:text-3xl lg:text-4xl"
        >
          {{ headline.prefix
          }}<template v-for="(item, i) in headline.highlights" :key="item.text">
            <NuxtLink :to="item.href" class="font-bold text-primary-950 hover:underline">{{
              item.text
            }}</NuxtLink
            >{{ headline.connectors[i] }}
          </template>
        </h1>

        <!-- Fontes -->
        <div class="flex items-center gap-2">
          <!-- Avatares sobrepostos -->
          <div class="flex -space-x-1.5">
            <div
              v-for="n in 3"
              :key="n"
              class="size-6 rounded-full border-2 border-white bg-secondary-200"
            />
          </div>

          <p class="text-sm text-secondary-900">
            {{ sources.text
            }}<NuxtLink :to="sources.linkHref" class="underline">{{ sources.linkText }}</NuxtLink
            >.
          </p>
        </div>
      </div>
    </div>

    <!-- Content Switcher (flutuante na borda inferior) -->
    <div
      class="absolute inset-x-4 -bottom-6 flex h-12 items-center gap-1.5 rounded-full border border-secondary-200 bg-white p-1 sm:inset-x-6 sm:-bottom-7 sm:h-14 sm:gap-2 lg:inset-x-40"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex h-full flex-1 items-center justify-center gap-1.5 rounded-full text-sm transition-colors sm:gap-2 sm:text-base"
        :class="
          activeTab === tab.id
            ? 'bg-secondary-900 font-semibold text-white'
            : 'font-normal text-secondary-600 hover:text-secondary-900'
        "
        @click="activeTab = tab.id"
      >
        <Icon :name="tab.icon" class="size-4" />
        {{ tab.label }}
      </button>
    </div>
  </section>
</template>
