<template>
  <div class="weekly-goal-wrap">
    <!-- 헤더 -->
    <div class="weekly-goal-header">
      <button type="button" class="weekly-goal-toggle" @click="isFolded = !isFolded">
        <span class="weekly-goal-label">{{ weekLabel }}</span>
        <span class="weekly-goal-chevron" :class="{ 'is-folded': isFolded }">▾</span>
      </button>
      <button
        v-if="!isEditing && goalId && !isFolded"
        type="button"
        class="weekly-goal-edit-btn"
        title="목표 수정"
        @click="startEdit"
      >
        <Pencil :size="13" :stroke-width="2" />
      </button>
    </div>

    <Transition name="wg-collapse">
      <div v-if="!isFolded" class="mt-1.5">
        <!-- 보기 모드 -->
        <template v-if="!isEditing">
          <div
            class="weekly-goal-text"
            :class="goalText ? 'weekly-goal-text--filled' : 'weekly-goal-text--empty'"
            @click="startEdit"
          >
            <span v-if="goalText">{{ goalText }}</span>
            <span v-else class="weekly-goal-placeholder">✦ 이번 주 목표를 입력해보세요...</span>
          </div>
        </template>

        <!-- 편집 모드 -->
        <template v-else>
          <textarea
            ref="textareaRef"
            v-model="editText"
            class="weekly-goal-textarea"
            placeholder="이번 주 목표를 입력하세요..."
            rows="2"
            @input="autoResize"
            @keydown="onKeydown"
          />
          <div class="weekly-goal-actions">
            <button
              type="button"
              class="weekly-goal-btn weekly-goal-btn--save"
              :disabled="isSaving"
              @click="save"
            >
              <Check :size="13" :stroke-width="2.5" />
              <span>{{ isSaving ? '저장 중...' : '저장' }}</span>
            </button>
            <button
              type="button"
              class="weekly-goal-btn weekly-goal-btn--cancel"
              @click="cancelEdit"
            >
              <X :size="13" :stroke-width="2.5" />
              <span>취소</span>
            </button>
          </div>
          <div v-if="saveError" class="weekly-goal-error">{{ saveError }}</div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Pencil, Check, X } from 'lucide-vue-next'
import { useTodo } from '@/composables/useTodo'

const props = defineProps<{
  weekKey: string
  weekLabel: string
}>()

const emit = defineEmits<{
  saved: [goal: { id: number; text: string; weekKey: string }]
}>()

const { createItem, updateItem } = useTodo()

// 상태
const goalId = ref<number | null>(null)
const goalText = ref('')
const isEditing = ref(false)
const isFolded = ref(typeof window !== 'undefined' && localStorage.getItem('woojooverse_weekly_goal_folded') === '1')

watch(isFolded, (v) => {
  localStorage.setItem('woojooverse_weekly_goal_folded', v ? '1' : '0')
})
const editText = ref('')
const isSaving = ref(false)
const saveError = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// 목표 불러오기
async function loadGoal() {
  goalId.value = null
  goalText.value = ''
  try {
    const items = await $fetch<any[]>('/api/todo/weekly-goal', {
      params: { week: props.weekKey },
    })
    if (items.length > 0) {
      goalId.value = items[0].id
      goalText.value = items[0].text ?? ''
    }
  } catch {
    // 에러 시 빈 상태 유지
  }
}

// weekKey 변경 시 재로드
watch(() => props.weekKey, loadGoal, { immediate: true })

// 편집 시작
function startEdit() {
  editText.value = goalText.value
  isEditing.value = true
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
      autoResize()
    }
  })
}

// 편집 취소
function cancelEdit() {
  isEditing.value = false
  editText.value = ''
  saveError.value = ''
}

// textarea 자동 높이 조절
function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

// 키보드 단축키: Ctrl+Enter / Cmd+Enter 저장, Escape 취소
function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    save()
  }
  if (e.key === 'Escape') {
    cancelEdit()
  }
}

