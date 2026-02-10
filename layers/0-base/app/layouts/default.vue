<script setup lang="ts"></script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <CommonAppHeader />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
