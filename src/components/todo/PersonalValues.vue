<template>
  <div class="pv-wrap">
    <div
      v-for="item in values"
      :key="item.key"
      class="pv-item"
    >
      <span class="pv-label">{{ item.label }}</span>

      <!-- 보기 모드 -->
      <template v-if="editingKey !== item.key">
        <button
          type="button"
          class="pv-value"
          :class="item.value ? 'pv-value--filled' : 'pv-value--empty'"
          @click="startEdit(item)"
        >
          {{ item.value || '입력...' }}
        </button>
      </template>

      <!-- 편집 모드 -->
      <template v-else>
        <input
          :ref="(el) => { if (el) inputRefs[item.key] = el as HTMLInputElement }"
          v-model="editValue"
          type="text"
          class="pv-input"
          :placeholder="`${item.label} 입력`"
          @keydown.enter="saveEdit(item)"
          @keydown.escape="cancelEdit"
          @blur="saveEdit(item)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const STORAGE_KEY = 'woojooverse_personal_values'

const DEFAULTS = [
  { key: 'good_at',   label: '잘하는 것' },
  { key: 'love',      label: '좋아하는 것' },
  { key: 'want',      label: '하고싶은 것' },
]

function loadValues() {
  if (typeof window === 'undefined') return DEFAULTS.map((d) => ({ ...d, value: '' }))
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  return DEFAULTS.map((d) => ({ ...d, value: saved[d.key] ?? '' }))
}

const values = ref(loadValues())
const editingKey = ref<string | null>(null)
const editValue = ref('')
const inputRefs: Record<string, HTMLInputElement> = {}

function startEdit(item: { key: string; value: string }) {
  editingKey.value = item.key
  editValue.value = item.value
  nextTick(() => inputRefs[item.key]?.focus())
}

function saveEdit(item: { key: string }) {
  if (editingKey.value !== item.key) return
  const target = values.value.find((v) => v.key === item.key)
  if (target) target.value = editValue.value.trim()
  const saved: Record<string, string> = {}
  values.value.forEach((v) => { saved[v.key] = v.value })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  editingKey.value = null
  editValue.value = ''
}

function cancelEdit() {
  editingKey.value = null
  editValue.value = ''
}
</script>

<style scoped>
.pv-wrap {
  @apply flex gap-2 mb-2;
}

.pv-item {
  @apply flex flex-1 flex-col gap-0.5 rounded-xl px-2.5 py-2;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-width: 0;
}

.pv-label {
  @apply text-[9px] font-semibold uppercase tracking-widest truncate;
  color: rgba(255, 255, 255, 0.35);
}

.pv-value {
  @apply text-xs text-left truncate w-full bg-transparent border-none p-0 cursor-pointer transition;
  min-height: 18px;
}

.pv-value--filled {
  color: rgba(255, 255, 255, 0.82);
}

.pv-value--filled:hover {
  color: rgba(255, 255, 255, 1);
}

.pv-value--empty {
  color: rgba(255, 255, 255, 0.2);
}

.pv-value--empty:hover {
  color: rgba(255, 255, 255, 0.45);
}

.pv-input {
  @apply text-xs w-full bg-transparent border-none outline-none p-0;
  color: rgba(255, 255, 255, 0.92);
  min-height: 18px;
}

.pv-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}
</style>