// 저장
async function save() {
  const text = editText.value.trim()
  if (!text) return
  isSaving.value = true
  try {
    let result: any
    if (goalId.value) {
      result = await updateItem(goalId.value, { text })
    } else {
      result = await createItem({
        type: 'weekly_goal',
        text,
        date_key: props.weekKey,
        done: false,
      })
    }
    goalId.value = result.id
    goalText.value = (result as any).text ?? text
    isEditing.value = false
    saveError.value = ''
    emit('saved', { id: result.id, text: goalText.value, weekKey: props.weekKey })
  } catch (err: any) {
    console.error('[WeeklyGoal] 저장 실패:', err)
    const detail = err?.data?.detail ?? err?.data?.message ?? err?.message ?? ''
    const status = err?.status ? ` (${err.status})` : ''
    saveError.value = detail ? `${detail}${status}` : `저장에 실패했습니다.${status}`
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.weekly-goal-wrap {
  @apply rounded-2xl border px-4 py-3;
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
}

.weekly-goal-header {
  @apply flex items-center justify-between;
}

.weekly-goal-toggle {
  @apply flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer transition;
}

.weekly-goal-toggle:hover .weekly-goal-label,
.weekly-goal-toggle:hover .weekly-goal-chevron {
  color: rgba(255, 255, 255, 0.7);
}

.weekly-goal-label {
  @apply text-[11px] font-semibold uppercase tracking-[0.12em];
  color: rgba(255, 255, 255, 0.45);
}

.weekly-goal-chevron {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  transition: transform 0.2s ease;
  display: inline-block;
}

.weekly-goal-chevron.is-folded {
  transform: rotate(-90deg);
}

.wg-collapse-enter-active,
.wg-collapse-leave-active {
  transition: opacity 0.2s ease, max-height 0.25s ease;
  max-height: 200px;
  overflow: hidden;
}

.wg-collapse-enter-from,
.wg-collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.wg-collapse-enter-to,
.wg-collapse-leave-from {
  @apply mt-1.5;
}

.weekly-goal-edit-btn {
  @apply flex h-6 w-6 items-center justify-center rounded-lg transition hover:bg-white/10;
  color: rgba(255, 255, 255, 0.45);
}

.weekly-goal-edit-btn:hover {
  color: rgba(255, 255, 255, 0.85);
}

.weekly-goal-text {
  @apply cursor-pointer rounded-xl px-1 py-1 text-sm leading-relaxed transition;
  min-height: 28px;
}

.weekly-goal-text--filled {
  color: rgba(255, 255, 255, 0.88);
}

.weekly-goal-text--filled:hover {
  background: rgba(255, 255, 255, 0.05);
}

.weekly-goal-text--empty {
  @apply cursor-pointer;
}

.weekly-goal-placeholder {
  @apply text-sm;
  color: rgba(255, 255, 255, 0.3);
}

.weekly-goal-textarea {
  @apply w-full resize-none rounded-xl px-3 py-2.5 text-sm leading-relaxed outline-none transition;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.92);
  min-height: 60px;
  overflow: hidden;
}

.weekly-goal-textarea:focus {
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
}

.weekly-goal-textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.weekly-goal-actions {
  @apply mt-2 flex items-center gap-2;
}

.weekly-goal-btn {
  @apply flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition;
}

.weekly-goal-btn--save {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.92);
}

.weekly-goal-btn--save:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.weekly-goal-btn--save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.weekly-goal-btn--cancel {
  color: rgba(255, 255, 255, 0.45);
}

.weekly-goal-btn--cancel:hover {
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.07);
}

.weekly-goal-error {
  @apply mt-1.5 rounded-lg px-2 py-1 text-xs;
  color: rgba(248, 113, 113, 0.9);
  background: rgba(248, 113, 113, 0.08);
}
</style>
