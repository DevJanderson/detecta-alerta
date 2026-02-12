<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Meu Perfil - Detecta Alerta',
  description: 'Gerencie seus dados pessoais e foto de perfil',
  noindex: true
})

const usuariosStore = useUsuariosStore()

onMounted(async () => {
  await usuariosStore.fetchPerfil()
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <h1 class="mb-6 text-2xl font-bold text-foreground">Meu Perfil</h1>

    <Tabs default-value="dados" class="w-full">
      <TabsList class="mb-6">
        <TabsTrigger value="dados">
          <Icon name="lucide:user" class="mr-2 size-4" />
          Dados Pessoais
        </TabsTrigger>
        <TabsTrigger value="foto">
          <Icon name="lucide:camera" class="mr-2 size-4" />
          Foto
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dados">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription> Atualize suas informacoes pessoais </CardDescription>
          </CardHeader>
          <CardContent>
            <UsuariosPerfilForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="foto">
        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription> Envie ou atualize sua foto de perfil </CardDescription>
          </CardHeader>
          <CardContent>
            <UsuariosPerfilFoto />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
