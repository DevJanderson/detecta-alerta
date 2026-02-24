<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Check, Clipboard, File, Terminal } from 'lucide-vue-next'

const props = defineProps<{
  code?: string
  language?: string | null
  filename?: string | null
  highlights?: number[]
  meta?: string | null
  class?: string | null
}>()

const { copy, copied } = useClipboard({ copiedDuring: 2000 })

const hasHeader = computed(() => !!(props.filename || props.language))

const languageLabel = computed(() => {
  const labels: Record<string, string> = {
    js: 'JavaScript',
    ts: 'TypeScript',
    vue: 'Vue',
    html: 'HTML',
    css: 'CSS',
    bash: 'Terminal',
    sh: 'Terminal',
    shell: 'Terminal',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    md: 'Markdown',
    sql: 'SQL',
    diff: 'Diff',
    dotenv: '.env',
    env: '.env',
    typescript: 'TypeScript',
    javascript: 'JavaScript',
    markdown: 'Markdown'
  }
  if (props.filename) return props.filename
  if (props.language) return labels[props.language] || props.language
  return null
})

const isTerminal = computed(() => ['bash', 'sh', 'shell'].includes(props.language || ''))
</script>

<template>
  <div class="not-prose group relative my-5 rounded-xl bg-zinc-950 ring-1 ring-inset ring-white/10">
    <!-- Header com filename/language + botão copiar -->
    <div
      v-if="hasHeader"
      class="flex items-center justify-between border-b border-white/10 px-4 py-2.5"
    >
      <div class="flex items-center gap-2 text-sm text-zinc-400">
        <Terminal v-if="isTerminal" class="size-4 shrink-0" />
        <File v-else class="size-4 shrink-0" />
        <span>{{ languageLabel }}</span>
      </div>

      <button
        class="inline-flex size-7 items-center justify-center rounded-md text-zinc-500 transition-opacity hover:bg-white/10 hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
        :class="copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
        :aria-label="copied ? 'Copiado' : 'Copiar código'"
        tabindex="-1"
        @click="copy(props.code || '')"
      >
        <Transition name="fade" mode="out-in">
          <Check v-if="copied" class="size-3.5 text-success-500" />
          <Clipboard v-else class="size-3.5" />
        </Transition>
      </button>
    </div>

    <!-- Botão de copiar (quando não tem header) -->
    <button
      v-if="!hasHeader"
      class="absolute right-3 top-3 z-10 inline-flex size-7 items-center justify-center rounded-md text-zinc-500 transition-opacity hover:bg-white/10 hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
      :class="copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      :aria-label="copied ? 'Copiado' : 'Copiar código'"
      tabindex="-1"
      @click="copy(props.code || '')"
    >
      <Transition name="fade" mode="out-in">
        <Check v-if="copied" class="size-3.5 text-success-500" />
        <Clipboard v-else class="size-3.5" />
      </Transition>
    </button>

    <!-- Bloco de código -->
    <pre
      :class="[
        props.class,
        'overflow-x-auto !border-0 !bg-transparent px-4 py-4 font-mono text-sm/6 text-zinc-200'
      ]"
    ><slot /></pre>
  </div>
</template>

<style>
/* Linhas de código como blocos */
pre code .line {
  display: block;
}

/* Destaque de linhas (highlight) */
.shiki span.line.highlight {
  margin: 0 -16px;
  padding: 0 16px;
  background-color: rgba(255, 255, 255, 0.07);
}

/* Transição do ícone de copiar */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
