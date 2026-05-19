<script setup lang="ts">
import AppToast from '@/components/common/AppToast.vue'
</script>

<template>
  <div class="h-svh relative">
    <slot />
    <AppToast />
  </div>
</template>