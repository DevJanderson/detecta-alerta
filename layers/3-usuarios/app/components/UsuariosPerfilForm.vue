<script setup lang="ts">
import { vMaska } from 'maska/vue'
import { toast } from 'vue-sonner'

const emit = defineEmits<{
  success: []
}>()

const store = useUsuariosStore()

const nome = ref('')
const telefone = ref('')
const estado = ref('')
const cidade = ref('')
const funcao = ref('')
const instituicao = ref('')

// ESTADOS_BR auto-importado de layers/0-base/app/utils/constants

const showConfirm = ref(false)
const canSubmit = computed(() => nome.value.trim() && !store.isLoading)

function populateFromPerfil() {
  if (!store.perfil) return
  nome.value = store.perfil.nome ?? ''
  telefone.value = store.perfil.telefone ?? ''
  estado.value = store.perfil.estado ?? ''
  cidade.value = store.perfil.cidade ?? ''
  funcao.value = store.perfil.funcao ?? ''
  instituicao.value = store.perfil.instituicao ?? ''
}

async function handleSubmit() {
  if (!canSubmit.value || !store.perfil) return
  showConfirm.value = false
  store.clearError()

  const ok = await store.updatePerfil({
    nome: nome.value.trim(),
    email: store.perfil.email,
    telefone: telefone.value.trim() || null,
    estado: estado.value || null,
    cidade: cidade.value.trim() || null,
    funcao: funcao.value.trim() || null,
    instituicao: instituicao.value.trim() || null
  })

  if (ok) {
    toast.success('Perfil atualizado com sucesso')
    emit('success')
  } else {
    toast.error(store.error || 'Erro ao atualizar perfil')
  }
}

onMounted(async () => {
  if (!store.perfil) await store.fetchPerfil()
  populateFromPerfil()
})

watch(() => store.perfil, populateFromPerfil)
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <Label for="perfil-nome">Nome</Label>
      <Input
        id="perfil-nome"
        v-model="nome"
        type="text"
        placeholder="Seu nome completo"
        :disabled="store.isLoading"
      />
    </div>

    <div class="space-y-2">
      <Label for="perfil-email">Email</Label>
      <Input
        id="perfil-email"
        type="email"
        :model-value="store.perfil?.email ?? ''"
        disabled
        class="bg-muted"
      />
    </div>

    <div class="space-y-2">
      <Label for="perfil-telefone">Telefone</Label>
      <Input
        id="perfil-telefone"
        v-model="telefone"
        v-maska="'(##) #####-####'"
        type="tel"
        placeholder="(99) 99999-9999"
        :disabled="store.isLoading"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="perfil-estado">Estado</Label>
        <Select v-model="estado" :disabled="store.isLoading">
          <SelectTrigger id="perfil-estado">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="uf in ESTADOS_BR" :key="uf" :value="uf">
              {{ uf }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <Label for="perfil-cidade">Cidade</Label>
        <Input
          id="perfil-cidade"
          v-model="cidade"
          type="text"
          placeholder="Sua cidade"
          :disabled="store.isLoading"
        />
      </div>
    </div>

    <div class="space-y-2">
      <Label for="perfil-funcao">Funcao</Label>
      <Input
        id="perfil-funcao"
        v-model="funcao"
        type="text"
        placeholder="Ex: Epidemiologista"
        :disabled="store.isLoading"
      />
    </div>

    <div class="space-y-2">
      <Label for="perfil-instituicao">Instituicao</Label>
      <Input
        id="perfil-instituicao"
        v-model="instituicao"
        type="text"
        placeholder="Ex: Secretaria de Saude"
        :disabled="store.isLoading"
      />
    </div>

    <AlertDialog :open="showConfirm" @update:open="showConfirm = $event">
      <AlertDialogTrigger as-child>
        <Button
          type="button"
          variant="brand-outline"
          size="brand-md"
          class="w-full"
          :disabled="!canSubmit"
        >
          <Icon v-if="store.isLoading" name="lucide:loader-2" class="size-4 animate-spin" />
          <Icon v-else name="lucide:save" class="size-4" />
          Salvar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar alterações</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja salvar as alterações no seu perfil?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="handleSubmit">Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </form>
</template>
