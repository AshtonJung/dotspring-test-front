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
            Notices
          </div>
          <h1 class="mt-3 text-2xl font-bold tracking-tight text-slate-900">공지사항</h1>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div class="relative w-full sm:w-[320px]">
            <input
              v-model.trim="q"
              class="input pr-10"
              placeholder="제목 또는 내용을 검색해 주세요."
              @keyup.enter="reload()"
            />
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          </div>

          <button type="button" class="btn-secondary" @click="reload" :disabled="loading">
            <span v-if="loading" class="inline-flex items-center gap-2">
              <span class="spinner"></span> 불러오는 중...
            </span>
            <span v-else>검색</span>
          </button>

          <button v-if="isAdmin" type="button" class="btn-primary" @click="goWrite">
            글쓰기
          </button>
        </div>
      </div>

      <!-- 테이블 -->
      <div class="card overflow-hidden p-0">
        <div class="border-b border-slate-200 bg-white px-5 py-4">
          <div class="flex items-center justify-between gap-3">
            <div class="text-sm font-bold text-slate-900">공지 목록</div>
            <div class="text-xs text-slate-500">
              총 {{ total }}건 · {{ page }} / {{ totalPages }} 페이지
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-[980px] w-full">
            <thead class="bg-slate-50">
              <tr class="text-left text-xs font-bold text-slate-600">
                <th class="px-5 py-3 w-[90px]">고정</th>
                <th class="px-5 py-3 w-[100px]">중요</th>
                <th class="px-5 py-3">제목</th>
                <th class="px-5 py-3 w-[180px]">작성일</th>
                <th class="px-5 py-3 w-[120px]">첨부</th>
                <th class="px-5 py-3 w-[170px] text-right"></th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-200 bg-white">
              <tr
                v-for="row in sortedItems"
                :key="row.id"
                class="cursor-pointer transition hover:bg-slate-50"
                :class="row.is_pinned ? 'bg-amber-200/70 hover:bg-amber-100' : ''"
                @click="openDetail(row.id)"
              >
                <td class="px-5 py-4">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1"
                    :class="row.is_pinned ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-slate-50 text-slate-600 ring-slate-200'"
                  >
                    {{ row.is_pinned ? "PIN" : "-" }}
                  </span>
                </td>

                <td class="px-5 py-4">
                  <span
                    v-if="row.is_pinned"
                    class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-200"
                  >
                    <span aria-hidden="true">✔</span>
                    <span>중요</span>
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200"
                  >
                    -
                  </span>
                </td>

                <td class="px-5 py-4">
                  <div class="text-sm font-semibold text-slate-900 line-clamp-1">
                    {{ row.title }}
                  </div>
                  <div class="mt-1 text-xs text-slate-500 line-clamp-1">
                    {{ strip(row.body) }}
                  </div>
                </td>

                <td class="px-5 py-4 text-sm text-slate-700">
                  {{ fmtDateTime(row.created_at) }}
                </td>

                <td class="px-5 py-4 text-sm text-slate-700">
                  <span class="inline-flex items-center gap-1 font-medium">
                    <span aria-hidden="true">📎</span>
                    <span>{{ row.files_count ?? 0 }}</span>
                  </span>
                </td>

                <td class="px-5 py-4 text-right">
                  <div class="inline-flex items-center gap-2">
                    <button
                      v-if="isAdmin"
                      type="button"
                      class="btn-secondary"
                      @click.stop="goEdit(row.id)"
                    >
                      수정
                    </button>

                    <button
                      v-if="isAdmin"
                      type="button"
                      class="btn-danger"
                      @click.stop="deleteNotice(row.id)"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="loading">
                <td colspan="6" class="px-5 py-10 text-center text-sm text-slate-500">
                  <span class="inline-flex items-center gap-2">
                    <span class="spinner"></span> 불러오는 중...
                  </span>
                </td>
              </tr>

              <tr v-if="!loading && sortedItems.length === 0">
                <td colspan="6" class="px-5 py-10 text-center text-sm text-slate-500">
                  등록된 데이터가 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지네이션 -->
        <div class="flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-5 py-4">
          <div class="text-xs text-slate-500">
            페이지 크기
            <select
              v-model.number="pageSize"
              class="ml-2 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <button class="btn-secondary" :disabled="page <= 1 || loading" @click="prevPage">이전</button>
            <div class="text-xs font-semibold text-slate-700">{{ page }} / {{ totalPages }}</div>
            <button class="btn-secondary" :disabled="page >= totalPages || loading" @click="nextPage">다음</button>
          </div>
        </div>
      </div>

      <div v-if="errorMsg" class="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200">
        {{ errorMsg }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

const router = useRouter();

/** 토큰 */
const getToken = () => (process.client ? sessionStorage.getItem("DDSP_AT") || "" : "");

/** 관리자 판단 */
const isAdmin = ref(false);
const detectAdmin = () => {
  try {
    const token = getToken();
    if (!token) {
      isAdmin.value = false;
      return;
    }

    const parts = token.split(".");
    if (parts.length < 2) {
      isAdmin.value = false;
      return;
    }

    const payload = JSON.parse(
      decodeURIComponent(
        escape(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))
      )
    );

    const role = String(payload?.role || payload?.user_role || "").toUpperCase();
    isAdmin.value = role === "ADMIN";
  } catch {
    isAdmin.value = false;
  }
};

