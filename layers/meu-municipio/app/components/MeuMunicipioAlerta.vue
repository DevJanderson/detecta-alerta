<template>
  <section class="inline-flex gap-3 rounded-xl border border-alert-200 bg-alert-100 p-4">
    <div class="flex flex-1 flex-col gap-2">
      <div class="flex flex-col gap-1">
        <p class="text-sm font-semibold leading-snug text-alert-950">
          Alerta de dengue: casos sobem 40% na última semana
        </p>
        <p class="line-clamp-2 text-xs leading-[18px] text-base-950">
          Autoridades recomendam reforçar medidas de prevenção e eliminar focos de água parada.
        </p>
      </div>
      <button
        class="inline-flex items-center gap-1 px-0.5 py-px text-xs font-semibold text-secondary-700 hover:text-secondary-900"
      >
        ver todos os rumores
        <Icon name="lucide:arrow-right" class="size-4 text-primary-500" />
      </button>
    </div>
  </section>
</template>
