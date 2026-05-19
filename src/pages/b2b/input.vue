<template>
  <section class="min-h-screen bg-slate-50">
    <!-- 등록 중 오버레이 -->
    <div
      v-if="isSubmitting"
      class="fixed inset-0 z-[9999] grid place-items-center bg-black/30 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="w-[320px] rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <div class="flex items-center gap-3">
          <div class="spinner" />
          <div>
            <div class="text-sm font-bold text-slate-900">등록 중입니다...</div>
            <div class="mt-1 text-xs text-slate-500">
              {{ progressText }}
            </div>
          </div>
        </div>

        <div class="mt-4">
          <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div class="h-full bg-slate-900 transition-all" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>{{ doneCount }}/{{ totalCount }}</span>
            <span>{{ progressPercent }}%</span>
          </div>
        </div>

        <p class="mt-4 text-[11px] leading-5 text-slate-500">
          파일 업로드 및 저장이 끝날 때까지 창을 닫지 말아 주세요.
        </p>
      </div>
    </div>

    <div class="mx-auto w-full max-w-4xl px-4 py-10">
      <!-- 헤더 -->
      <div class="mb-6">
        <div
          class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200"
        >
          <span class="h-2 w-2 rounded-full bg-rose-500"></span>
          업무요청
        </div>

        <h1 class="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          업무요청 등록
        </h1>

        <p class="mt-2 text-sm leading-6 text-slate-600">
          아래 항목을 입력해 주시면 담당자가 확인 후 진행하겠습니다.
          <span class="font-semibold text-rose-600">*</span> 표시는 필수 입력 항목입니다.
        </p>
      </div>

      <!-- 상단 안내문 -->
      <div class="card mb-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-base font-bold text-slate-900">
              withon9 업무요청서 (CSR: Customer Service Request)
            </h2>
            <p class="mt-1 text-xs text-slate-500">
              요청 전 아래 기준을 확인해 주세요. 요청 정확도가 올라가면 처리 속도도 빨라집니다.
            </p>
          </div>

          <button
            type="button"
            class="btn-secondary"
            @click="guideOpen = !guideOpen"
          >
            {{ guideOpen ? "접기" : "열기" }}
          </button>
        </div>

        <div v-show="guideOpen" class="mt-4 space-y-4 text-sm leading-6 text-slate-700">
          <div>
            <div class="font-bold">1. 업무요청</div>
            <div class="mt-1 text-slate-600">
              요청희망일 Business Day 기준 (FBM + 1일, SPD + 2일, LTL + 3일 이내 진행 목표)
            </div>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-slate-600">
              <li>진행 결과는 고객별 재고관리 Sheet에 반영 후 Comments(댓글)로 전달</li>
              <li>
                진행사항 문의: 카카오톡(WITHON9) 또는 Email
                <span class="font-semibold text-slate-800">(withon9.inc@gmail.com)</span>
                → 카카오톡으로 업무요청 불가
              </li>
            </ul>
          </div>

          <div class="h-px w-full bg-slate-200"></div>

          <div>
            <div class="font-bold">2. 제품 입고</div>
            <div class="mt-1 text-slate-600">
              제품 발송 시 본 업무요청서로 제품발송 신청 및 반드시 <span class="font-semibold">Packing List</span> 첨부
            </div>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-slate-600">
              <li>수신자: 고객사명(withon9) - Ex. KOREACORP (withon9)</li>
              <li>수신자에 고객사명이 없을 경우, 제품 소유자 미상으로 보관이 어려워 1주일 후 폐기처분됩니다. (보상불가)</li>
              <li>Packing List 미전달 시, 재고실사로 인한 추가 작업비가 발생할 수 있습니다.</li>
            </ul>
          </div>

          <div class="h-px w-full bg-slate-200"></div>

          <div>
            <div class="font-bold">3. Amazon FBA</div>
            <div class="mt-1 text-slate-600">
              Shipping Label Print 사이즈(Thermal 또는 US Letter Only), FNSKU (US Letter 30 size)
            </div>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-slate-600">
              <li>Amazon SPD, LTL 요청 시 1) 제품명 2) FNSKU 3) Amazon SKU를 매칭하여 요청을 명확하게 전달해 주세요.</li>
              <li>Amazon LTL 요청 시 shipment 내용을 csv file로 download 받아서 첨부해 주세요.</li>
              <li>Amazon 협력사 선택: Ship from 주소가 미국 당사 주소로 지정되어야 선택 가능합니다.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 로그인 정보 표시 -->
      <div class="card mb-5">
        <div class="card-title">요청자 정보</div>
        <div class="card-body">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div class="text-xs font-semibold text-slate-500">회사명 / 담당자</div>
              <div class="mt-1 text-sm font-semibold text-slate-900">
                {{ requesterDisplay }}
              </div>
            </div>
            <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div class="text-xs font-semibold text-slate-500">이메일</div>
              <div class="mt-1 text-sm font-semibold text-slate-900">
                {{ requesterEmail || "-" }}
              </div>
            </div>
          </div>

          <p class="mt-3 text-xs text-slate-500">
            요청자 정보는 로그인된 회원 정보를 기준으로 자동 입력됩니다.
          </p>
        </div>
      </div>

      <!-- 폼 -->
      <form @submit.prevent="onSubmit" class="flex flex-col gap-5">
        <!-- 요청 유형 -->
        <div class="card">
          <div class="card-title">
            1. 요청 유형 <span class="text-rose-600">*</span>
          </div>
          <div class="card-body">
            <div class="relative">
              <select
                v-model="form.requestTypeCode"
                class="input pr-10"
                required
                :disabled="isSubmitting || loadingRequestTypes"
              >
                <option value="">선택해 주세요</option>
                <option
                  v-for="item in requestTypeOptions"
                  :key="item.code"
                  :value="item.code"
                >
                  {{ item.label }}
                </option>
              </select>
              <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▼</span>
            </div>

          </div>
        </div>

        <!-- 상세 -->
        <div class="card">
          <div class="card-title">
            2. 요청업무 / 품목 (구체적으로) <span class="text-rose-600">*</span>
          </div>

          <div class="card-body">
            <ClientOnly>
              <QuillEditor
                ref="editorRef"
                v-model:content="form.requestDetail"
                contentType="html"
                theme="snow"
                :toolbar="toolbarOptions"
                class="editor"
                :read-only="isSubmitting"
              />
            </ClientOnly>

            <div class="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{{ plainBodyLength }}자</span>
              <span>이미지는 본문에 직접 삽입하실 수 있습니다.</span>
            </div>
          </div>
        </div>

        <!-- 완료 희망일 -->
        <div class="card">
          <div class="card-title">
            3. 완료 희망일 (D+1 이상) <span class="text-rose-600">*</span>
          </div>
          <div class="card-body">
            <input
              v-model="form.dueDate"
              type="date"
              :min="minDate"
              class="input"
              required
              :disabled="isSubmitting"
            />
            <p class="mt-2 text-xs text-slate-500">
              최소 선택 가능일:
              <span class="font-semibold text-slate-700">{{ minDate }}</span>
            </p>
          </div>
        </div>

        <!-- 파일 첨부 -->
        <div class="card">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div class="card-title">4. 파일 첨부 (최대 10개)</div>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500">
                선택됨:
                <span class="font-semibold text-slate-700">{{ selectedFileCount }}</span>개
              </span>

              <button
                type="button"
                class="btn-secondary"
                :disabled="isSubmitting || attachments.length >= 10"
                @click="addFileSlot"
              >
                + 슬롯 추가
              </button>
            </div>
          </div>

          <div class="mt-4 space-y-3">
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
                      <span v-if="item.fileName" class="font-medium text-slate-700">{{ item.fileName }}</span>
                      <span v-else>선택된 파일이 없습니다.</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <label class="btn-primary cursor-pointer" :class="{ 'opacity-50 pointer-events-none': isSubmitting }">
                    파일 선택
                    <input
                      type="file"
                      class="hidden"
                      :disabled="isSubmitting"
                      @change="(e) => onPickFile(idx, e)"
                    />
                  </label>

                  <button type="button" class="btn-ghost" @click="clearFile(idx)" :disabled="isSubmitting">
                    초기화
                  </button>

                  <button
                    type="button"
                    class="btn-ghost"
                    @click="removeFileSlot(idx)"
                    :disabled="isSubmitting || attachments.length <= 1"
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
          

          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? "등록 중입니다..." : "요청 제출하기" }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();

