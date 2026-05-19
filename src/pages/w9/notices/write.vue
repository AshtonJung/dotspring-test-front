<template>
  <section class="min-h-screen bg-slate-50">
    <!-- 저장 중 오버레이 -->
    <div
      v-if="saving"
      class="fixed inset-0 z-[9999] grid place-items-center bg-black/30 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="w-[320px] rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <div class="flex items-center gap-3">
          <div class="spinner" />
          <div>
            <div class="text-sm font-bold text-slate-900">
              {{ isEditMode ? "수정 중..." : "등록 중..." }}
            </div>
            <div class="mt-1 text-xs text-slate-500">
              공지사항과 첨부파일 정보를 저장하고 있습니다.
            </div>
          </div>
        </div>

        <p class="mt-4 text-[11px] leading-5 text-slate-500">
          저장이 끝날 때까지 창을 닫지 말아 주세요.
        </p>
      </div>
    </div>

    <div class="mx-auto w-full max-w-4xl px-4 py-10">
      <div class="mb-6">
        <div
          class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200"
        >
          <span class="h-2 w-2 rounded-full bg-indigo-500"></span>
          공지사항
        </div>

        <h1 class="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          {{ isEditMode ? "공지사항 수정" : "공지사항 글쓰기" }}
        </h1>

        <p class="mt-2 text-sm leading-6 text-slate-600">
          공지는 누구나 보실 수 있고, 댓글은 로그인한 회원만 작성하실 수 있습니다.
          <span class="text-rose-600 font-semibold">*</span> 표시는 필수 입력 항목입니다.
        </p>
      </div>

      <div
        v-if="guardMsg"
        class="mb-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200"
      >
        {{ guardMsg }}
      </div>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-5">
        <!-- 제목 -->
        <div class="card">
          <div class="card-title">
            제목 <span class="text-rose-600">*</span>
          </div>
          <div class="card-body">
            <input
              v-model.trim="form.title"
              type="text"
              placeholder="공지 제목을 입력해 주세요."
              class="input"
              required
              :disabled="!isAdmin || saving"
            />
          </div>
        </div>

        <!-- 내용 -->
        <div class="card">
          <div class="card-title">
            내용 <span class="text-rose-600">*</span>
          </div>

          <div class="card-body">
            <ClientOnly>
              <QuillEditor
                ref="editorRef"
                v-model:content="form.body"
                contentType="html"
                theme="snow"
                :toolbar="toolbarOptions"
                class="editor"
                :read-only="!isAdmin || saving"
              />
            </ClientOnly>

            <div class="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{{ plainBodyLength }}자</span>
              <span>이미지는 본문에 직접 삽입하실 수 있습니다.</span>
            </div>
          </div>
        </div>

        <!-- 옵션 -->
        <div class="card">
          <div class="card-title">옵션</div>
          <div class="card-body">
            <label class="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                id="pinned"
                type="checkbox"
                v-model="form.isPinned"
                :disabled="!isAdmin || saving"
              />
              <span>상단 고정(PIN)</span>
            </label>
          </div>
        </div>

        <!-- 파일 첨부 -->
        <div class="card">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div class="card-title">첨부파일 (최대 10개)</div>
              <p class="mt-1 text-xs text-slate-500">
                기존 첨부파일을 확인하거나 제거하실 수 있으며, 새 파일을 추가하여 최대 10개까지 첨부하실 수 있습니다.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500">
                전체:
                <span class="font-semibold text-slate-700">{{ totalFileCount }}</span>개
              </span>

              <button
                type="button"
                class="btn-secondary"
                :disabled="!isAdmin || saving || totalFileCount >= 10 || attachments.length >= 10"
                @click="addFileSlot"
              >
                + 파일 추가
              </button>
            </div>
          </div>

          <!-- 기존 첨부파일 -->
          <div v-if="isEditMode && existingFiles.length" class="mt-4 space-y-3">
            <div class="text-xs font-semibold text-slate-800">기존 첨부파일</div>

            <div
              v-for="(file, idx) in existingFiles"
              :key="file.id"
              class="rounded-2xl border border-slate-200 bg-white p-3"
            >
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 shadow-sm ring-1 ring-slate-200">
                    <span class="text-xs font-bold text-slate-700">
                      E{{ String(idx + 1).padStart(2, "0") }}
                    </span>
                  </div>

                  <div class="min-w-0">
                    <div class="truncate text-xs font-semibold text-slate-800">
                      {{ file.original_name }}
                    </div>
                    <div class="mt-0.5 text-xs text-slate-500">
                      {{ file.mime_type || "-" }}
                      <span v-if="file.file_size"> · {{ prettySize(file.file_size) }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    class="btn-ghost"
                    :disabled="saving"
                    @click="removeExistingFile(file.id)"
                  >
                    제거
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 새 첨부파일 -->
          <div class="mt-4 space-y-3">
            <div class="text-xs font-semibold text-slate-800">새 첨부파일</div>

            <div
              v-for="(item, idx) in attachments"
              :key="idx"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-3"
            >
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-3">
                  <div class="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                    <span class="text-xs font-bold text-slate-700">
                      {{ String(idx + 1).padStart(2, "0") }}
                    </span>
                  </div>

                  <div>
                    <div class="text-xs font-semibold text-slate-800">첨부파일 {{ idx + 1 }}</div>
                    <div class="mt-0.5 text-xs text-slate-500">
                      <span v-if="item.fileName" class="text-slate-700 font-medium">{{ item.fileName }}</span>
                      <span v-else>선택된 파일이 없습니다.</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <label
                    class="btn-primary cursor-pointer"
                    :class="{ 'opacity-50 pointer-events-none': !isAdmin || saving || totalFileCount >= 10 }"
                  >
                    파일 선택
                    <input
                      type="file"
                      class="hidden"
                      :disabled="!isAdmin || saving || totalFileCount >= 10"
                      @change="(e) => onPickFile(idx, e)"
                    />
                  </label>

                  <button
                    type="button"
                    class="btn-ghost"
                    @click="clearFile(idx)"
                    :disabled="!isAdmin || saving"
                  >
                    초기화
                  </button>

                  <button
                    type="button"
                    class="btn-ghost"
                    @click="removeFileSlot(idx)"
                    :disabled="!isAdmin || saving || attachments.length <= 1"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 제출 -->
        <div class="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs text-slate-500">
            제출하시면 제목, 내용, 상단 고정값과 첨부파일 정보가 저장됩니다.
          </p>

          <div class="flex gap-2">
            <button type="button" class="btn-secondary" @click="goList" :disabled="saving">
              취소
            </button>

            <button type="submit" class="btn-submit" :disabled="!isAdmin || saving">
              {{ saving ? (isEditMode ? "수정 중..." : "등록 중...") : (isEditMode ? "공지 수정" : "공지 등록") }}
            </button>
          </div>
        </div>

        <div
          v-if="errorMsg"
          class="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200"
        >
          {{ errorMsg }}
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const router = useRouter();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const noticeId = computed(() => String(route.query.id || ""));
const isEditMode = computed(() => !!noticeId.value);

const getToken = () => (process.client ? sessionStorage.getItem("DDSP_AT") || "" : "");

const isAdmin = ref(false);
const guardMsg = ref("");
const saving = ref(false);
const errorMsg = ref("");

const editorRef = ref<any>(null);

const form = reactive({
  title: "",
  body: "",
  isPinned: false,
});

const existingFiles = ref<any[]>([]);
const attachments = ref(
  Array.from({ length: 3 }, () => ({ file: null as File | null, fileName: "" }))
);

const selectedFileCount = computed(() => attachments.value.filter((a) => a.file).length);
const totalFileCount = computed(() => existingFiles.value.length + selectedFileCount.value);

const toolbarOptions = [
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  ["clean"],
];

const prettySize = (n: any) => {
  const v = Number(n || 0);
  if (!v) return "0 B";
  if (v < 1024) return `${v} B`;
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(1)} KB`;
  return `${(v / (1024 * 1024)).toFixed(1)} MB`;
};

const getPlainText = (html: string) => {
  return String(html || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};

const plainBodyLength = computed(() => getPlainText(form.body).length);

const addFileSlot = () => {
  if (attachments.value.length >= 10) return;
  if (totalFileCount.value >= 10) return;
  attachments.value.push({ file: null, fileName: "" });
};

const removeFileSlot = (idx: number) => {
  if (attachments.value.length <= 1) return;
  attachments.value.splice(idx, 1);
};

const onPickFile = (idx: number, e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input?.files?.[0] ?? null;

  if (file && !attachments.value[idx].file && totalFileCount.value >= 10) {
    alert("첨부파일은 최대 10개까지 가능합니다.");
    if (input) input.value = "";
    return;
  }

  attachments.value[idx].file = file;
  attachments.value[idx].fileName = file?.name ?? "";
  if (input) input.value = "";
};

const clearFile = (idx: number) => {
  attachments.value[idx].file = null;
  attachments.value[idx].fileName = "";
};

const removeExistingFile = (fileId: number) => {
  existingFiles.value = existingFiles.value.filter((f) => f.id !== fileId);
};

const decodeRole = () => {
  try {
    const token = getToken();
    if (!token) return "";

    const parts = token.split(".");
    if (parts.length < 2) return "";

    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    const payload = JSON.parse(
      decodeURIComponent(
        Array.prototype.map
          .call(json, (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );

    return String(payload?.role || payload?.user_role || "").toUpperCase();
  } catch {
    return "";
  }
};

const guard = () => {
  const token = getToken();
  if (!token) {
    isAdmin.value = false;
    guardMsg.value = "로그인이 필요합니다.";
    return;
  }

  const role = decodeRole();
  if (role !== "ADMIN") {
    isAdmin.value = false;
    guardMsg.value = "관리자만 작성 및 수정이 가능합니다.";
    return;
  }

  isAdmin.value = true;
  guardMsg.value = "";
};

const validate = () => {
  if (!form.title.trim()) return "제목을 입력해 주세요.";
  if (!getPlainText(form.body)) return "내용을 입력해 주세요.";
  if (totalFileCount.value > 10) return "첨부파일은 최대 10개까지 가능합니다.";
  return "";
};

const goList = () => router.push("/w9/notices");

const loadNoticeForEdit = async () => {
  if (!isEditMode.value) return;

  try {
    const res: any = await $fetch(`/api/task/notices/${noticeId.value}`, {
      method: "GET",
    });

    const data = res?.notice || res;

    form.title = data?.title || "";
    form.body = data?.body || "";
    form.isPinned = !!data?.is_pinned;
    existingFiles.value = Array.isArray(data?.files) ? data.files : [];
  } catch (e: any) {
    console.error(e);
    errorMsg.value = e?.data?.detail || e?.message || "공지 정보를 불러오지 못했습니다.";
  }
};

const buildFileUrlFromResponse = (up: any) => {
  let fileUrl =
    up?.file_url ||
    up?.public_url ||
    up?.url_without_query ||
    "";

  const key = up?.key || up?.s3_key || "";
  if (!fileUrl && key) {
    const base =
      runtimeConfig.public?.FILE_BASE ||
      runtimeConfig.public?.S3_PUBLIC_BASE ||
      "";

    if (base) {
      fileUrl = `${String(base).replace(/\/$/, "")}/${String(key).replace(/^\//, "")}`;
    }
  }

  return fileUrl;
};

