<!-- src/pages/w9/members.vue -->
<template>
  <section class="min-h-screen bg-slate-50">
    <div class="mx-auto w-full max-w-6xl px-4 py-10">
      <!-- 헤더 -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200"
          >
            <span class="h-2 w-2 rounded-full bg-indigo-500"></span>
            Admin · 회원관리
          </div>
          <h1 class="mt-3 text-2xl font-bold tracking-tight text-slate-900">회원 관리</h1>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div class="relative w-full sm:w-[320px]">
            <input v-model.trim="q" class="input pr-10" placeholder="검색: 이메일/아이디/이름/회사/전화" />
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          </div>

          <button type="button" class="btn-secondary" @click="reloadList" :disabled="loadingList">
            <span v-if="loadingList" class="inline-flex items-center gap-2">
              <span class="spinner"></span> 새로고침
            </span>
            <span v-else>새로고침</span>
          </button>

          <button type="button" class="btn-primary" @click="goCreate">
            회원등록
          </button>
        </div>
      </div>

      <!-- 테이블 -->
      <div class="card overflow-hidden p-0">
        <div class="border-b border-slate-200 bg-white px-5 py-4">
          <div class="flex items-center justify-between gap-3">
            <div class="text-sm font-bold text-slate-900">회원 관리</div>
            <div class="text-xs text-slate-500">{{ filtered.length }}명</div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-[1100px] w-full">
            <thead class="bg-slate-50">
              <tr class="text-left text-xs font-bold text-slate-600">
                <th class="py-3 text-center">회사</th>
                <th class="py-3 text-center">이름</th>
                <th class="py-3 text-center">아이디</th>
                <th class="py-3 text-center">이메일</th>
                <th class="py-3 text-center">전화</th>
                <th class="py-3 text-center">권한</th>
                <th class="py-3 text-center">활성</th>
                <th class="py-3 text-center">등록일</th>
                <th class="py-3 text-center">수정</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-200 bg-white">
              <tr v-for="row in filtered" :key="row.id" class="transition hover:bg-slate-50">
                <td class="py-3 text-center">
                  {{ row.company_name || "-" }}
                </td>
                <td class="py-3 text-center">
                  {{ row.name || "-" }}
                </td>
                <td class="py-3 text-center">
                  {{ row.username || "-" }}
                </td>
                <td class="py-3 text-center">
                  {{ row.email || "-" }}
                </td>
                <td class="py-3 text-center">
                  {{ row.phone || "-" }}
                </td>
                <td class="py-3 text-center">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1"
                    :class="roleBadgeClass(row.role)"
                  >
                    {{ row.role || "-" }}
                  </span>
                </td>
                <td class="py-3 text-center">
                  {{ fmtActive(row.is_active) }}
                </td>
                <td class="py-3 text-center">
                  {{ fmtDateTime(row.created_at) }}
                </td>

                <td class="py-3 text-centert">
                  <button type="button" class="btn-primary" @click.stop="goUpdate(row.id)">
                    수정
                  </button>
                </td>
              </tr>

              <tr v-if="loadingList">
                <td colspan="9" class="px-5 py-10 text-center text-sm text-slate-500">
                  <span class="inline-flex items-center gap-2">
                    <span class="spinner"></span> 목록 불러오는 중...
                  </span>
                </td>
              </tr>

              <tr v-if="!loadingList && filtered.length === 0">
                <td colspan="9" class="px-5 py-10 text-center text-sm text-slate-500">
                  회원이 존재하지 않습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="errorMsg" class="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200">
        {{ errorMsg }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

/** ------------------------
 * Auth helper
 * ------------------------ */
const getToken = () => (process.client ? sessionStorage.getItem("DDSP_AT") || "" : "");

/** ------------------------
 * Router
 * ------------------------ */
const router = useRouter();

/** ------------------------
 * State
 * ------------------------ */
const members = ref([]);
const loadingList = ref(false);
const errorMsg = ref("");

const q = ref("");

/** ------------------------
 * Computed
 * ------------------------ */
const filtered = computed(() => {
  const keyword = q.value.toLowerCase().trim();
  if (!keyword) return members.value;

  return members.value.filter((m) => {
    const hay = [
      m.email,
      m.username,
      m.name,
      m.company_name,
      m.phone,
      m.role,
      m.affiliation,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(keyword);
  });
});

const adminCount = computed(() => members.value.filter((m) => String(m.role || "").toUpperCase() === "ADMIN").length);
const userCount = computed(() => members.value.filter((m) => String(m.role || "").toUpperCase() === "USER").length);

/** ------------------------
 * API
 * ------------------------ */
const reloadList = async () => {
  const token = getToken();
  if (!token) {
    alert("로그인이 필요해.");
    return;
  }

  loadingList.value = true;
  errorMsg.value = "";

  try {
    const res = await $fetch(`/api/task/members`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const items = Array.isArray(res) ? res : res?.items || res?.data || [];
    members.value = items;
  } catch (e) {
    console.error(e);
    errorMsg.value = "회원 관리 조회 실패. (서버 라우터/프록시 경로/권한 확인)";
  } finally {
    loadingList.value = false;
  }
};

/** ------------------------
 * UI actions
 * ------------------------ */
const goUpdate = (id) => {
  router.push(`/users/update?id=${id}`);
};

const goCreate = () => {
  router.push("/users/join-user");
};

/** ------------------------
 * Helpers
 * ------------------------ */
const fmtDateTime = (s) => {
  if (!s) return "-";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return String(s);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
};

const roleBadgeClass = (role) => {
  const r = String(role || "").toUpperCase();
  if (r === "ADMIN") return "bg-rose-50 text-rose-700 ring-rose-200";
  return "bg-slate-50 text-slate-700 ring-slate-200";
};

const fmtActive = (v) => {
  const on = v === 1 || v === true || v === "1";
  return on ? "활성" : "비활성";
};

onMounted(async () => {
  await reloadList();
});
</script>

<style scoped>
.card {
  @apply w-full rounded-3xl bg-white shadow-sm ring-1 ring-slate-200;
}
.input {
  @apply w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100;
}

.btn-secondary {
  @apply inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50;
}

.btn-primary {
  @apply inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50;
}

.spinner {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 3px solid rgba(148, 163, 184, 0.35);
  border-top-color: rgba(15, 23, 42, 0.85);
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>