/** 인증 */
const { user, hydrate, isAuthed } = useAuth();

/** 등록/업로드 진행 */
const isSubmitting = ref(false);
const phase = ref("idle");
const totalCount = ref(0);
const doneCount = ref(0);
const guideOpen = ref(false);

/** me 상세 정보 */
const meProfile = ref(null);

/** 진행 UI */
const progressPercent = computed(() => {
  if (totalCount.value <= 0) return 0;
  return Math.min(100, Math.round((doneCount.value / totalCount.value) * 100));
});

const progressText = computed(() => {
  if (phase.value === "creating") return "요청을 생성하고 있습니다.";
  if (phase.value === "uploading") return `파일 업로드 중입니다. (${doneCount.value}/${totalCount.value})`;
  if (phase.value === "saving") return "업로드 정보를 저장하고 있습니다.";
  if (phase.value === "done") return "마무리 중입니다.";
  return "처리 중입니다.";
});

/** 날짜 */
const minDate = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
});

/** 토큰 */
const getToken = () => (process.client ? sessionStorage.getItem("DDSP_AT") || "" : "");

/** JWT fallback */
const decodeJwtPayload = () => {
  try {
    const token = getToken();
    if (!token) return {};

    const parts = token.split(".");
    if (parts.length < 2) return {};

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );

    return JSON.parse(json);
  } catch (e) {
    console.error("JWT decode failed", e);
    return {};
  }
};

