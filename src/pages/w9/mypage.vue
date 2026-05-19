<template>
  <div class="flex items-center justify-center">
    <div class="bg-white text-gray-900 rounded-lg shadow-md w-full max-w-2xl">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-lg font-bold">마이페이지</h1>

        <button
          type="button"
          class="text-sm px-3 py-2 rounded-md border hover:bg-gray-50"
          @click="goBack"
        >
          돌아가기
        </button>
      </div>

      <p class="font-bold text-right text-sm text-error">
        * 는 필수입력사항입니다.
      </p>

      <form @submit.prevent="updateMe" class="space-y-4 mt-4">
        <!-- 아이디(수정불가) -->
        <div>
          <label class="block text-sm font-medium text-gray-700">*&nbsp;아이디(수정불가)</label>
          <input
            v-model="form.username"
            readonly
            class="mt-1 block w-full py-2 px-3 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-600
                   focus:outline-none sm:text-sm"
          />
        </div>

        <!-- 비밀번호(선택) -->
        <div>
          <label class="block text-sm font-medium text-gray-700">비밀번호(변경 시에만 입력)</label>
          <input
            type="password"
            v-model="form.password"
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p class="text-red-500 text-xs mt-1 min-h-[16px]">{{ passwordError }}</p>
        </div>

        <!-- 비밀번호 확인 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input
            type="password"
            v-model="checkPasswordVal"
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p class="text-red-500 text-xs mt-1 min-h-[16px]">{{ checkPasswordError }}</p>
        </div>

        <!-- 이메일 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">*&nbsp;이메일</label>
          <input
            type="email"
            v-model="form.email"
            required
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <!-- 이름 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">*&nbsp;이름</label>
          <input
            v-model="form.name"
            required
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <!-- 전화번호 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">전화번호</label>
          <input
            v-model="form.phone"
            @input="autoHyphenPhone($event.target)"
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            maxlength="13"
          />
        </div>

        <!-- 회사 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">회사</label>
          <input
            v-model="form.company_name"
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">비고</label>
          <input
            v-model="form.affiliation"
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <!-- 저장 버튼 -->
        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium
                 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2
                 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? "저장 중..." : "저장" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

definePageMeta({
  layout: "login",
})

const router = useRouter()
const loading = ref(false)

const form = ref({
  username: "",
  password: "",
  email: "",
  name: "",
  phone: "",
  company_name: "",
  affiliation: "",
})

const passwordError = ref("")
const checkPasswordVal = ref("")
const checkPasswordError = ref("")

const autoHyphenPhone = (e) => {
  e.value = e.value
    .replace(/[^0-9]/g, "")
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
    .replace(/(\-{1,2})$/g, "")
}

watch(
  () => form.value.password,
  () => {
    if (!form.value.password) {
      passwordError.value = ""
      checkPasswordError.value = ""
      return
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/

    if (!passwordRegex.test(form.value.password)) {
      passwordError.value =
        "비밀번호는 8~15자, 영문/숫자/특수문자를 각각 1개 이상 포함해야 합니다."
    } else {
      passwordError.value = ""
    }
  }
)

watch(
  () => checkPasswordVal.value,
  () => {
    if (!form.value.password && !checkPasswordVal.value) {
      checkPasswordError.value = ""
      return
    }

    if (form.value.password !== checkPasswordVal.value) {
      checkPasswordError.value = "비밀번호가 일치하지 않습니다."
    } else {
      checkPasswordError.value = ""
    }
  }
)

const goBack = async () => {
  await router.back()
}

const loadMe = async () => {
  try {
    loading.value = true

    const data = await $fetch("/api/task/me", {
      method: "GET",
    })

    form.value.username = data?.username ?? ""
    form.value.email = data?.email ?? ""
    form.value.name = data?.name ?? ""
    form.value.phone = data?.phone ?? ""
    form.value.company_name = data?.company_name ?? ""
    form.value.affiliation = data?.affiliation ?? ""
    form.value.password = ""
    checkPasswordVal.value = ""
  } catch (e) {
    console.error(e)
    alert("내 정보를 불러오지 못했습니다.")
    await goBack()
  } finally {
    loading.value = false
  }
}

onMounted(loadMe)

const updateMe = async () => {
  try {
    if (!form.value.email?.trim()) return alert("이메일을 입력해주세요.")
    if (!form.value.name?.trim()) return alert("이름을 입력해주세요.")

    if (form.value.password) {
      if (passwordError.value) return alert(passwordError.value)
      if (checkPasswordError.value) return alert(checkPasswordError.value)
    }

    loading.value = true

    const payload = {
      password: form.value.password ? form.value.password : "",
      email: form.value.email.trim(),
      name: form.value.name.trim(),
      phone: form.value.phone ? form.value.phone.trim() : null,
      company_name: form.value.company_name ? form.value.company_name.trim() : null,
      affiliation: form.value.affiliation ? form.value.affiliation.trim() : null,
    }

    await $fetch("/api/task/me", {
      method: "PATCH",
      body: payload,
    })

    alert("회원정보가 수정되었습니다. 변경된 정보는 재 로그인 후 갱신됩니다.")
    form.value.password = ""
    checkPasswordVal.value = ""
    await loadMe()
  } catch (error) {
    console.error(error)
    const msg = error?.data?.detail || error?.message || "저장에 실패했습니다."
    alert(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>