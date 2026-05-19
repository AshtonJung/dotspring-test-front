<template>
  <section class="min-h-screen bg-slate-50">
    <div class="mx-auto w-full max-w-6xl px-4 py-10">
      <!-- 상단 헤더 -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 leading-snug">
            {{ active ? `[${requestTypeLabel(active.request_type)}] #${active.req_no || "-"}` : "업무 요청 상세" }}
          </h1>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="btn-secondary" @click="goBack">
            목록
          </button>

          <button
            v-if="isAdmin"
            type="button"
            class="btn-danger"
            @click="deleteRequest"
            :disabled="deletingRequest || !active"
          >
            <span v-if="deletingRequest" class="inline-flex items-center gap-2">
              <span class="spinner"></span>
              삭제 중...
            </span>
            <span v-else>삭제</span>
          </button>
        </div>
      </div>

      <!-- 로딩 -->
      <div v-if="loadingDetail" class="card p-10 text-center">
        <span class="inline-flex items-center gap-2 text-sm text-slate-600">
          <span class="spinner"></span>
          상세 정보를 불러오는 중입니다...
        </span>
      </div>

      <!-- 상세 -->
      <div v-else-if="active" class="space-y-5">
        <div class="grid gap-4 lg:grid-cols-2">
  <!-- 좌측: 읽기 전용 정보 -->
  <div class="card p-5">
    <div class="grid gap-4">
      <div class="rounded-2xl bg-slate-50 ring-1 ring-slate-200" p-2 style="height:90px;">
        <div class="text-xs font-semibold text-slate-500">회사명/담당자</div>
        <div class="mt-2 text-base text-slate-900 break-words">
          {{ active.company_name || "-" }} / {{ active.requester_name || "-" }}
        </div>
      </div>

      <div class="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-2" style="height:90px;">
        <div class="text-xs font-semibold text-slate-500">이메일</div>
        <div class="mt-2 text-sm text-slate-900 break-all">
          {{ active.requester_email || "-" }}
        </div>
      </div>

      <div class="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-2" style="height:90px;">
        <div class="text-xs font-semibold text-slate-500">접수일</div>
        <div class="mt-2 text-sm text-slate-900">
          {{ fmtDateTime(active.created_at) }}
        </div>
      </div>

      <div class="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-2" style="height:90px;">
  <div class="text-xs font-semibold text-slate-500">완료 예정일</div>

  <div class="mt-2 flex flex-wrap items-center gap-2">
    <template v-if="isAdmin">
      <input
        v-model="editDueDate"
        type="date"
        class="input-sm"
      />

      <button
        type="button"
        class="btn-secondary"
        @click="updateDueDateOnly"
        :disabled="savingMeta"
      >
        변경
      </button>
    </template>

    <template v-else>
      <div class="text-sm text-slate-900">
        {{ active?.due_date || "-" }}
      </div>
    </template>
  </div>
</div>
    </div>
  </div>

  <!-- 우측: 수정 가능 정보 -->
  <div class="card p-5">
    <div class="grid gap-4">
<div class="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-2" style="height:90px;">
  <div class="text-xs font-semibold text-slate-500">업무상태</div>

  <div class="mt-2 flex flex-wrap items-center gap-2">
    <template v-if="isAdmin">
      <select v-model="editStatusCode" class="input-sm">
        <option value="">상태 선택</option>
        <option
          v-for="item in statusCodes"
          :key="item.code"
          :value="item.code"
        >
          {{ item.label }}
        </option>
      </select>

      <button
        type="button"
        class="btn-secondary"
        @click="updateStatusOnly"
        :disabled="savingMeta"
      >
        변경
      </button>
    </template>

    <template v-else>
      <div class="text-sm text-slate-900">
        {{ active ? statusLabel(active.status_code) : "-" }}
      </div>
    </template>
  </div>
</div>

