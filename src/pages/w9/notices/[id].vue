<template>
  <section class="min-h-screen bg-slate-50">
    <div class="mx-auto w-full max-w-6xl px-4 py-10">
      <!-- 상단 -->
      <div class="mb-6 flex items-center justify-right gap-2">
        

        <div class="flex items-right w-full text-right gap-2">
          <button
            v-if="isAdmin"
            class="btn-secondary"
            @click="goList"
          >
            목록
          </button>
          <button
            v-if="isAdmin"
            class="btn-secondary"
            @click="goEdit"
          >
            수정
          </button>

          <button
            v-if="isAdmin"
            class="btn-primary"
            @click="deleteNotice"
          >
            삭제
          </button>
        </div>
      </div>

      <!-- 공지 카드 -->
      <div class="card p-6">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1"
                :class="notice?.is_pinned
                  ? 'bg-amber-50 text-amber-700 ring-amber-200'
                  : 'bg-slate-50 text-slate-600 ring-slate-200'"
              >
                {{ notice?.is_pinned ? "상단 고정" : "일반" }}
              </span>

              <div class="text-xs text-slate-500">
                {{ fmtDateTime(notice?.created_at) }}
              </div>
            </div>

            <h1 class="mt-3 text-xl font-bold text-slate-900 leading-snug">
              {{ notice?.title || "-" }}
            </h1>
          </div>
        </div>

          <div class="mt-5 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div
              class="notice-html text-sm leading-6 text-slate-800"
              v-html="notice?.body || ''"
            ></div>
          </div>

        <!-- 첨부파일 -->
        <div class="mt-5">
          <div class="text-sm font-bold text-slate-900">첨부파일</div>

          <div v-if="files.length" class="mt-2 space-y-2">
            <div
              v-for="f in files"
              :key="f.id"
              class="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-slate-200"
            >
              <div class="min-w-0">
                <div class="truncate font-semibold text-slate-800">
                  {{ f.original_name }}
                </div>
                <div class="text-slate-500">
                  {{ prettySize(f.file_size) }}
                  <span v-if="f.mime_type"> · {{ f.mime_type }}</span>
                </div>
              </div>

              <div class="flex gap-2">
                <button class="btn-ghost" @click="openFile(f)">
                  보기
                </button>

                <button class="btn-secondary" @click="downloadFile(f)">
                  다운로드
                </button>
              </div>
            </div>
          </div>

          <div v-else class="mt-2 text-xs text-slate-500">
            첨부파일이 없습니다.
          </div>
        </div>
      </div>

      <!-- 댓글 -->
      <div class="mt-6 space-y-4">
        <!-- 댓글 입력 -->
        <div class="card p-5">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-bold text-slate-900">댓글 등록</div>
              <p class="mt-1 text-xs text-slate-500">
                댓글은 로그인한 회원만 작성하실 수 있습니다.
              </p>
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
              :placeholder="hasToken ? '댓글을 입력해 주세요.' : '로그인 후 댓글 작성이 가능합니다.'"
              :disabled="!hasToken"
            ></textarea>

            <div class="mt-2 flex items-center justify-between">
              <div class="text-xs text-slate-500">
                {{ hasToken ? "저장 버튼을 눌러 등록해 주세요." : "먼저 로그인해 주세요." }}
              </div>

              <button
                class="btn-primary"
                @click="addComment"
                :disabled="savingComment || !hasToken || !newComment.trim()"
              >
                <span v-if="savingComment">저장 중...</span>
                <span v-else>댓글 저장</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 댓글 목록 -->
        <div class="card p-5">
          <div class="text-sm font-bold text-slate-900">댓글 목록</div>

          <div class="mt-3 max-h-[520px] space-y-2 overflow-auto">
            <div
              v-for="c in comments"
              :key="c.id"
              class="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="text-xs font-bold text-slate-700">
                  {{ c.display_name || "사용자" }}
                </div>

                <div class="flex items-center gap-2">
                  <div class="text-[11px] text-slate-500">
                    {{ fmtDateTime(c.created_at) }}
                  </div>

                  <button
                    v-if="canDeleteComment(c)"
                    class="btn-ghost"
                    @click="deleteComment(c.id)"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div class="mt-1 text-xs text-slate-700 leading-5 whitespace-pre-wrap">
                {{ c.body }}
              </div>
            </div>

            <div v-if="!comments.length" class="text-xs text-slate-500">
              등록된 댓글이 없습니다.
            </div>
          </div>
        </div>
      </div>

      <div v-if="errorMsg" class="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200">
        {{ errorMsg }}
      </div>
    </div>

    <!-- 미리보기 모달 -->
    <div
      v-if="previewOpen"
      class="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center"
      @click.self="closePreview"
    >
      <div class="w-[90%] max-w-5xl bg-white rounded-2xl overflow-hidden">
        <div class="flex justify-between items-center border-b px-4 py-2">
          <div class="text-sm font-bold truncate">
            {{ previewName }}
          </div>

          <button class="btn-secondary" @click="closePreview">
            닫기
          </button>
        </div>

        <div class="h-[80vh] bg-slate-100">
          <img
            v-if="previewMode === 'image'"
            :src="previewUrl"
            class="w-full h-full object-contain"
          />

          <iframe
            v-else-if="previewMode === 'pdf'"
            :src="previewUrl"
            class="w-full h-full"
          ></iframe>

          <div
            v-else
            class="w-full h-full flex items-center justify-center text-sm text-slate-500"
          >
            미리보기를 지원하지 않는 형식입니다.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const router = useRouter();
