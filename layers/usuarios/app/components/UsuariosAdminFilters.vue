<script setup lang="ts">
const emit = defineEmits<{
  filter: [params: { search?: string; ativo?: boolean }]
}>()

const search = ref('')
const status = ref('todos')

function emitFilter() {
  const params: { search?: string; ativo?: boolean } = {}
  if (search.value.trim()) params.search = search.value.trim()
  if (status.value === 'ativos') params.ativo = true
  if (status.value === 'inativos') params.ativo = false
  emit('filter', params)
}

watch(search, () => {
  const timer = setTimeout(emitFilter, 300)
  onWatcherCleanup(() => clearTimeout(timer))
})

watch(status, emitFilter)
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div class="relative flex-1">
      <Icon
        name="lucide:search"
        class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input v-model="search" type="text" placeholder="Buscar por nome ou email..." class="pl-9" />
    </div>

    <Select v-model="status">
      <SelectTrigger class="w-full sm:w-[160px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos</SelectItem>
        <SelectItem value="ativos">Ativos</SelectItem>
        <SelectItem value="inativos">Inativos</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