<div class="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-2" style="height:90px;">
  <div class="text-xs font-semibold text-slate-500">업무담당자</div>

  <div class="mt-2 flex flex-wrap items-center gap-2">
    <template v-if="isAdmin">
      <select v-model="editAssigneeCode" class="input-sm">
        <option value="">담당자 선택</option>
        <option
          v-for="item in assigneeCodes"
          :key="item.code"
          :value="item.code"
        >
          {{ item.label }}
        </option>
      </select>

      <button
        type="button"
        class="btn-secondary"
        @click="updateAssigneeOnly"
        :disabled="savingMeta"
      >
        변경
      </button>
    </template>

    <template v-else>
      <div class="text-sm text-slate-900">
        {{ active ? assigneeLabel(active.assignee_code) : "-" }}
      </div>
    </template>
  </div>
</div>

<div class="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-2" style="height:90px;">
  <div class="text-xs font-semibold text-slate-500">업무유형</div>

  <div class="mt-2 flex flex-wrap items-center gap-2">
    <template v-if="isAdmin">
      <select v-model="editRequestType" class="input-sm">
        <option value="">업무유형 선택</option>
        <option
          v-for="item in requestTypeCodes"
          :key="item.code"
          :value="item.code"
        >
          {{ item.label }}
        </option>
      </select>

      <button
        type="button"
        class="btn-secondary"
        @click="updateRequestTypeOnly"
        :disabled="savingMeta"
      >
        변경
      </button>
    </template>

    <template v-else>
      <div class="text-sm text-slate-900">
        {{ active ? requestTypeLabel(active.request_type) : "-" }}
      </div>
    </template>
  </div>
</div>  

<div class="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-2" style="height:90px;">
  <div class="text-xs font-semibold text-slate-500">완료일</div>

  <div class="mt-2 flex flex-wrap items-center gap-2">
    <template v-if="isAdmin">
      <input
        v-model="editPlannedDate"
        type="date"
        class="input-sm"
      />

      <button
        type="button"
        class="btn-secondary"
        @click="updatePlannedDateOnly"
        :disabled="savingMeta"
      >
        변경
      </button>
    </template>

    <template v-else>
      <div class="text-sm text-slate-900">
        {{ active?.planned_date || "-" }}
      </div>
    </template>
  </div>
</div>    
    </div>
  </div>
