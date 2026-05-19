import { ref } from "vue"

type ToastType = "success" | "error" | "info"

const message = ref("")
const type = ref<ToastType>("info")
const visible = ref(false)

export const useToast = () => {
  const show = (msg: string, toastType: ToastType = "info", duration = 3000) => {
    message.value = msg
    type.value = toastType
    visible.value = true

    setTimeout(() => {
      visible.value = false
    }, duration)
  }

  return {
    message,
    type,
    visible,
    show,
  }
}