const uploadOneFile = async (file: File) => {
  const token = getToken();
  if (!token) throw new Error("로그인이 필요합니다.");

  const up: any = await $fetch("/api/task/upload-url", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      filename: file.name,
      content_type: file.type || "application/octet-stream",
    },
  });

  console.log("file upload-url response:", up);

  const uploadUrl = up?.upload_url || up?.url;
  const s3Key = up?.key || up?.s3_key || "";
  const fileUrl = buildFileUrlFromResponse(up);

  if (!uploadUrl) {
    throw new Error("업로드 URL 발급에 실패했습니다.");
  }

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!putRes.ok) {
    const text = await putRes.text().catch(() => "");
    throw new Error(`S3 업로드에 실패했습니다: ${putRes.status} ${text}`);
  }

  return {
    file_url: fileUrl,
    s3_key: s3Key,
    original_name: file.name,
    mime_type: file.type || "application/octet-stream",
    file_size: file.size,
  };
};

const buildNoticeFiles = async () => {
  const metas = [];

  for (let i = 0; i < attachments.value.length; i++) {
    const item = attachments.value[i];
    if (!item.file) continue;

    const meta = await uploadOneFile(item.file);
    metas.push({
      ...meta,
      sort_order: i + 1,
    });
  }

  return metas;
};

