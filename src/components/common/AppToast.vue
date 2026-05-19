<template>
  <transition name="toast-fade">
    <div
      v-if="visible"
      class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg text-white font-medium"
      :class="toastClass"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useToast } from "@/composables/useToast"

const { message, type, visible } = useToast()

const toastClass = computed(() => {
  if (type.value === "success") return "bg-green-500"
  if (type.value === "error") return "bg-red-500"
  return "bg-gray-800"
})
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>