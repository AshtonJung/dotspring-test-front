<template>
  <section class="min-h-screen bg-slate-50">
    <div class="mx-auto w-full max-w-6xl px-4 py-10">
      <!-- 헤더 -->
      <div class="mb-6 flex flex-col gap-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              업무요청
            </h1>
          </div>

          <button
            type="button"
            class="btn-primary"
            @click="goWrite"
          >
            업무요청등록
          </button>
        </div>

        <!-- 날짜 필터 -->
<!-- 날짜 필터 -->
<div class="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
  <div class="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
    <div class="flex flex-wrap items-end gap-2">
      <div>
        <label class="mb-1 block text-xs font-semibold text-slate-500">From</label>
        <input v-model="dateFrom" type="date" class="input sm:w-[180px]" />
      </div>

      <div>
        <label class="mb-1 block text-xs font-semibold text-slate-500">To</label>
        <input v-model="dateTo" type="date" class="input sm:w-[180px]" />
      </div>

      <button
        v-for="preset in rangePresets"
        :key="preset.value"
        type="button"
        class="btn-range"
        :class="activeRange === preset.value ? 'btn-range-active' : 'btn-range-idle'"
        @click="applyPreset(preset.value)"
      >
        {{ preset.label }}
      </button>

      <button type="button" class="btn-secondary" @click="applyCustomRange">
        기간검색
      </button>

      <button type="button" class="btn-secondary" @click="resetFilters">
        초기화
      </button>

      <button
        type="button"
        class="btn-secondary"
        @click="toggleAdvanced"
        :aria-expanded="showAdvancedFilters ? 'true' : 'false'"
      >
        {{ showAdvancedFilters ? "접기" : "열기" }}
      </button>
    </div>
  </div>
