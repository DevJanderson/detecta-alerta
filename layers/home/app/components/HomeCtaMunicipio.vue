<template>
  <section
    class="bg-base-50 bg-[radial-gradient(circle,_var(--color-base-200)_0.5px,_transparent_0.5px)] bg-[length:12px_12px]"
  >
    <div
      class="flex flex-col items-start gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-20 lg:py-16"
    >
      <div>
        <h2 class="text-2xl font-bold italic text-secondary-900 lg:text-3xl">
          Quer saber sobre sua cidade?
        </h2>
        <p class="mt-2 text-base-600">Explore os dados na página Meu Município.</p>
      </div>

      <Button as-child variant="brand-outline" size="brand-lg">
        <NuxtLink to="/meu-municipio">
          ir para Meu Município
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </Button>
    </div>
  </section>
</template>