/** 리스트 상태 */
const q = ref("");
const page = ref(1);
const pageSize = ref(20);

const loading = ref(false);
const errorMsg = ref("");

const items = ref<any[]>([]);
const total = ref(0);

const totalPages = computed(() => {
  const t = total.value || 0;
  const ps = pageSize.value || 20;
  return Math.max(1, Math.ceil(t / ps));
});

/** 중요 공지 상단 정렬 보정 */
const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => {
    const ap = a?.is_pinned ? 1 : 0;
    const bp = b?.is_pinned ? 1 : 0;

    if (bp !== ap) return bp - ap;

    const aId = Number(a?.id || 0);
    const bId = Number(b?.id || 0);
    return bId - aId;
  });
});

/** helpers */
const fmtDateTime = (s: any) => {
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

const strip = (v: any) => {
  const s = String(v || "");
  return s.length > 120 ? s.slice(0, 120) + "…" : s;
};

/** API */
const reload = async () => {
  loading.value = true;
  errorMsg.value = "";

  try {
    const res: any = await $fetch("/api/task/notices", {
      method: "GET",
      query: {
        q: q.value || undefined,
        page: page.value,
        page_size: pageSize.value,
      },
    });

    if (Array.isArray(res)) {
      items.value = res;
      total.value = res.length;
    } else {
      items.value = Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res?.data)
        ? res.data
        : [];
      total.value = Number(res?.total ?? items.value.length ?? 0);
    }

    if (page.value > totalPages.value) page.value = totalPages.value;
  } catch (e: any) {
    console.error(e);
    errorMsg.value = e?.data?.detail || e?.message || "목록을 불러오지 못했습니다.";
  } finally {
    loading.value = false;
  }
};

const openDetail = (id: number) => router.push(`/w9/notices/${id}`);
const goWrite = () => router.push(`/w9/notices/write`);
const goEdit = (id: number) => router.push(`/w9/notices/write?id=${id}`);

const deleteNotice = async (id: number) => {
  const token = getToken();
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  const ok = window.confirm("이 게시물을 삭제하시겠습니까?");
  if (!ok) return;

  try {
    await $fetch(`/api/task/notices/admin/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("게시물이 삭제되었습니다.");
    await reload();
  } catch (e: any) {
    console.error(e);
    alert(e?.data?.detail || e?.message || "게시물 삭제에 실패했습니다.");
  }
};

const prevPage = async () => {
  if (page.value <= 1) return;
  page.value -= 1;
  await reload();
};

const nextPage = async () => {
  if (page.value >= totalPages.value) return;
  page.value += 1;
  await reload();
};

watch(pageSize, async () => {
  page.value = 1;
  await reload();
});

onMounted(async () => {
  detectAdmin();
  await reload();
});
</script>

<style scoped>
.card {
  @apply w-full rounded-3xl bg-white shadow-sm ring-1 ring-slate-200;
}
.input {
  @apply w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100;
}
.btn-primary {
  @apply inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50;
}
.btn-secondary {
  @apply inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50;
}
.btn-danger {
  @apply inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50;
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
  to { transform: rotate(360deg); }
}
</style>