const tokenUser = computed(() => decodeJwtPayload());

/** 로그인 사용자 정보 */
const requesterEmail = computed(() => {
  return (
    meProfile.value?.email ||
    user.value?.email ||
    tokenUser.value?.email ||
    tokenUser.value?.user_email ||
    ""
  );
});

const requesterCompany = computed(() => {
  return (
    meProfile.value?.company_name ||
    meProfile.value?.companyName ||
    meProfile.value?.company ||
    user.value?.company_name ||
    user.value?.companyName ||
    user.value?.company ||
    tokenUser.value?.company_name ||
    tokenUser.value?.companyName ||
    tokenUser.value?.company ||
    ""
  );
});

const requesterName = computed(() => {
  return (
    meProfile.value?.name ||
    meProfile.value?.real_name ||
    meProfile.value?.realName ||
    meProfile.value?.username ||
    user.value?.name ||
    user.value?.real_name ||
    user.value?.realName ||
    user.value?.username ||
    tokenUser.value?.name ||
    tokenUser.value?.real_name ||
    tokenUser.value?.realName ||
    tokenUser.value?.username ||
    tokenUser.value?.sub ||
    ""
  );
});

const requesterDisplay = computed(() => {
  const company = String(requesterCompany.value || "").trim();
  const name = String(requesterName.value || "").trim();

  if (company && name) return `${company} / ${name}`;
  if (company) return company;
  if (name) return name;
  return "로그인 정보 없음";
});

