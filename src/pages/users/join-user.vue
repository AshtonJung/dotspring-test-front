<template>
  <div class="flex items-center justify-center">
    <div class="bg-white text-gray-900 p-8 rounded-lg shadow-md w-2/6">
      <form @submit.prevent="joinUser" class="space-y-4">
        <div>
          <p class="font-bold text-right text-sm text-error">* 는 필수입력사항입니다.</p>

          <!-- 아이디 + 중복체크 버튼 -->
          <div class="mt-4">
            <label for="user_id" class="block text-sm font-medium text-gray-700">*&nbsp;아이디</label>

            <div class="flex gap-2 mt-1">
              <input
                id="user_id"
                v-model="form.user_id"
                required
                class="flex-1 py-2 px-3 border rounded-md shadow-sm
                       focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="
                  idStatus === 'ok'
                    ? 'border-green-400'
                    : idStatus === 'bad'
                    ? 'border-red-400'
                    : 'border-gray-300'
                "
              />

              <button
                type="button"
                @click="validateId"
                :disabled="idStatus === 'checking' || !form.user_id"
                class="px-4 py-2 text-sm rounded-md border transition"
                :class="
                  idStatus === 'ok'
                    ? 'bg-green-500 text-white border-green-500 cursor-default'
                    : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                "
              >
                {{ idStatus === "ok" ? "확인완료" : idStatus === "checking" ? "확인중" : "중복체크" }}
              </button>
            </div>

            <p
              class="mt-1 text-sm min-h-[20px]"
              :class="
                idStatus === 'ok'
                  ? 'text-green-600'
                  : idStatus === 'bad'
                  ? 'text-red-500'
                  : 'text-gray-400'
              "
            >
              {{ idValidate }}
            </p>
          </div>
        </div>

        <!-- 비밀번호 -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">*&nbsp;비밀번호</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            required
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p class="text-red-500 text-xs mt-1 min-h-[16px]">{{ passwordError }}</p>
        </div>

        <!-- 비밀번호 확인 -->
        <div>
          <label for="checkPassword" class="block text-sm font-medium text-gray-700">*&nbsp;비밀번호 확인</label>
          <input
            id="checkPassword"
            type="password"
            v-model="checkPasswordVal"
            required
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p class="text-red-500 text-xs mt-1 min-h-[16px]">{{ checkPasswordError }}</p>
        </div>

        <!-- 이메일 -->
        <div>
          <label for="user_email" class="block text-sm font-medium text-gray-700">*&nbsp;이메일</label>
          <input
            id="user_email"
            type="email"
            v-model="form.user_email"
            required
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <!-- 이름 -->
        <div>
          <label for="user_name" class="block text-sm font-medium text-gray-700">*&nbsp;이름</label>
          <input
            id="user_name"
            v-model="form.user_name"
            required
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <!-- 전화번호 -->
        <div>
          <label for="user_phone" class="block text-sm font-medium text-gray-700">전화번호</label>
          <input
            id="user_phone"
            v-model="form.user_phone"
            @input="autoHyphenPhone($event.target)"
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            maxlength="13"
          />
        </div>

        <!-- 회사 -->
        <div>
          <label for="company_name" class="block text-sm font-medium text-gray-700">회사</label>
          <input
            id="company_name"
            v-model="form.company_name"
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <!-- 권한 / 활성 -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">권한</label>
          <div class="mt-1 flex items-center gap-4">
            <select
              id="role"
              v-model="form.role"
              class="flex-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <label class="inline-flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              활성
            </label>
          </div>
        </div>

        <!-- 에러 표시 -->
        <p class="text-red-500 text-sm min-h-[20px]">
          {{ submitError }}
        </p>

        <!-- 가입 버튼 -->
        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium
                 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2
                 focus:ring-offset-2 focus:ring-indigo-500"
        >
          회원가입
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

definePageMeta({
  layout: "login",
})

const router = useRouter()

const form = ref({
  user_id: "",
  password: "",
  user_email: "",
  user_name: "",
  user_phone: "",
  company_name: "",
  role: "USER",
  is_active: true,
})

/** 상태/메시지 */
const passwordError = ref("")
const checkPasswordVal = ref("")
const checkPasswordError = ref("")
const idValidate = ref("")
const submitError = ref("")

/** 버튼/입력 상태 */
const idStatus = ref("idle") // idle | checking | ok | bad

/** 아이디 변경 시 다시 체크 필요 */
watch(
  () => form.value.user_id,
  () => {
    idStatus.value = "idle"
    idValidate.value = ""
  }
)

/** 비밀번호 규칙 검사 */
watch(
  () => form.value.password,
  () => {
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

/** 비밀번호 확인 일치 체크 */
watch(
  () => checkPasswordVal.value,
  () => {
    if (form.value.password !== checkPasswordVal.value) {
      checkPasswordError.value = "비밀번호가 일치하지 않습니다."
    } else {
      checkPasswordError.value = ""
    }
  }
)

/** 전화번호 자동 하이픈 */
const autoHyphenPhone = (e) => {
  e.value = e.value
    .replace(/[^0-9]/g, "")
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
    .replace(/(\-{1,2})$/g, "")
}

/** 아이디 중복확인 */
const validateId = async () => {
  try {
    const username = (form.value.user_id || "").trim()

    if (!username) {
      idStatus.value = "bad"
      idValidate.value = "아이디를 입력해주세요."
      return
    }

    idStatus.value = "checking"
    idValidate.value = "확인 중..."

    const res = await $fetch("/api/task/check-username", {
      method: "POST",
      body: { username },
    })

    const msg = res?.message || ""
    idValidate.value = msg
    idStatus.value = msg.includes("가능") ? "ok" : "bad"
  } catch (e) {
    console.error(e)
    idStatus.value = "bad"
    idValidate.value = "아이디 확인 중 오류가 발생했습니다."
  }
}

/** 회원가입 */
const joinUser = async () => {
  submitError.value = ""

  try {
    if (idStatus.value !== "ok") {
      alert("아이디 중복체크를 완료해주세요.")
      return
    }

    if (passwordError.value) {
      alert(passwordError.value)
      return
    }

    if (checkPasswordError.value) {
      alert(checkPasswordError.value)
      return
    }

    const payload = {
      username: (form.value.user_id || "").trim(),
      password: form.value.password,
      email: (form.value.user_email || "").trim(),
      name: (form.value.user_name || "").trim(),
      phone: form.value.user_phone ? form.value.user_phone.trim() : null,
      company_name: form.value.company_name ? form.value.company_name.trim() : null,
      role: form.value.role,
      is_active: form.value.is_active ? 1 : 0,
    }

    await $fetch("/api/task/register", {
      method: "POST",
      body: payload,
    })

    alert("회원가입 완료!")
    await router.push("/w9/members")
  } catch (error) {
    console.error(error)
    const msg = error?.data?.detail || error?.message || "회원가입에 실패했습니다."
    submitError.value = msg
    alert(msg)
  }
}
</script>