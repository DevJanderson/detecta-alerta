<script setup lang="ts">
const store = useMeuMunicipioStore()

onMounted(async () => {
  await store.fetchLookups()

  if (store.filtros.municipio) {
    await store.fetchAll()
  }
})
</script>

<template>
  <div class="relative h-[calc(100vh-5.5rem)] overflow-hidden">
    <!-- Mapa (full-screen background) -->
    <MeuMunicipioMap />

    <!-- Search bar flutuante (top-left, sobre o mapa) -->
    <MeuMunicipioSearchBar />

    <!-- Controles do mapa (left side) -->
    <MeuMunicipioMapControls />

    <!-- Status bar (bottom-left) -->
    <MeuMunicipioMapStatus />

    <!-- Modal de seleção inicial (quando sem município) -->
    <MeuMunicipioSelectionModal v-if="!store.municipioSelecionado" />

    <!-- Painel lateral (quando município selecionado) -->
    <MeuMunicipioPanel v-if="store.municipioSelecionado" />
  </div>
</template>