const route = useRoute();

const id = computed(() => String(route.params.id || ""));

const notice = ref<any>(null);
const files = ref<any[]>([]);
const comments = ref<any[]>([]);

const previewOpen = ref(false);
const previewUrl = ref("");
const previewName = ref("");
const previewMode = ref("");

const newComment = ref("");
const savingComment = ref(false);

const errorMsg = ref("");

const getToken = () =>
  process.client ? sessionStorage.getItem("DDSP_AT") || "" : "";

const hasToken = computed(() => !!getToken());

const decodePayload = () => {
  try {
    const token = getToken();
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length < 2) return null;

    return JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

const currentUserId = computed(() => {
  const payload = decodePayload();
  return Number(payload?.user_id || payload?.id || payload?.sub || null);
});

const currentUserRole = computed(() => {
  const payload = decodePayload();
  return String(payload?.role || payload?.user_role || "").toUpperCase();
});

const isAdmin = computed(() => currentUserRole.value === "ADMIN");

const goBack = () => router.push("/w9/notices");

const goEdit = () => {
  router.push(`/w9/notices/write?id=${id.value}`);
};

const goList = () => {
  router.push(`/w9/notices/`);
};

const fmtDateTime = (s: any) => {
  if (!s) return "-";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return String(s);
  return d.toLocaleString();
};

const prettySize = (n: any) => {
  const v = Number(n || 0);
  if (v < 1024) return `${v} B`;
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(1)} KB`;
  return `${(v / (1024 * 1024)).toFixed(1)} MB`;
};

const fetchFileUrl = async (fileId: number) => {
  const res: any = await $fetch(`/api/task/notices/files/${fileId}`);
  return res.url;
};

const detectPreviewMode = (mime: string, name: string) => {
  const lowerMime = String(mime || "").toLowerCase();
  const lowerName = String(name || "").toLowerCase();

  if (lowerMime.startsWith("image/")) return "image";
  if (lowerMime === "application/pdf" || lowerName.endsWith(".pdf")) return "pdf";
  return "other";
};

const openFile = async (f: any) => {
  try {
    const url = await fetchFileUrl(f.id);
    const mode = detectPreviewMode(f.mime_type, f.original_name);

    if (mode === "image" || mode === "pdf") {
      previewUrl.value = url;
      previewName.value = f.original_name;
      previewMode.value = mode;
      previewOpen.value = true;
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  } catch (e: any) {
    console.error(e);
    alert(e?.data?.detail || e?.message || "파일을 열지 못했습니다.");
  }
};

const downloadFile = async (f: any) => {
  try {
    const url = await fetchFileUrl(f.id);
    const a = document.createElement("a");
    a.href = url;
    a.download = f.original_name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (e: any) {
    console.error(e);
    alert(e?.data?.detail || e?.message || "파일을 다운로드하지 못했습니다.");
  }
};

const closePreview = () => {
  previewOpen.value = false;
  previewUrl.value = "";
  previewName.value = "";
  previewMode.value = "";
};

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape" && previewOpen.value) {
    closePreview();
  }
};

const canDeleteComment = (c: any) => {
  if (!hasToken.value) return false;
  if (isAdmin.value) return true;
  return Number(c.user_id) === Number(currentUserId.value);
};

const loadDetail = async () => {
  try {
    const res: any = await $fetch(`/api/task/notices/${id.value}`);
    notice.value = res.notice || res;
    files.value = res.files || notice.value.files || [];
  } catch (e: any) {
    console.error(e);
    errorMsg.value = e?.data?.detail || e?.message || "상세 정보를 불러오지 못했습니다.";
  }
};

const loadComments = async () => {
  try {
    const res: any = await $fetch(`/api/task/notices/${id.value}/comments`);
    comments.value = Array.isArray(res) ? res : [];
  } catch (e: any) {
    console.error(e);
    errorMsg.value = e?.data?.detail || e?.message || "댓글을 불러오지 못했습니다.";
  }
};

const addComment = async () => {
  const token = getToken();
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  const text = newComment.value.trim();
  if (!text) return;

  savingComment.value = true;
  try {
    const saved: any = await $fetch(`/api/task/notices/${id.value}/comments`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: { body: text },
    });

    comments.value.unshift(saved);
    newComment.value = "";
  } catch (e: any) {
    console.error(e);
    alert(e?.data?.detail || e?.message || "댓글 저장에 실패했습니다.");
  } finally {
    savingComment.value = false;
  }
};

const deleteComment = async (commentId: number) => {
  const token = getToken();
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  const ok = window.confirm("이 댓글을 삭제하시겠습니까?");
  if (!ok) return;

  try {
    await $fetch(`/api/task/notices/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    comments.value = comments.value.filter((c) => c.id !== commentId);
  } catch (e: any) {
    console.error(e);
    alert(e?.data?.detail || e?.message || "댓글 삭제에 실패했습니다.");
  }
};

const deleteNotice = async () => {
  const token = getToken();
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  const ok = window.confirm("이 게시물을 삭제하시겠습니까?");
  if (!ok) return;

  try {
    await $fetch(`/api/task/notices/admin/${id.value}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("게시물이 삭제되었습니다.");
    router.push("/w9/notices");
  } catch (e: any) {
    console.error(e);
    alert(e?.data?.detail || e?.message || "게시물 삭제에 실패했습니다.");
  }
};

onMounted(async () => {
  window.addEventListener("keydown", handleEsc);
  await loadDetail();
  await loadComments();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleEsc);
});
</script>

<style scoped>
.card {
  @apply w-full rounded-3xl bg-white shadow-sm ring-1 ring-slate-200;
}

.textarea {
  @apply w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100;
}

.btn-primary {
  @apply inline-flex items-center justify-center rounded-2xl bg-slate-900 text-white px-4 py-2 text-xs font-bold transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50;
}

.btn-secondary {
  @apply inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-xs font-bold ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50;
}

.btn-ghost {
  @apply inline-flex items-center justify-center rounded-2xl bg-white px-3 py-2 text-xs font-bold ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50;
}
</style>