/** 회원 상세 조회 */
const loadMyProfile = async () => {
  try {
    const token = getToken();
    if (!token) return;

    const res = await $fetch("/api/task/members/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    meProfile.value = res?.data || res || null;
  } catch (e) {
    console.error("loadMyProfile failed", e);
    meProfile.value = null;
  }
};

/** codes */
const requestTypeOptions = ref([]);
const statusCodeOptions = ref([]);
const loadingRequestTypes = ref(false);

/** 기본 상태 */
const defaultStatusCode = computed(() => {
  const requested =
    statusCodeOptions.value.find((item) => item.code === "REQUESTED") ||
    statusCodeOptions.value.find((item) => item.label === "업무요청");

  return requested?.code || statusCodeOptions.value[0]?.code || "";
});

const defaultStatusLabel = computed(() => {
  const found = statusCodeOptions.value.find((item) => item.code === defaultStatusCode.value);
  return found?.label || defaultStatusCode.value || "-";
});

/** 에디터 */
const editorRef = ref(null);

const toolbarOptions = [
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  ["clean"],
];

/** 폼 */
const form = reactive({
  requestTypeCode: "",
  requestDetail: "",
  dueDate: minDate.value,
});

const getPlainText = (html) => {
  return String(html || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};

const plainBodyLength = computed(() => getPlainText(form.requestDetail).length);

/** 첨부파일 */
const attachments = ref(
  Array.from({ length: 3 }, () => ({ file: null, fileName: "" }))
);

const selectedFileCount = computed(() => attachments.value.filter((a) => a.file).length);

const addFileSlot = () => {
  if (attachments.value.length >= 10) return;
  attachments.value.push({ file: null, fileName: "" });
};

const removeFileSlot = (idx) => {
  if (attachments.value.length <= 1) return;
  attachments.value.splice(idx, 1);
};

const onPickFile = (idx, e) => {
  const file = e?.target?.files?.[0] ?? null;
  attachments.value[idx].file = file;
  attachments.value[idx].fileName = file?.name ?? "";
  if (e?.target) e.target.value = "";
};

const clearFile = (idx) => {
  attachments.value[idx].file = null;
  attachments.value[idx].fileName = "";
};

/** 유효성 */
const validate = () => {
  if (!isAuthed.value) return "로그인이 필요합니다.";
  if (!form.requestTypeCode) return "요청 유형을 선택해 주세요.";
  if (!getPlainText(form.requestDetail)) return "요청 내용을 입력해 주세요.";
  if (!form.dueDate) return "완료 희망일을 선택해 주세요.";
  if (form.dueDate < minDate.value) {
    return `완료 희망일은 ${minDate.value} 이후로 선택해 주세요.`;
  }
  if (!defaultStatusCode.value) {
    return "기본 상태 코드를 불러오지 못했습니다.";
  }
  return "";
};

/** 코드 조회 */
const loadRequestTypeCodes = async () => {
  loadingRequestTypes.value = true;
  try {
    const res = await $fetch("/api/task/codes/request-types", {
      method: "GET",
    });
    const items = Array.isArray(res) ? res : res?.items || res?.data || [];
    requestTypeOptions.value = items;
  } catch (e) {
    console.error(e);
    requestTypeOptions.value = [];
  } finally {
    loadingRequestTypes.value = false;
  }
};

const loadStatusCodes = async () => {
  try {
    const res = await $fetch("/api/task/codes/status", {
      method: "GET",
    });
    const items = Array.isArray(res) ? res : res?.items || res?.data || [];
    statusCodeOptions.value = items;
  } catch (e) {
    console.error(e);
    statusCodeOptions.value = [];
  }
};

/** limiter */
function createLimiter(concurrency = 3) {
  let active = 0;
  const queue = [];

  const next = () => {
    if (active >= concurrency) return;
    const job = queue.shift();
    if (!job) return;
    active++;
    job()
      .catch(() => {})
      .finally(() => {
        active--;
        next();
      });
  };

  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push(() => fn().then(resolve).catch(reject));
      next();
    });
}