const uploadEditorImage = async (file: File) => {
  const token = getToken();
  if (!token) throw new Error("로그인이 필요합니다.");

  const up: any = await $fetch("/api/task/upload-url", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      filename: file.name,
      content_type: file.type || "application/octet-stream",
    },
  });

  const uploadUrl = up?.upload_url || up?.url;
  if (!uploadUrl) {
    throw new Error("이미지 업로드 URL 발급에 실패했습니다.");
  }

  const key = up?.key || up?.s3_key || "";
  if (!key) {
    throw new Error("업로드 키를 찾지 못했습니다.");
  }

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!putRes.ok) {
    const text = await putRes.text().catch(() => "");
    throw new Error(`이미지 업로드에 실패했습니다: ${putRes.status} ${text}`);
  }

  // ✅ 본문에는 직접 S3 URL 대신 내부 view API 주소를 넣음
  return `/api/task/files/view-by-key?key=${encodeURIComponent(key)}`;
};

const openImagePicker = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    try {
      saving.value = true;
      const imageUrl = await uploadEditorImage(file);

      const editor = editorRef.value?.getQuill?.();
      if (!editor) return;

      const range = editor.getSelection(true);
      const index = range ? range.index : editor.getLength();

      editor.insertEmbed(index, "image", imageUrl);
      editor.setSelection(index + 1);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "이미지 업로드에 실패했습니다.");
    } finally {
      saving.value = false;
    }
  };

  input.click();
};

