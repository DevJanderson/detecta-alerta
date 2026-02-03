<script setup lang="ts">
interface Props {
  redirectTo?: string
}

const props = withDefaults(defineProps<Props>(), {
  redirectTo: '/'
})

const emit = defineEmits<{
  success: []
}>()

const authStore = useAuthStore()
const router = useRouter()

// Form state
const username = ref('')
const password = ref('')
const showPassword = ref(false)

// Computed
const canSubmit = computed(() => username.value.trim() && password.value && !authStore.isLoading)

// Methods
async function handleSubmit() {
  if (!canSubmit.value) return

  const success = await authStore.login({
    username: username.value.trim(),
    password: password.value
  })

  if (success) {
    emit('success')
    router.push(props.redirectTo)
  }
}

function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- Erro -->
    <Alert v-if="authStore.error" variant="destructive">
      <AlertDescription>{{ authStore.error }}</AlertDescription>
    </Alert>

    <!-- Email/Username -->
    <div class="space-y-2">
      <Label for="username">Email ou usuário</Label>
      <Input
        id="username"
        v-model="username"
        type="text"
        placeholder="seu@email.com"
        autocomplete="username"
        :disabled="authStore.isLoading"
      />
    </div>

    <!-- Senha -->
    <div class="space-y-2">
      <Label for="password">Senha</Label>
      <div class="relative">
        <Input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Sua senha"
          autocomplete="current-password"
          class="pr-10"
          :disabled="authStore.isLoading"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          @click="togglePassword"
        >
          <Icon v-if="!showPassword" name="lucide:eye" class="size-4" />
          <Icon v-else name="lucide:eye-off" class="size-4" />
        </button>
      </div>
    </div>

    <!-- Link esqueci senha -->
    <div class="text-right">
      <NuxtLink to="/auth/reset-password" class="text-sm text-brand-secondary-600 hover:underline">
        Esqueci minha senha
      </NuxtLink>
    </div>

    <!-- Botão submit -->
    <Button type="submit" variant="brand" size="brand-sm" class="w-full" :disabled="!canSubmit">
      <Icon v-if="authStore.isLoading" name="lucide:loader-2" class="size-4 animate-spin" />
      <Icon v-else name="lucide:log-in" class="size-4" />
      Entrar
    </Button>
  </form>
</template>
