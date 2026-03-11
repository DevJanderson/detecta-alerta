<script setup lang="ts">
defineProps<{
  region: string
}>()

// --- Mock data (será substituído por dados da API) ---
const cards = [
  {
    title: 'Nova vacina contra gripe aviária',
    description: 'Pesquisadores anunciam avanços promissores em vacina experimental para H5N1.',
    diseaseTag: 'GRIPE AVIÁRIA',
    timeAgo: 'Há 3 horas'
  },
  {
    title: 'Pico de gripe aviária provoca alerta entre criadores de aves',
    description: 'Criadores de aves são aconselhados a redobrar os cuidados de biossegurança.',
    diseaseTag: 'GRIPE AVIÁRIA',
    timeAgo: 'Há 2 horas'
  },
  {
    title: 'Estudo revela mutação do vírus H5N1 em aves migratórias',
    description: 'Cientistas descobrem nova variante que pode afetar a saúde pública.',
    diseaseTag: 'GRIPE AVIÁRIA',
    timeAgo: 'Há 1 hora'
  }
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Título da sub-região (simples, sem ícone decorativo) -->
    <h3 class="text-base font-semibold text-base-950">
      {{ region }}
    </h3>

    <!-- Cards small -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <RumoresCardSmall v-for="card in cards" :key="card.title" v-bind="card" />
    </div>
  </div>
</template>