</div>

        <!-- 요청 상세 -->
        <div class="card p-5">
          <div class="text-sm font-bold text-slate-900">요청업무</div>
          <div class="prose-view mt-3" v-html="renderBody(active.body)"></div>
        </div>

        <!-- 첨부파일 -->
        <div class="card p-5">
          <div class="text-sm font-bold text-slate-900">첨부파일</div>

          <div v-if="files.length" class="mt-3 space-y-2">
            <div
              v-for="(f, i) in files"
              :key="`f-${active.id}-${i}`"
              class="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-xs ring-1 ring-slate-200"
            >
              <div class="min-w-0">
                <div class="truncate text-slate-800">{{ f.original_name }}</div>
                <div class="text-slate-500">
                  {{ prettySize(f.file_size) }}
                  <span v-if="f.mime_type"> · {{ f.mime_type }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" class="btn-ghost" @click="openFile(f)">
                  보기
                </button>

                <button type="button" class="btn-secondary" @click="downloadFile(f)">
                  다운로드
                </button>
              </div>
            </div>
          </div>

          <div v-else class="mt-3 text-xs text-slate-500">
            첨부파일이 없습니다.
          </div>
        </div>

        <!-- 관리자 메모: 관리자만 표시 -->
<div v-if="isAdmin" class="card p-5">
  <div class="flex items-center justify-between gap-3">
    <div class="text-sm font-bold text-slate-900">관리자 메모</div>
  </div>

  <div class="mt-3">
    <textarea
      v-model="editInternalMemo"
      class="textarea"
      rows="5"
      placeholder="관리자만 볼 수 있는 관리자 메모를 입력해 주세요."
    ></textarea>

    <div class="mt-3 flex justify-end">
      <button
        type="button"
        class="btn-secondary"
        @click="updateInternalMemoOnly"
        :disabled="savingMeta"
      >
        저장
      </button>
    </div>
  </div>
</div>

        <!-- 댓글 등록 -->
        <div class="card p-5">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-sm font-bold text-slate-900">댓글 등록</div>
              
            </div>

            <span class="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
              {{ comments.length }}개
            </span>
          </div>

          <div class="mt-3">
            <textarea
              v-model="newComment"
              class="textarea"
              rows="4"
              placeholder="예) 첨부파일을 확인하였고, 오늘 중으로 반영 예정입니다."
            ></textarea>

            <div class="mt-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div class="text-xs font-semibold text-slate-600">
                  댓글 첨부파일 (최대 10개)
                </div>

                <div class="flex items-center gap-2">
                  <label class="btn-secondary cursor-pointer">
                    추가
                    <input
                      id="comment-file-input"
                      type="file"
                      class="hidden"
                      multiple
                      @change="onCommentFilesChange"
                    />
                  </label>

                  <button
                    v-if="commentFiles.length"
                    type="button"
                    class="btn-ghost"
                    @click="clearCommentFiles"
                  >
                    전체 제거
                  </button>
                </div>
              </div>

              <div v-if="commentFiles.length" class="mt-3 space-y-2">
                <div
                  v-for="(file, idx) in commentFiles"
                  :key="`${file.name}-${file.size}-${idx}`"
                  class="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-slate-200"
                >
                  <div class="min-w-0">
                    <div class="truncate font-semibold text-slate-800">{{ file.name }}</div>
                    <div class="text-slate-500">
                      {{ prettySize(file.size) }}
                      <span v-if="file.type"> · {{ file.type }}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="btn-ghost"
                    @click="removeCommentFile(idx)"
                  >
                    제거
                  </button>
                </div>
              </div>

              <div v-else class="mt-2 text-xs text-slate-500">
                첨부된 파일이 없습니다.
              </div>
            </div>

            <div class="mt-2 flex items-center justify-between gap-2">
              <div class="text-xs text-slate-500"></div>

              <button
                type="button"
                class="btn-submit"
                @click="addComment"
                :disabled="savingComment || !newComment.trim()"
              >
                <span v-if="savingComment" class="inline-flex items-center gap-2">
                  <span class="spinner"></span>
                  등록 중...
                </span>
                <span v-else>댓글 등록</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 댓글 목록 -->
        <div class="card p-5">
          <div class="text-sm font-bold text-slate-900">댓글 목록</div>

          <div class="mt-3 space-y-2">
            <div
              v-for="c in comments"
              :key="c.id"
              class="rounded-xl px-3 py-2 ring-1"
              :class="c.is_deleted
                ? 'bg-slate-100 ring-slate-200 opacity-60'
                : 'bg-slate-50 ring-slate-200'"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="text-xs font-bold text-slate-700">
                  {{ commentDisplayName(c) }}
                </div>

                <div class="flex items-center gap-2">
                  <div class="text-[11px] text-slate-500">{{ fmtDateTime(c.created_at) }}</div>

                  <button
                    v-if="canDeleteComment(c) && !c.is_deleted"
                    type="button"
                    class="btn-danger"
                    @click="deleteComment(c.id)"
                  >
                    취소
                  </button>
                </div>
              </div>

              <div
                class="mt-1 text-xs leading-5 whitespace-pre-wrap"
                :class="c.is_deleted
                  ? 'text-slate-400 line-through'
                  : 'text-slate-700'"
              >
                {{ c.body }}
              </div>

              <div v-if="(c.files && c.files.length) || c.file" class="mt-2 space-y-2">
                <div
                  v-for="(fileItem, fileIdx) in (c.files && c.files.length ? c.files : [c.file])"
                  :key="`comment-file-${c.id}-${fileIdx}`"
                  class="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-slate-200"
                >
                  <div class="min-w-0">
                    <div class="truncate font-semibold text-slate-800">
                      📎 {{ fileItem.original_name }}
                    </div>
                    <div class="text-slate-500">
                      {{ prettySize(fileItem.file_size) }}
                      <span v-if="fileItem.mime_type"> · {{ fileItem.mime_type }}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="btn-ghost"
                      @click="openFile(fileItem)"
                    >
                      보기
                    </button>

                    <button
                      type="button"
                      class="btn-secondary"
                      @click="downloadFile(fileItem)"
                    >
                      다운로드
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!comments.length" class="text-xs text-slate-500">
              아직 댓글이 없습니다.
            </div>
          </div>
        </div>

        <!-- 업무 추적 로그
        <div class="card p-5">
          <div class="text-sm font-bold text-slate-900">업무 추적 로그</div>
          <p class="mt-1 text-xs text-slate-500">상태 변경과 댓글 내역이 표시됩니다.</p>

          <div class="mt-3 max-h-[420px] space-y-2 overflow-auto pr-1">
            <div
              v-for="(log, idx) in events"
              :key="`evt-${idx}-${log.id}`"
              class="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="text-xs font-bold text-slate-700">{{ log.event_type }}</div>
                <div class="text-[11px] text-slate-500">{{ fmtDateTime(log.created_at) }}</div>
              </div>

              <div class="mt-1 text-xs text-slate-700 leading-5 whitespace-pre-wrap">
                {{ eventMessage(log) }}
              </div>
            </div>

            <div v-if="!events.length" class="text-xs text-slate-500">
              아직 로그가 없습니다.
            </div>
          </div>
        </div>-->
      </div>

      <div
        v-if="errorDetail"
        class="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200"
      >
        {{ errorDetail }}
      </div>
    </div>

    <!-- 미리보기 모달 -->
    <div
      v-if="previewOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4"
      @click.self="closePreview"
    >
      <div class="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div class="truncate text-sm font-bold text-slate-900">
            {{ previewName }}
          </div>

          <button type="button" class="btn-secondary" @click="closePreview">
            닫기
          </button>
        </div>

        <div class="h-[80vh] bg-slate-100">
          <img
            v-if="previewMode === 'image'"
            :src="previewUrl"
            class="h-full w-full object-contain"
            alt="첨부파일 미리보기"
          />

          <iframe
            v-else-if="previewMode === 'pdf'"
            :src="previewUrl"
            class="h-full w-full"
            title="PDF 미리보기"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";

const router = useRouter();
const route = useRoute();

const requestId = computed(() => String(route.params.id || ""));
const getToken = () => (process.client ? sessionStorage.getItem("DDSP_AT") || "" : "");

const STATUS_LABELS = {
  REQUESTED: "요청등록",
  REMOVAL: "Removal",
  READY: "Ready",
  CS_ISSUE: "고객문의/이슈",
  IN_PROGRESS: "작업 진행 중",
  WAIT_SHIP: "출고대기",
  SHIPPED_DO: "Shipped/DO",
  OUT_INPUT: "출고/입력",
  CUSTOMS: "통관업무",
  DONE: "완료",
  FAILURE: "취소",
};

const statusLabel = (code) => {
  if (!code) return "-";
  return STATUS_LABELS[code] ?? code;
};

const statusBadgeClass = (code) => {
  if (code === "DONE") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (code === "FAILURE") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (code === "IN_PROGRESS") return "bg-indigo-50 text-indigo-700 ring-indigo-200";
  if (code === "WAIT_SHIP" || code === "SHIPPED_DO" || code === "OUT_INPUT" || code === "CUSTOMS") {
    return "bg-sky-50 text-sky-700 ring-sky-200";
  }
  if (code === "REQUESTED" || code === "READY" || code === "CS_ISSUE" || code === "REMOVAL") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }
  return "bg-slate-50 text-slate-700 ring-slate-200";
};