</div>

        <!-- 검색/업무유형/업무담당자/업무상태 필터 -->
        <div
          v-show="showAdvancedFilters"
          class="grid gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-4"
        >
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-500">검색어</label>
            <div class="relative">
              <input
                v-model.trim="q"
                class="input input-sm pr-10"
                placeholder="회사명, 이름 검색"
                @keyup.enter="reloadAll"
              />
              <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-500">업무상태</label>
            <select v-model="statusFilter" class="input input-sm">
              <option value="ALL">전체 상태</option>
              <option
                v-for="item in statusCodes"
                :key="item.code"
                :value="item.code"
              >
                {{ item.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500">업무유형</label>
            <select v-model="requestTypeFilter" class="input input-sm">
              <option value="ALL">전체 업무유형</option>
              <option
                v-for="item in requestTypeCodes"
                :key="item.code"
                :value="item.code"
              >
                {{ item.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-500">업무담당자</label>
            <select v-model="assigneeFilter" class="input input-sm">
              <option value="ALL">전체 업무담당자</option>
              <option
                v-for="item in assigneeCodes"
                :key="item.code"
                :value="item.code"
              >
                {{ item.label }}
              </option>
            </select>
          </div>
          
        </div>
      </div>

      <!-- 테이블 -->
      <div class="card overflow-hidden p-0">
        <!-- 공지사항 -->
        <div v-if="pinnedNotices.length" class="border-b border-slate-200 bg-amber-50 px-5 py-4">
          <div class="space-y-2">
            <button
              v-for="notice in pinnedNotices"
              :key="notice.id"
              type="button"
              class="flex w-full items-center gap-3 rounded-2xl border border-amber-200 bg-amber-100 px-4 py-3 text-left transition hover:bg-amber-200/70"
              @click="openNotice(notice.id)"
            >
              <span
                class="inline-flex shrink-0 items-center rounded-full bg-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-900"
              >
                중요 공지사항
              </span>

              <div class="min-w-0 flex-1 overflow-hidden text-sm text-slate-800">
                <span class="font-bold text-slate-900">{{ notice.title }}</span>
                <span class="mx-2 text-slate-400">·</span>
                <span class="text-slate-600">{{ fmtDateTime(notice.created_at) }}</span>
              </div>
            </button>
          </div>
        </div>

        <div>
          <table class="w-full">
            <thead class="bg-slate-50">
              <tr class="text-left text-xs font-bold text-slate-600">
                <th class="py-3 text-center">접수일</th>
                <th class="py-3 text-center">Ticket #</th>
                <th class="py-3 text-center">회사명/담당자</th>
                <th class="py-3 text-center"">완료예정일</th>
                <th class="py-3 text-center">업무유형</th>
                <th class="py-3 text-center">업무담당자</th>
                <th class="py-3 text-center">진행상태</th>
                <th class="py-3 text-center">댓글</th>
                <!--<th class="py-3 text-center">삭제</th>-->
              </tr>
            </thead>
<tbody class="divide-y divide-slate-200 bg-white">
  <tr
    v-for="row in filtered"
    :key="row.id"
    class="cursor-pointer transition hover:bg-slate-50"
    @click="openDetail(row.id)"
  >
   


    <td class="text-center py-4 align-top text-sm text-slate-700">
      {{ fmtDateTime(row.created_at) }}
    </td>

        <td class="text-center py-4 align-top">
      <div class="text-base leading-snug">
        #{{ row.req_no || "-" }}
      </div>
    </td>

    <td class="text-center py-4 align-top">
      <div class="mt-1 text-sm text-slate-500">
        {{ row.company_name || "-" }} <br />
        {{ row.requester_name || "-" }}
      </div>
    </td>

    <td class="text-center py-4 align-top text-sm text-slate-700">
      {{ fmtDateOnly(row.due_date) }}
    </td>

    <td class="text-center py-4 align-top">
      <div class="text-base leading-snug">
        {{ requestTypeLabel(row.request_type) }}
      </div>
    </td>

<td class="text-center py-4 align-top">
  <div class="text-base leading-snug">
    {{ assigneeLabel(row.assignee_code) }}
  </div>
</td>

     <td class="text-center py-4 align-top">
      <div class="text-base leading-snug">
        {{ statusLabel(row.status_code) }}
      </div>
    </td>


    <td class="text-center py-4 align-top text-sm text-slate-700">
      <div class="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
        <span aria-hidden="true">💬</span>
        <span class="font-semibold">{{ row.comments_count ?? 0 }}</span>
      </div>
    </td>

    <!--<td class="text-center py-4 align-top">
      <button
        v-if="isAdmin"
        type="button"
        class="btn-danger"
        @click.stop="deleteRequest(row)"
        :disabled="deletingId === row.id"
      >
        <span v-if="deletingId === row.id" class="inline-flex items-center gap-2">
          <span class="spinner"></span>
          삭제 중...
        </span>
        <span v-else>삭제</span>
      </button>
    </td>-->
  </tr>

  <tr v-if="loadingList">
    <td colspan="11" class="px-5 py-10 text-center text-sm text-slate-500">
      <span class="inline-flex items-center gap-2">
        <span class="spinner"></span>
        목록을 불러오는 중입니다...
      </span>
    </td>
  </tr>

  <tr v-if="!loadingList && filtered.length === 0">
    <td colspan="11" class="px-5 py-10 text-center text-sm text-slate-500">
      검색 결과가 없습니다.
    </td>
  </tr>
</tbody>
          </table>
        </div>
      </div>

      <div
        v-if="errorMsg"
        class="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200"
      >
        {{ errorMsg }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const router = useRouter();

const getToken = () => (process.client ? sessionStorage.getItem("DDSP_AT") || "" : "");

const rangePresets = [
  { value: "1d", label: "1일" },
  { value: "3d", label: "3일" },
  { value: "1w", label: "1주" },
];

const goWrite = () => router.push(`/w9/input`);

const me = ref({
  id: null,
  role: "",
  name: "",
  username: "",
});

const isAdmin = computed(() => String(me.value.role || "").toUpperCase() === "ADMIN");

const requests = ref([]);
const pinnedNotices = ref([]);
const statusCodes = ref([]);
const requestTypeCodes = ref([]);
const assigneeCodes = ref([]);

const loadingList = ref(false);
const errorMsg = ref("");
const deletingId = ref(null);

const q = ref("");
const statusFilter = ref("ALL");
const requestTypeFilter = ref("ALL");
const assigneeFilter = ref("ALL");

const dateFrom = ref("");
const dateTo = ref("");
const appliedDateFrom = ref("");
const appliedDateTo = ref("");

const activeRange = ref("3d");
const showAdvancedFilters = ref(true);

const toggleAdvanced = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value;
};

const resetFilters = () => {
  q.value = "";
  requestTypeFilter.value = "ALL";
  assigneeFilter.value = "ALL";
  statusFilter.value = "ALL";
  applyPreset("3d");
};

const decodeMe = () => {
  try {
    const token = getToken();
    if (!token) return;

    const parts = token.split(".");
    if (parts.length < 2) return;

    const payload = JSON.parse(
      decodeURIComponent(
        escape(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))
      )
    );

    me.value.id = payload?.user_id || payload?.id || payload?.sub || null;
    me.value.role = payload?.role || "";
    me.value.name = payload?.name || "";
    me.value.username = payload?.username || "";
  } catch (e) {
    console.error("decodeMe error", e);
  }
};

const statusLabel = (code) => {
  if (!code) return "-";
  const found = statusCodes.value.find((item) => item.code === code);
  return found?.label || code;
};

const requestTypeLabel = (code) => {
  if (!code) return "-";
  const found = requestTypeCodes.value.find((item) => item.code === code);
  return found?.label || code;
};

const assigneeLabel = (code) => {
  if (!code) return "-";
  const found = assigneeCodes.value.find((item) => item.code === code);
  return found?.label || code;
};

const filteredByDateAndKeyword = computed(() => {
  const keyword = q.value.toLowerCase().trim();

  return requests.value.filter((r) => {
    if (appliedDateFrom.value || appliedDateTo.value) {
      const created = toDateOnly(r.created_at);
      if (!created) return false;

      if (appliedDateFrom.value && created < appliedDateFrom.value) return false;
      if (appliedDateTo.value && created > appliedDateTo.value) return false;
    }

    if (requestTypeFilter.value !== "ALL" && r.request_type !== requestTypeFilter.value) {
      return false;
    }

    if (assigneeFilter.value !== "ALL" && (r.assignee_code || "") !== assigneeFilter.value) {
      return false;
    }

    if (!keyword) return true;

    const hay = [
      r.company_name,
      r.requester_name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(keyword);
  });
});

const defaultVisibleRows = (rows) => {
  return rows.filter((r) => {
    const code = String(r.status_code || "").toUpperCase();
    return code !== "DONE" && code !== "CANCELED" && code !== "CANCELLED";
  });
};

const filtered = computed(() => {
  if (statusFilter.value === "ALL") {
    return defaultVisibleRows(filteredByDateAndKeyword.value);
  }

  return filteredByDateAndKeyword.value.filter((r) => r.status_code === statusFilter.value);
});

const toDateOnly = (s) => {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateInput = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const applyPreset = (preset) => {
  const today = new Date();
  const end = new Date(today);
  const start = new Date(today);

  if (preset === "1d") start.setDate(start.getDate() - 1);
  if (preset === "3d") start.setDate(start.getDate() - 3);
  if (preset === "1w") start.setDate(start.getDate() - 7);

  dateFrom.value = formatDateInput(start);
  dateTo.value = formatDateInput(end);

  appliedDateFrom.value = dateFrom.value;
  appliedDateTo.value = dateTo.value;

  activeRange.value = preset;
};

const applyCustomRange = () => {
  if (dateFrom.value && dateTo.value && dateFrom.value > dateTo.value) {
    alert("시작일이 종료일보다 늦을 수 없습니다.");
    return;
  }

  appliedDateFrom.value = dateFrom.value;
  appliedDateTo.value = dateTo.value;
  activeRange.value = "custom";
};

const stripHtml = (html) => {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const loadStatusCodes = async () => {
  const res = await $fetch("/api/task/codes/status", {
    method: "GET",
  });

  const items = Array.isArray(res) ? res : res?.items || res?.data || [];
  statusCodes.value = items;
};

const loadRequestTypeCodes = async () => {
  const res = await $fetch("/api/task/codes/request-types", {
    method: "GET",
  });

  const items = Array.isArray(res) ? res : res?.items || res?.data || [];
  requestTypeCodes.value = items;
};

const loadAssigneeCodes = async () => {
  const res = await $fetch("/api/task/codes/assignees", {
    method: "GET",
  });

  const items = Array.isArray(res) ? res : res?.items || res?.data || [];
  assigneeCodes.value = items;
};

const reloadList = async () => {
  const token = getToken();
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  const res = await $fetch("/api/task/requests", {
    method: "GET",
    query: { status: "ALL" },
    headers: { Authorization: `Bearer ${token}` },
  });

  const items = Array.isArray(res) ? res : res?.items || res?.data || [];
  requests.value = items;
};

const loadPinnedNotices = async () => {
  const res = await $fetch("/api/task/notices", {
    method: "GET",
  });

  const items = Array.isArray(res) ? res : res?.items || res?.data || [];

  pinnedNotices.value = items
    .filter((item) => item.is_pinned)
    .map((item) => ({
      ...item,
      body_preview: stripHtml(item.body).slice(0, 80),
      author_name: item.author_name || item.created_by_name || item.writer_name || "관리자",
    }));
};

const reloadAll = async () => {
  loadingList.value = true;
  errorMsg.value = "";

  try {
    await Promise.all([
      loadStatusCodes(),
      loadRequestTypeCodes(),
      loadAssigneeCodes(),
      reloadList(),
      loadPinnedNotices(),
    ]);
  } catch (e) {
    console.error(e);
    errorMsg.value = "목록을 불러오지 못했습니다.";
  } finally {
    loadingList.value = false;
  }
};

const removeRequestApi = async (id) => {
  const token = getToken();
  return await $fetch(`/api/task/requests/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteRequest = async (row) => {
  if (!isAdmin.value) {
    alert("삭제는 관리자만 가능합니다.");
    return;
  }

  if (!row?.id) return;
  if (!confirm(`"${row.req_no || row.id}번 요청"을(를) 삭제하시겠습니까?`)) return;

  deletingId.value = row.id;
  try {
    await removeRequestApi(row.id);
    requests.value = requests.value.filter((item) => item.id !== row.id);
    alert("게시물이 삭제되었습니다.");
  } catch (e) {
    console.error(e);
    alert("게시물 삭제에 실패했습니다.");
  } finally {
    deletingId.value = null;
  }
};

const openDetail = (id) => {
  router.push(`/w9/${id}`);
};

const openNotice = (id) => {
  router.push(`/w9/notices/${id}`);
};

const fmtDateTime = (s) => {
  if (!s) return "-";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return String(s);

  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);

  return `${mm}-${dd}-${yy}`;
};

const fmtDateOnly = (s) => {
  if (!s) return "-";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return String(s);

  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);

  return `${mm}-${dd}-${yy}`;
};

const statusBadgeClass = (code) => {
  const upper = String(code || "").toUpperCase();
  if (upper.includes("DONE") || upper.includes("COMPLETE") || upper.includes("CANCEL")) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (upper.includes("FAIL")) {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }
  if (upper.includes("PROGRESS")) {
    return "bg-indigo-50 text-indigo-700 ring-indigo-200";
  }
  if (upper.includes("SHIP") || upper.includes("CUSTOM")) {
    return "bg-sky-50 text-sky-700 ring-sky-200";
  }
  return "bg-amber-50 text-amber-700 ring-amber-200";
};

onMounted(async () => {
  decodeMe();
  applyPreset("3d");
  showAdvancedFilters.value = true;
  await reloadAll();
});
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-95;
}
.card {
  @apply w-full rounded-3xl bg-white shadow-sm ring-1 ring-slate-200;
}
.input {
  @apply w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100;
}
.input-sm {
  @apply px-3 py-2 text-xs;
}
.btn-secondary {
  @apply inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50;
}
.btn-danger {
  @apply inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50;
}
.btn-range {
  @apply inline-flex items-center justify-center rounded-2xl px-4 py-2 text-xs font-bold shadow-sm ring-1 transition;
}
.btn-range-idle {
  @apply bg-white text-slate-700 ring-slate-200 hover:bg-slate-50;
}
.btn-range-active {
  @apply bg-slate-900 text-white ring-slate-900;
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