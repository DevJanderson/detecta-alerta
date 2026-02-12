<script setup lang="ts">
import { toast } from 'vue-sonner'

const store = useUsuariosStore()
const authStore = useAuthStore()

const fileInput = ref<HTMLInputElement | null>(null)
const preview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const MAX_SIZE = 2 * 1024 * 1024 // 2MB

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > MAX_SIZE) {
    toast.error('A imagem deve ter no maximo 2MB')
    input.value = ''
    return
  }

  selectedFile.value = file
  preview.value = URL.createObjectURL(file)
}

async function handleUpload() {
  if (!selectedFile.value) return

  const ok = await store.uploadFoto(selectedFile.value)
  if (ok) {
    toast.success('Foto atualizada com sucesso')
    selectedFile.value = null
    if (preview.value) {
      URL.revokeObjectURL(preview.value)
      preview.value = null
    }
  } else {
    toast.error(store.error || 'Erro ao enviar foto')
  }
}

onUnmounted(() => {
  if (preview.value) URL.revokeObjectURL(preview.value)
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Avatar class="size-24">
      <AvatarImage v-if="preview" :src="preview" alt="Preview" />
      <AvatarFallback class="text-2xl">{{ authStore.userInitials }}</AvatarFallback>
    </Avatar>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />

    <div class="flex gap-2">
      <Button variant="outline" size="sm" @click="triggerFileInput">
        <Icon name="lucide:camera" class="size-4" />
        Escolher foto
      </Button>

      <Button
        v-if="selectedFile"
        variant="brand-outline"
        size="sm"
        :disabled="store.isLoading"
        @click="handleUpload"
      >
        <Icon v-if="store.isLoading" name="lucide:loader-2" class="size-4 animate-spin" />
        <Icon v-else name="lucide:upload" class="size-4" />
        Enviar
      </Button>
    </div>
  </div>
</template>