const statusDotClass = (code) => {
  if (code === "DONE") return "bg-emerald-500";
  if (code === "FAILURE") return "bg-rose-500";
  if (code === "IN_PROGRESS") return "bg-indigo-500";
  if (code === "WAIT_SHIP" || code === "SHIPPED_DO" || code === "OUT_INPUT" || code === "CUSTOMS") {
    return "bg-sky-500";
  }
  if (code === "REQUESTED" || code === "READY" || code === "CS_ISSUE" || code === "REMOVAL") {
    return "bg-amber-500";
  }
  return "bg-slate-500";
};

const active = ref(null);
const files = ref([]);
const comments = ref([]);
const events = ref([]);
const requestTypeCodes = ref([]);
const assigneeCodes = ref([]);
const statusCodes = ref([]);

const loadingDetail = ref(false);
const errorDetail = ref("");

const newComment = ref("");
const commentFiles = ref([]);
const savingComment = ref(false);
const savingStatus = ref(false);
const deletingCommentId = ref(null);
const deletingRequest = ref(false);
const savingMeta = ref(false);

const previewOpen = ref(false);
const previewUrl = ref("");
const previewName = ref("");
const previewMode = ref("");

const editStatusCode = ref("");
const editAssigneeCode = ref("");
const editRequestType = ref("");
const editDueDate = ref("");
const editPlannedDate = ref("");
const editInternalMemo = ref("");

