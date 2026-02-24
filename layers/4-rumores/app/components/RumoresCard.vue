<script setup lang="ts">
import type { Noticia } from '../composables/types'

const TRUNCATE_LENGTH = 150
const MS_PER_HOUR = 1000 * 60 * 60
const HOURS_PER_DAY = 24
const DAYS_PER_WEEK = 7

const props = defineProps<{
  noticia: Noticia
}>()

const descricaoTruncada = computed(() => {
  const texto = props.noticia.descricao || props.noticia.conteudo
  if (texto.length <= TRUNCATE_LENGTH) return texto
  return texto.slice(0, TRUNCATE_LENGTH).trimEnd() + '...'
})

const dataRelativa = computed(() => {
  const data = props.noticia.data_publicacao || props.noticia.data_coleta
  if (!data) return null

  const agora = new Date()
  const publicacao = new Date(data)
  const diffMs = agora.getTime() - publicacao.getTime()
  const diffHoras = Math.floor(diffMs / MS_PER_HOUR)
  const diffDias = Math.floor(diffHoras / HOURS_PER_DAY)

  if (diffHoras < 1) return 'agora'
  if (diffHoras < HOURS_PER_DAY) return `há ${diffHoras}h`
  if (diffDias < DAYS_PER_WEEK) return `há ${diffDias}d`
  return publicacao.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
})
</script>

<template>
  <NuxtLink :to="`/rumores/${noticia.unique_id}`">
    <Card class="cursor-pointer transition-colors hover:bg-muted/50">
      <div class="flex gap-4 p-4">
        <!-- Imagem -->
        <div v-if="noticia.url_imagem" class="hidden shrink-0 sm:block">
          <img
            :src="noticia.url_imagem"
            :alt="noticia.titulo"
            class="h-24 w-36 rounded-md object-cover"
            loading="lazy"
          />
        </div>

        <!-- Conteudo -->
        <div class="min-w-0 flex-1">
          <h3 class="line-clamp-2 text-sm font-semibold leading-snug">
            {{ noticia.titulo }}
          </h3>

          <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {{ descricaoTruncada }}
          </p>

          <div class="mt-2">
            <RumoresBadges
              :doencas="noticia.doencas"
              :doenca-principal="noticia.doenca_principal"
              :localizacoes="noticia.localizacoes"
            />
          </div>

          <!-- Fonte e data -->
          <div class="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <img
              v-if="noticia.icone_fonte && noticia.icone_fonte.length > 0"
              :src="noticia.icone_fonte[0]"
              :alt="noticia.fonte || ''"
              class="h-4 w-4 rounded-sm"
              loading="lazy"
            />
            <span v-if="noticia.fonte">{{ noticia.fonte }}</span>
            <span v-if="noticia.fonte && dataRelativa">·</span>
            <span v-if="dataRelativa">{{ dataRelativa }}</span>
          </div>
        </div>
      </div>
    </Card>
  </NuxtLink>
</template>
