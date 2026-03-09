<script setup lang="ts">
const currentYear = new Date().getFullYear()

const exploreLinks = [
  { label: 'Início', to: '/' },
  { label: 'Meu Município', to: '/meu-municipio' },
  { label: 'Rumores', to: '/rumores' },
  { label: 'Lugares Monitorados', to: '#' },
  { label: 'Relatórios', to: '#' }
]

const sinapseLinks = [
  { label: 'Arboviroses', to: '#' },
  { label: 'Clima', to: '#' },
  { label: 'CNES', to: '#' },
  { label: 'I.A.', to: '#' },
  { label: 'Outros', to: '#' }
]

const suporteLinks = [
  { label: 'Documentação', to: '/docs' },
  { label: 'Notas metodológicas', to: '#' }
]

const socialLinks = [
  { label: 'Instagram', icon: 'lucide:instagram', url: 'https://instagram.com/itps_saude' },
  { label: 'LinkedIn', icon: 'lucide:linkedin', url: 'https://linkedin.com/company/itps' },
  { label: 'YouTube', icon: 'lucide:youtube', url: 'https://youtube.com/@itps' }
]
</script>

<template>
  <footer class="bg-secondary-950 text-white">
    <!-- Parte principal -->
    <div class="px-4 py-12 sm:px-6 lg:px-20">
      <div class="flex flex-col gap-10 lg:flex-row lg:justify-between">
        <!-- Coluna esquerda: Logos + descrição + redes sociais -->
        <div class="max-w-md">
          <div class="flex items-center gap-3">
            <NuxtImg src="/brand/detecta-light.svg" alt="Detecta Alerta" class="h-8" />
            <div class="h-6 w-px bg-white/20" />
            <NuxtImg src="/brand/itps-light.svg" alt="ITpS" class="h-8" />
          </div>

          <p class="mt-4 text-sm leading-relaxed text-white">
            Plataforma de monitoramento de movimento que acompanha a lotação de unidades de saúde em
            tempo oportuno.
          </p>

          <div class="mt-6 flex items-center gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.label"
              class="flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/40 hover:text-white"
            >
              <Icon :name="social.icon" class="size-4.5" />
            </a>
          </div>
        </div>

        <!-- Colunas de links -->
        <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-16">
          <!-- Explore -->
          <div>
            <h3 class="text-sm font-semibold text-primary-600">Explore</h3>
            <nav class="mt-3 flex flex-col gap-2">
              <NuxtLink
                v-for="link in exploreLinks"
                :key="link.to"
                :to="link.to"
                class="text-sm text-white transition-colors hover:text-white"
              >
                {{ link.label }}
              </NuxtLink>
            </nav>
          </div>

          <!-- Sinapse -->
          <div>
            <h3 class="text-sm font-semibold text-primary-600">Sinapse</h3>
            <nav class="mt-3 flex flex-col gap-2">
              <a
                v-for="link in sinapseLinks"
                :key="link.label"
                :href="link.to"
                class="text-sm text-white transition-colors hover:text-white"
              >
                {{ link.label }}
              </a>
            </nav>
          </div>

          <!-- Suporte -->
          <div>
            <h3 class="text-sm font-semibold text-primary-600">Suporte</h3>
            <nav class="mt-3 flex flex-col gap-2">
              <NuxtLink
                v-for="link in suporteLinks"
                :key="link.label"
                :to="link.to"
                class="text-sm text-white transition-colors hover:text-white"
              >
                {{ link.label }}
              </NuxtLink>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra inferior -->
    <div class="border-t border-white/10 bg-secondary-950/80 px-4 py-4 sm:px-6 lg:px-20">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-xs text-white">
          <p>
            &copy;{{ currentYear }} Todos os Direitos Reservados Instituto Todos pela Saúde (ITpS)
          </p>
          <p>Avenida Paulista, 1.938 - 16º andar, CEP: 01310-942 - São Paulo (SP)</p>
        </div>
        <NuxtLink
          to="/termos"
          class="text-xs text-white underline transition-colors hover:text-white"
        >
          Termos de Uso e Aviso de Privacidade
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