const me = ref({
  userId: null,
  role: "",
  companyName: "",
  name: "",
});

const isDoneActive = computed(() => active.value?.status_code === "DONE");
const isAdmin = computed(() => me.value.role === "ADMIN");
const hasFiles = computed(() => Array.isArray(files.value) && files.value.length > 0);

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

    me.value.userId = payload?.user_id || payload?.id || null;
    me.value.role = String(payload?.role || payload?.user_role || "").toUpperCase();
    me.value.companyName = payload?.company_name || payload?.company || "";
    me.value.name = payload?.name || payload?.user_name || "";
  } catch (e) {
    console.error(e);
  }
};

const goBack = () => {
  router.push("/w9/list");
};

const onCommentFilesChange = (e) => {
  const selected = Array.from(e.target.files || []);
  if (!selected.length) return;

  const merged = [...commentFiles.value];

  for (const file of selected) {
    const duplicated = merged.some(
      (f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
    );
    if (!duplicated) {
      merged.push(file);
    }
  }

  if (merged.length > 10) {
    alert("댓글 첨부파일은 최대 10개까지 등록할 수 있습니다.");
    commentFiles.value = merged.slice(0, 10);
  } else {
    commentFiles.value = merged;
  }

  const el = document.getElementById("comment-file-input");
  if (el) el.value = "";
};

const removeCommentFile = (idx) => {
  commentFiles.value.splice(idx, 1);
};

const clearCommentFiles = () => {
  commentFiles.value = [];
  const el = document.getElementById("comment-file-input");
  if (el) el.value = "";
};

const loadRequestTypeCodes = async () => {
  try {
    const res = await $fetch("/api/task/codes/request-types");
    requestTypeCodes.value = Array.isArray(res) ? res : res?.items || res?.data || [];
  } catch (e) {
    console.error("업무유형 코드 조회 실패", e);
    requestTypeCodes.value = [];
  }
};

const loadAssigneeCodes = async () => {
  try {
    const res = await $fetch("/api/task/codes/assignees");
    assigneeCodes.value = Array.isArray(res) ? res : res?.items || res?.data || [];
  } catch (e) {
    console.error("업무담당자 코드 조회 실패", e);
    assigneeCodes.value = [];
  }
};

const loadStatusCodes = async () => {
  try {
    const res = await $fetch("/api/task/codes/status");
    statusCodes.value = Array.isArray(res) ? res : res?.items || res?.data || [];
  } catch (e) {
    console.error("상태 코드 조회 실패", e);
    statusCodes.value = [];
  }
};

const toDateInputValue = (s) => {
  if (!s) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(String(s))) {
    return String(s);
  }

  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const loadDetail = async () => {
  const token = getToken();
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  loadingDetail.value = true;
  errorDetail.value = "";

  try {
    const res = await $fetch(`/api/task/requests/${requestId.value}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    active.value = res?.request || res?.data || res;
    files.value = Array.isArray(res?.files) ? res.files : [];
    comments.value = Array.isArray(res?.comments) ? res.comments : [];
    events.value = Array.isArray(res?.events) ? res.events : [];

    editStatusCode.value = active.value?.status_code || "";
    editAssigneeCode.value = active.value?.assignee_code || "";
    editRequestType.value = active.value?.request_type || "";
    editDueDate.value = toDateInputValue(active.value?.due_date);
    editPlannedDate.value = toDateInputValue(active.value?.planned_date);
    editInternalMemo.value = active.value?.internal_memo || "";
  } catch (e) {
    console.error(e);
    errorDetail.value = "상세 정보를 불러오지 못했습니다.";
  } finally {
    loadingDetail.value = false;
  }
};

const renderBody = (html) => {
  if (!html) return "-";
  return String(html);
};

const postComment = async (id, text) => {
  const token = getToken();
  return await $fetch(`/api/task/requests/${id}/comments`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: { body: text },
  });
};

const patchStatus = async (id, nextStatusCode) => {
  const token = getToken();
  return await $fetch(`/api/task/requests/${id}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: { status_code: nextStatusCode },
  });
};

const patchAdminMeta = async (id, payload) => {
  const token = getToken();
  return await $fetch(`/api/task/requests/${id}/admin-meta`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
  });
};

