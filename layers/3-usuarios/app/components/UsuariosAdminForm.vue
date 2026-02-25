<script setup lang="ts">
import { vMaska } from 'maska/vue'

interface Props {
  usuario: {
    id?: number
    nome: string
    email: string
    telefone?: string | null
    estado?: string | null
    cidade?: string | null
    funcao?: string | null
    instituicao?: string | null
    ativo?: boolean
  } | null
  mode: 'create' | 'edit'
}

const props = defineProps<Props>()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  save: [
    data: {
      nome: string
      email: string
      telefone?: string | null
      estado?: string | null
      cidade?: string | null
      funcao?: string | null
      instituicao?: string | null
      ativo: boolean
      senha?: string
    }
  ]
}>()

// ESTADOS_BR auto-importado de layers/0-base/app/utils/constants

const nome = ref('')
const email = ref('')
const telefone = ref('')
const estado = ref('')
const cidade = ref('')
const funcao = ref('')
const instituicao = ref('')
const senha = ref('')
const ativo = ref(true)

const store = useUsuariosStore()

const isEdit = computed(() => props.mode === 'edit')
const title = computed(() => (isEdit.value ? 'Editar Usuario' : 'Novo Usuario'))

const canSubmit = computed(() => {
  if (!nome.value.trim() || !email.value.trim()) return false
  if (!isEdit.value && !senha.value) return false
  return !store.isLoading
})

function resetForm() {
  nome.value = ''
  email.value = ''
  telefone.value = ''
  estado.value = ''
  cidade.value = ''
  funcao.value = ''
  instituicao.value = ''
  senha.value = ''
  ativo.value = true
}

function populateFromUsuario(u: Props['usuario']) {
  if (!u) {
    resetForm()
    return
  }
  nome.value = u.nome ?? ''
  email.value = u.email ?? ''
  telefone.value = u.telefone ?? ''
  estado.value = u.estado ?? ''
  cidade.value = u.cidade ?? ''
  funcao.value = u.funcao ?? ''
  instituicao.value = u.instituicao ?? ''
  ativo.value = u.ativo !== false
  senha.value = ''
}

watch(
  () => props.usuario,
  u => {
    if (open.value && isEdit.value) populateFromUsuario(u)
  }
)

watch(open, val => {
  if (val) {
    if (isEdit.value) populateFromUsuario(props.usuario)
    else resetForm()
  }
})

function handleSave() {
  if (!canSubmit.value) return

  const data: {
    nome: string
    email: string
    telefone?: string | null
    estado?: string | null
    cidade?: string | null
    funcao?: string | null
    instituicao?: string | null
    ativo: boolean
    senha?: string
  } = {
    nome: nome.value.trim(),
    email: email.value.trim(),
    telefone: telefone.value.trim() || null,
    estado: estado.value || null,
    cidade: cidade.value.trim() || null,
    funcao: funcao.value.trim() || null,
    instituicao: instituicao.value.trim() || null,
    ativo: ativo.value
  }

  if (senha.value) data.senha = senha.value

  emit('save', data)
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          {{ isEdit ? 'Atualize os dados do usuario.' : 'Preencha os dados do novo usuario.' }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSave">
        <div class="space-y-2">
          <Label for="admin-nome">Nome</Label>
          <Input id="admin-nome" v-model="nome" type="text" placeholder="Nome completo" />
        </div>

        <div class="space-y-2">
          <Label for="admin-email">Email</Label>
          <Input id="admin-email" v-model="email" type="email" placeholder="email@exemplo.com" />
        </div>

        <div class="space-y-2">
          <Label for="admin-telefone">Telefone</Label>
          <Input
            id="admin-telefone"
            v-model="telefone"
            v-maska="'(##) #####-####'"
            type="tel"
            placeholder="(99) 99999-9999"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="admin-estado">Estado</Label>
            <Select v-model="estado">
              <SelectTrigger id="admin-estado">
                <SelectValue placeholder="UF" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="uf in ESTADOS_BR" :key="uf" :value="uf">
                  {{ uf }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="admin-cidade">Cidade</Label>
            <Input id="admin-cidade" v-model="cidade" type="text" placeholder="Cidade" />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="admin-funcao">Funcao</Label>
          <Input id="admin-funcao" v-model="funcao" type="text" placeholder="Ex: Epidemiologista" />
        </div>

        <div class="space-y-2">
          <Label for="admin-instituicao">Instituicao</Label>
          <Input
            id="admin-instituicao"
            v-model="instituicao"
            type="text"
            placeholder="Ex: Secretaria de Saude"
          />
        </div>

        <div class="space-y-2">
          <Label for="admin-senha">
            Senha
            <span v-if="isEdit" class="text-muted-foreground">(deixe vazio para manter)</span>
          </Label>
          <Input
            id="admin-senha"
            v-model="senha"
            type="password"
            placeholder="Minimo 8 caracteres"
            autocomplete="new-password"
          />
        </div>

        <div class="flex items-center gap-2">
          <Switch
            id="admin-ativo"
            :checked="ativo"
            @update:checked="(val: boolean) => (ativo = val)"
          />
          <Label for="admin-ativo">Usuario ativo</Label>
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" variant="brand-outline" :disabled="!canSubmit">
            <Icon v-if="store.isLoading" name="lucide:loader-2" class="size-4 animate-spin" />
            {{ isEdit ? 'Atualizar' : 'Criar' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