/** 파일 업로드 */
const uploadOneFile = async (file) => {
  const token = getToken();
  if (!token) throw new Error("로그인이 필요합니다.");

  const up = await $fetch("/api/task/upload-url", {
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
  const s3Key = up?.key || up?.s3_key || "";
  const fileUrl = up?.file_url || up?.public_url || up?.url_without_query || "";

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
    file_url: fileUrl || `s3://${s3Key}`,
    s3_key: s3Key,
    original_name: file.name,
    mime_type: file.type || "application/octet-stream",
    file_size: file.size,
  };
};

const uploadEditorImage = async (file) => {
  const token = getToken();
  if (!token) throw new Error("로그인이 필요합니다.");

  const up = await $fetch("/api/task/upload-url", {
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
  const key = up?.key || up?.s3_key || "";

  let fileUrl =
    up?.file_url ||
    up?.public_url ||
    up?.url_without_query ||
    "";

  if (!fileUrl && key) {
    const cfg = useRuntimeConfig();
    const base =
      cfg.public?.FILE_BASE ||
      cfg.public?.S3_PUBLIC_BASE ||
      "";

    if (base) {
      fileUrl = `${base}/${key}`;
    }
  }

  if (!uploadUrl) {
    throw new Error("이미지 업로드 URL 발급에 실패했습니다.");
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

  if (!fileUrl) {
    throw new Error("업로드된 이미지 URL을 찾지 못했습니다.");
  }

  return fileUrl;
};

const openImagePicker = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    try {
      isSubmitting.value = true;
      const imageUrl = await uploadEditorImage(file);

      const editor = editorRef.value?.getQuill?.();
      if (!editor) return;

      const range = editor.getSelection(true);
      const index = range ? range.index : editor.getLength();
      editor.insertEmbed(index, "image", imageUrl);
      editor.setSelection(index + 1);
    } catch (e) {
      console.error(e);
      alert(e?.message || "이미지 업로드에 실패했습니다.");
    } finally {
      isSubmitting.value = false;
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

/** 제출 */
const onSubmit = async () => {
  const msg = validate();
  if (msg) return alert(msg);

  const token = getToken();
  if (!token) return alert("로그인이 필요합니다.");

  isSubmitting.value = true;
  phase.value = "creating";
  totalCount.value = 0;
  doneCount.value = 0;

  try {
    const payload = {
      body: form.requestDetail,
      due_date: form.dueDate,
      request_type: form.requestTypeCode,
      status_code: defaultStatusCode.value,
      requester_email: requesterEmail.value || "",
      requester_name: requesterName.value || "",
      company_name: requesterCompany.value || "",
    };

    const created = await $fetch("/api/task/requests", {
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${token}` },
    });

    const requestId = created?.id;
    if (!requestId) throw new Error("Request id not returned");

    const filesToUpload = attachments.value
      .map((a, idx) => ({ ...a, idx }))
      .filter((a) => a.file);

    totalCount.value = filesToUpload.length || 1;
    doneCount.value = 0;

    if (filesToUpload.length > 0) {
      phase.value = "uploading";

      const limit = createLimiter(3);

      await Promise.all(
        filesToUpload.map((item) =>
          limit(async () => {
            const meta = await uploadOneFile(item.file);

            await $fetch(`/api/task/requests/${requestId}/files`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: {
                ...meta,
                sort_order: item.idx + 1,
              },
            });

            doneCount.value += 1;
          })
        )
      );
    }

    alert("요청이 등록되었습니다.");
    await router.push("/w9/list");
  } catch (e) {
    console.error(e);
    alert("등록에 실패했습니다. 콘솔을 확인해 주세요.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await hydrate();
  await Promise.all([loadMyProfile(), loadRequestTypeCodes(), loadStatusCodes()]);
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
  @apply w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:bg-slate-50 disabled:text-slate-400;
}
.textarea {
  @apply w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:bg-slate-50 disabled:text-slate-400;
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
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  border: 3px solid rgba(15, 23, 42, 0.15);
  border-top-color: rgba(15, 23, 42, 0.9);
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