const removeCommentApi = async (commentId) => {
  const token = getToken();
  return await $fetch(`/api/task/requests/comments/${commentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

const removeRequestApi = async (id) => {
  const token = getToken();
  return await $fetch(`/api/task/requests/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

const addComment = async () => {
  const text = newComment.value.trim();
  if (!text || !active.value?.id) return;

  const token = getToken();
  savingComment.value = true;

  try {
    const saved = await postComment(active.value.id, text);
    const savedComment = saved?.comment || saved;
    const evt = saved?.event;

    const attachedFiles = [];

    if (commentFiles.value.length && savedComment?.id) {
      for (const file of commentFiles.value) {
        const uploadMeta = await $fetch("/api/task/upload-url", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: {
            filename: file.name,
            content_type: file.type || "application/octet-stream",
          },
        });

        const uploadUrl = uploadMeta.upload_url;
        const s3Key = uploadMeta.key;
        const fileUrl = `s3://${s3Key}`;

        if (!uploadUrl || !s3Key) {
          throw new Error("업로드 URL 응답값이 올바르지 않습니다.");
        }

        await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });

        const attached = await $fetch(
          `/api/task/requests/${active.value.id}/comments/${savedComment.id}/files`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: {
              file_url: fileUrl,
              s3_key: s3Key,
              original_name: file.name,
              mime_type: file.type || "application/octet-stream",
              file_size: file.size,
            },
          }
        );

        if (attached?.file) {
          attachedFiles.push(attached.file);
        }
      }
    }

    comments.value.unshift({
      ...savedComment,
      file: attachedFiles[0] || savedComment?.file || null,
      files: attachedFiles.length ? attachedFiles : (savedComment?.files || []),
    });

    if (evt?.id) events.value.unshift(evt);

    newComment.value = "";
    clearCommentFiles();
  } catch (e) {
    console.error(e);
    alert("댓글 저장에 실패했습니다.");
  } finally {
    savingComment.value = false;
  }
};

const updateStatusOnly = async () => {
  if (!active.value?.id || !isAdmin.value) return;

  if (!editStatusCode.value) {
    alert("상태를 선택해주세요.");
    return;
  }

  savingMeta.value = true;

  try {
    const res = await patchAdminMeta(active.value.id, {
      status_code: editStatusCode.value,
    });

    const req = res?.request || res?.data || res;
    if (req) {
      active.value = {
        ...active.value,
        ...req,
      };
      editStatusCode.value = req?.status_code || editStatusCode.value;
    }

    const evt = res?.event;
    if (evt?.id) events.value.unshift(evt);

    alert("상태가 수정되었습니다.");
  } catch (e) {
    console.error(e);
    alert("상태 수정에 실패했습니다.");
  } finally {
    savingMeta.value = false;
  }
};

const updateRequestTypeOnly = async () => {
  if (!active.value?.id || !isAdmin.value) return;

  if (!editRequestType.value) {
    alert("업무유형을 선택해주세요.");
    return;
  }

  savingMeta.value = true;

  try {
    const res = await patchAdminMeta(active.value.id, {
      request_type: editRequestType.value,
    });

    const req = res?.request || res?.data || res;
    if (req) {
      active.value = {
        ...active.value,
        ...req,
      };
      editRequestType.value = req?.request_type || editRequestType.value;
    }

    const evt = res?.event;
    if (evt?.id) events.value.unshift(evt);

    alert("업무유형이 수정되었습니다.");
  } catch (e) {
    console.error(e);
    alert("업무유형 수정에 실패했습니다.");
  } finally {
    savingMeta.value = false;
  }
};

