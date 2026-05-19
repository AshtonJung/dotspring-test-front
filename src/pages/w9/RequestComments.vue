<template>
  <div class="space-y-5">
    <!-- 댓글 등록 -->
    <div class="card p-5">
      <div class="flex items-center justify-between gap-3">
        <div>
          <div class="text-sm font-bold text-slate-900">댓글 등록</div>
          <p class="mt-1 text-xs text-slate-500">
            처리 진행사항을 남기시면 히스토리로 추적하실 수 있습니다.
          </p>
        </div>

        <span class="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
          {{ comments.length }}개
        </span>
      </div>

      <div class="mt-3">
        <textarea
          :value="newComment"
          class="textarea"
          rows="4"
          placeholder="예) 첨부파일을 확인하였고, 오늘 중으로 반영 예정입니다."
          @input="$emit('update:newComment', $event.target.value)"
        ></textarea>

        <div class="mt-2 flex items-center justify-between gap-2">
          <div class="text-xs text-slate-500"></div>

          <button
            type="button"
            class="btn-submit"
            @click="$emit('submitComment')"
            :disabled="savingComment || !String(newComment || '').trim()"
          >
            <span v-if="savingComment" class="inline-flex items-center gap-2">
              <span class="spinner"></span>
              저장 중...
            </span>
            <span v-else>댓글 저장</span>
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
          class="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="text-xs font-bold text-slate-700">
              {{ commentDisplayName(c) }}
            </div>

            <div class="flex items-center gap-2">
              <div class="text-[11px] text-slate-500">{{ fmtDateTime(c.created_at) }}</div>

              <button
                v-if="canDeleteComment(c)"
                type="button"
                class="btn-ghost"
                @click="$emit('deleteComment', c.id)"
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
          아직 댓글이 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
  newComment: {
    type: String,
    default: "",
  },
  savingComment: {
    type: Boolean,
    default: false,
  },
  commentDisplayName: {
    type: Function,
    required: true,
  },
  canDeleteComment: {
    type: Function,
    required: true,
  },
  fmtDateTime: {
    type: Function,
    required: true,
  },
});

defineEmits(["update:newComment", "submitComment", "deleteComment"]);
</script>

<style scoped>
.card {
  @apply w-full rounded-3xl bg-white shadow-sm ring-1 ring-slate-200;
}
.textarea {
  @apply w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100;
}
.btn-ghost {
  @apply inline-flex items-center justify-center rounded-2xl bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50;
}
.btn-submit {
  @apply inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50;
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