const bindQuillImageHandler = async () => {
  await nextTick();

  const quill = editorRef.value?.getQuill?.();
  if (!quill) return;

  const toolbar = quill.getModule("toolbar");
  if (!toolbar) return;

  toolbar.addHandler("image", () => {
    openImagePicker();
  });
};

const onSubmit = async () => {
  const msg = validate();
  if (msg) {
    alert(msg);
    return;
  }

  const token = getToken();
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  if (!isAdmin.value) {
    alert("관리자만 가능합니다.");
    return;
  }

  saving.value = true;
  errorMsg.value = "";

  try {
    const newFiles = await buildNoticeFiles();

    const remainExistingFiles = existingFiles.value.map((f: any, idx: number) => ({
      file_url: f.file_url || "",
      s3_key: f.s3_key || "",
      original_name: f.original_name,
      mime_type: f.mime_type || null,
      file_size: f.file_size || null,
      sort_order: idx + 1,
    }));

    const mergedFiles = [
      ...remainExistingFiles,
      ...newFiles.map((f: any, idx: number) => ({
        ...f,
        sort_order: remainExistingFiles.length + idx + 1,
      })),
    ];

    const payload: any = {
      title: form.title.trim(),
      body: form.body,
      is_pinned: form.isPinned,
      files: mergedFiles,
    };

    let saved: any;

    if (isEditMode.value) {
      saved = await $fetch(`/api/task/notices/admin/${noticeId.value}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });
    } else {
      saved = await $fetch(`/api/task/notices/admin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });
    }

    const savedId = saved?.id || saved?.notice?.id || noticeId.value;
    if (!savedId) {
      throw new Error("저장 응답에서 게시물 ID를 찾지 못했습니다.");
    }

    alert(isEditMode.value ? "공지사항이 수정되었습니다." : "공지사항이 등록되었습니다.");
    router.push(`/w9/notices/${savedId}`);
  } catch (e: any) {
    console.error(e);
    errorMsg.value =
      e?.data?.detail ||
      e?.message ||
      (isEditMode.value ? "공지 수정에 실패했습니다." : "공지 등록에 실패했습니다.");
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  guard();
  await loadNoticeForEdit();
  await bindQuillImageHandler();
});
</script>

<style scoped>
.card {
  @apply w-full rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200;
}
.card-title {
  @apply text-sm font-bold text-slate-900;
}
.card-body {
  @apply mt-3;
}
.input {
  @apply w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100;
}
.textarea {
  @apply w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100;
}
.btn-primary {
  @apply inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50;
}
.btn-secondary {
  @apply inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50;
}
.btn-ghost {
  @apply inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50;
}
.btn-submit {
  @apply inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50;
}
.spinner {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 3px solid rgba(148, 163, 184, 0.35);
  border-top-color: rgba(15, 23, 42, 0.85);
  animation: spin 0.8s linear infinite;
}
.editor {
  min-height: 260px;
}
:deep(.ql-toolbar.ql-snow) {
  border: 1px solid rgb(226 232 240);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}
:deep(.ql-container.ql-snow) {
  border: 1px solid rgb(226 232 240);
  border-top: 0;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  min-height: 220px;
  background: white;
}
:deep(.ql-editor) {
  min-height: 220px;
  font-size: 14px;
  color: rgb(15 23 42);
}
:deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>