const updateAssigneeOnly = async () => {
  if (!active.value?.id || !isAdmin.value) return;

  savingMeta.value = true;

  try {
    const res = await patchAdminMeta(active.value.id, {
      assignee_code: editAssigneeCode.value,
    });

    const req = res?.request || res?.data || res;
    if (req) {
      active.value = {
        ...active.value,
        ...req,
      };
      editAssigneeCode.value = req?.assignee_code || "";
    }

    const evt = res?.event;
    if (evt?.id) events.value.unshift(evt);

    alert("업무담당자가 수정되었습니다.");
  } catch (e) {
    console.error(e);
    alert("업무담당자 수정에 실패했습니다.");
  } finally {
    savingMeta.value = false;
  }
};

const updateDueDateOnly = async () => {
  if (!active.value?.id || !isAdmin.value) return;

  if (!editDueDate.value) {
    alert("완료 예정일을 선택해주세요.");
    return;
  }

  savingMeta.value = true;

  try {
    const res = await patchAdminMeta(active.value.id, {
      due_date: editDueDate.value,
    });

    const req = res?.request || res?.data || res;

    if (req) {
      active.value = {
        ...active.value,
        ...req,
      };
      editDueDate.value = toDateInputValue(req?.due_date);
    }

    const evt = res?.event;
    if (evt?.id) {
      events.value.unshift(evt);
    }

    alert("완료 예정일이 수정되었습니다.");
  } catch (e) {
    console.error(e);
    alert("완료 예정일 수정에 실패했습니다.");
  } finally {
    savingMeta.value = false;
  }
};

const updatePlannedDateOnly = async () => {
  if (!active.value?.id || !isAdmin.value) return;

  savingMeta.value = true;

  try {
    const res = await patchAdminMeta(active.value.id, {
      planned_date: editPlannedDate.value || null,
    });

    const req = res?.request || res?.data || res;

    if (req) {
      active.value = {
        ...active.value,
        ...req,
      };
      editPlannedDate.value = toDateInputValue(req?.planned_date);
    }

    const evt = res?.event;
    if (evt?.id) {
      events.value.unshift(evt);
    }

    alert("완료일이 저장되었습니다.");
  } catch (e) {
    console.error(e);
    alert("완료일 저장에 실패했습니다.");
  } finally {
    savingMeta.value = false;
  }
};

const updateInternalMemoOnly = async () => {
  if (!active.value?.id || !isAdmin.value) return;

  savingMeta.value = true;

  try {
    const res = await patchAdminMeta(active.value.id, {
      internal_memo: editInternalMemo.value,
    });

    const req = res?.request || res?.data || res;

    if (req) {
      active.value = {
        ...active.value,
        ...req,
      };
      editInternalMemo.value = req?.internal_memo || "";
    }

    const evt = res?.event;
    if (evt?.id) {
      events.value.unshift(evt);
    }

    alert("관리자 메모가 저장되었습니다.");
  } catch (e) {
    console.error(e);
    alert("관리자 메모 저장에 실패했습니다.");
  } finally {
    savingMeta.value = false;
  }
};

const commentDisplayName = (c) => {
  if (c?.company_name || c?.name) {
    return [c.company_name, c.name].filter(Boolean).join(" / ");
  }
  if (c?.display_name) return c.display_name;
  if (c?.author_company || c?.author_name) {
    return [c.author_company, c.author_name].filter(Boolean).join(" / ");
  }
  return c?.author_role || "user";
};

const canDeleteComment = (c) => {
  if (!c) return false;
  if (me.value.role === "ADMIN") return true;
  if (me.value.userId && Number(c.user_id) === Number(me.value.userId)) return true;
  return false;
};

const deleteComment = async (commentId) => {
  if (!commentId) return;
  if (!confirm("이 댓글을 취소하시겠습니까?")) return;

  deletingCommentId.value = commentId;
  try {
    await removeCommentApi(commentId);

    comments.value = comments.value.map((c) =>
      c.id === commentId
        ? { ...c, is_deleted: 1, body: c.body || "" }
        : c
    );

    alert("댓글이 취소되었습니다.");
  } catch (e) {
    console.error(e);
    alert("댓글 취소에 실패했습니다.");
  } finally {
    deletingCommentId.value = null;
  }
};

const deleteRequest = async () => {
  if (!active.value?.id) return;
  if (!confirm("이 게시물을 삭제하시겠습니까?")) return;

  deletingRequest.value = true;
  try {
    await removeRequestApi(active.value.id);
    alert("게시물이 삭제되었습니다.");
    router.push("/w9/list");
  } catch (e) {
    console.error(e);
    alert("게시물 삭제에 실패했습니다.");
  } finally {
    deletingRequest.value = false;
  }
};

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

