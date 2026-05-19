<template>
  <div class="flex items-center justify-center">
    <div class="bg-white text-gray-900 p-8 rounded-lg shadow-md w-2/6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-lg font-bold">회원 수정</h1>

        <button
          type="button"
          class="text-sm px-3 py-2 rounded-md border hover:bg-gray-50"
          @click="goBack"
        >
          목록으로
        </button>
      </div>

      <p class="font-bold text-right text-sm text-error">
        * 는 필수입력사항입니다.
      </p>

      <form @submit.prevent="updateUser" class="space-y-4 mt-4">
        <!-- ✅ 아이디(수정불가) -->
        <div>
          <label class="block text-sm font-medium text-gray-700">*&nbsp;아이디(수정불가)</label>
          <input
            v-model="form.username"
            readonly
            class="mt-1 block w-full py-2 px-3 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-600
                   focus:outline-none sm:text-sm"
          />
        </div>

        <!-- ✅ 비밀번호(선택) -->
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

        <!-- ✅ 비밀번호 확인(비번 입력 시에만 검사) -->
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

        <!-- ✅ 이메일 -->
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

        <!-- ✅ 이름 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">*&nbsp;이름</label>
          <input
            v-model="form.name"
            required
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <!-- ✅ 전화번호 -->
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

        <!-- ✅ 회사 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">회사</label>
          <input
            v-model="form.company_name"
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <!-- 비고 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">비고</label>
          <input
            v-model="form.affiliation"
            class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <!-- ✅ 권한/활성 (DB에 role, is_active가 있어서 넣어둠) -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">권한</label>
            <select
              v-model="form.role"
              class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" v-model="form.is_active" />
              활성
            </label>
          </div>
        </div>

        <!-- ✅ 저장 버튼 -->
        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium
                 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2
                 focus:ring-offset-2 focus:ring-indigo-500"
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
const route = useRoute()

const loading = ref(false)

// query로 id 받기: /users/update?id=5
const memberId = ref(route.query.id ? String(route.query.id) : "")

const form = ref({
  username: "",
  password: "",

  email: "",
  name: "",
  phone: "",
  company_name: "",
  affiliation: "",

  role: "USER",
  is_active: true,
})

/** 비밀번호 검증용 */
const passwordError = ref("")
const checkPasswordVal = ref("")
const checkPasswordError = ref("")

/** 전화번호 자동 하이픈 */
const autoHyphenPhone = (e) => {
  e.value = e.value
    .replace(/[^0-9]/g, "")
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
    .replace(/(\-{1,2})$/g, "")
}

/** 비밀번호 규칙: 입력한 경우에만 검사 */
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

/** 비밀번호 확인: 비번 입력한 경우에만 검사 */
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
  await router.push("/w9/members")
}

/** ✅ 상세 불러오기 */
const loadMember = async () => {
  if (!memberId.value) {
    alert("잘못된 접근입니다. (id 없음)")
    await goBack()
    return
  }

  try {
    loading.value = true
    const data = await $fetch(`/api/task/members/${memberId.value}`, { method: "GET" })

    // 백엔드 응답 키가 다를 수 있어 안전하게 매핑
    form.value.username = data?.username ?? data?.user_id ?? ""
    form.value.email = data?.email ?? ""
    form.value.name = data?.name ?? ""
    form.value.phone = data?.phone ?? ""
    form.value.company_name = data?.company_name ?? ""
    form.value.affiliation = data?.affiliation ?? ""
    form.value.role = (data?.role ?? "USER").toUpperCase()
    form.value.is_active = data?.is_active ?? true

    // 비번은 항상 빈 값
    form.value.password = ""
    checkPasswordVal.value = ""
  } catch (e) {
    console.error(e)
    alert("회원 정보를 불러오지 못했습니다.")
    await goBack()
  } finally {
    loading.value = false
  }
}

onMounted(loadMember)

/** ✅ 저장(PATCH) */
const updateUser = async () => {
  try {
    // 필수값
    if (!form.value.email?.trim()) return alert("이메일을 입력해줘")
    if (!form.value.name?.trim()) return alert("이름을 입력해줘")

    // 비번 검증(입력했을 때만)
    if (form.value.password) {
      if (passwordError.value) return alert(passwordError.value)
      if (checkPasswordError.value) return alert(checkPasswordError.value)
    }

    loading.value = true

    const payload = {
      // username은 서버에서 막음(라우트에서도 delete 처리됨)
      password: form.value.password ? form.value.password : "",

      email: form.value.email.trim(),
      name: form.value.name.trim(),
      phone: form.value.phone ? form.value.phone.trim() : null,
      company_name: form.value.company_name ? form.value.company_name.trim() : null,
      affiliation: form.value.affiliation ? form.value.affiliation.trim() : null,

      role: form.value.role,
      is_active: !!form.value.is_active,
    }

    await $fetch(`/api/task/members/${memberId.value}`, {
      method: "PATCH",
      body: payload,
    })

    alert("저장 완료!")
    await goBack()
  } catch (error) {
    console.error(error)
    const msg = error?.data?.detail || error?.message || "저장에 실패했습니다."
    alert(msg)
  } finally {
    loading.value = false
  }
}
</script>