const prettySize = (n) => {
  const v = Number(n || 0);
  if (!v) return "-";
  if (v < 1024) return `${v} B`;
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(1)} KB`;
  if (v < 1024 * 1024 * 1024) return `${(v / (1024 * 1024)).toFixed(1)} MB`;
  return `${(v / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const resolveFileUrl = (f) => {
  if (f?.s3_key) {
    return `/api/task/files/view-by-key?key=${encodeURIComponent(f.s3_key)}`;
  }

  const url = String(f?.file_url || "");
  if (url.startsWith("http")) return url;
  return url || "#";
};

const detectPreviewMode = (mime, name) => {
  const lowerName = String(name || "").toLowerCase();
  const lowerMime = String(mime || "").toLowerCase();

  if (lowerMime.startsWith("image/")) return "image";
  if (lowerMime === "application/pdf") return "pdf";
  if (lowerName.endsWith(".pdf")) return "pdf";
  return "other";
};

const openFile = (f) => {
  const url = resolveFileUrl(f);
  const mode = detectPreviewMode(f?.mime_type, f?.original_name);

  if (mode === "image" || mode === "pdf") {
    previewUrl.value = url;
    previewName.value = f?.original_name || "첨부파일";
    previewMode.value = mode;
    previewOpen.value = true;
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

const downloadFile = (f) => {
  const url = resolveFileUrl(f);

  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.download = f?.original_name || "download";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const closePreview = () => {
  previewOpen.value = false;
  previewUrl.value = "";
  previewName.value = "";
  previewMode.value = "";
};

const onKeydown = (e) => {
  if (e.key === "Escape" && previewOpen.value) {
    closePreview();
  }
};

const eventMessage = (evt) => {
  if (!evt) return "";

  const raw = evt.payload;
  let obj = null;

  if (typeof raw === "string") {
    try {
      obj = JSON.parse(raw);
    } catch (e) {
      return raw;
    }
  } else if (raw && typeof raw === "object") {
    obj = raw;
  }

  if (!obj) return "";

  if (evt.event_type === "COMMENT_ADDED") {
    const name =
      obj.display_name ||
      [obj.company_name, obj.name].filter(Boolean).join(" / ") ||
      obj.author_role ||
      "user";
    const body = obj.body || "";
    return `${name}: ${body}`;
  }

  if (evt.event_type === "STATUS_CHANGED") {
    const from = obj.from || "-";
    const to = obj.to || "-";
    const by =
      obj.display_name ||
      [obj.company_name, obj.name].filter(Boolean).join(" / ") ||
      obj.changed_by ||
      "";
    return by ? `상태 변경: ${from} → ${to} (${by})` : `상태 변경: ${from} → ${to}`;
  }

  if (evt.event_type === "META_CHANGED") {
    const by = obj.display_name || obj.changed_by || "";
    return by ? `기본 정보 변경 (${by})` : "기본 정보 변경";
  }

  if (evt.event_type === "COMMENT_FILE_ATTACHED") {
    const name = obj.original_name || "첨부파일";
    return `댓글 파일 첨부: ${name}`;
  }

  return JSON.stringify(obj);
};

onMounted(async () => {
  decodeMe();
  window.addEventListener("keydown", onKeydown);
  await loadRequestTypeCodes();
  await loadAssigneeCodes();
  await loadStatusCodes();
  await loadDetail();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
.card {
  @apply w-full rounded-3xl bg-white shadow-sm ring-1 ring-slate-200;
}
.textarea {
  @apply w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100;
}
.btn-secondary {
  @apply inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50;
}
.btn-ghost {
  @apply inline-flex items-center justify-center rounded-2xl bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50;
}
.btn-submit {
  @apply inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50;
}
.btn-danger {
  @apply inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50;
}
.spinner {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 3px solid rgba(148, 163, 184, 0.35);
  border-top-color: rgba(15, 23, 42, 0.85);
  animation: spin 0.8s linear infinite;
}
.input-sm {
  @apply rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>