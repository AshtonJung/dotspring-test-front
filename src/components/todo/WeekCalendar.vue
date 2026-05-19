<template>
  <div>
    <!-- 주간 캘린더 -->
    <div class="mb-3">
      <!-- 상단: 화살표 + 달력 버튼 -->
      <div class="week-top-bar">
        <button type="button" class="week-nav-btn" @click="shiftWeek(-1)" aria-label="이전 주">
          <ChevronLeft :size="16" :stroke-width="2" />
        </button>
        <button type="button" class="calendar-open-btn" @click="showCalendarOverlay = true" aria-label="달력 열기">
          <CalendarDays :size="15" :stroke-width="1.8" />
          <span class="calendar-open-label">달력</span>
        </button>
        <button type="button" class="week-nav-btn" @click="shiftWeek(1)" aria-label="다음 주">
          <ChevronRight :size="16" :stroke-width="2" />
        </button>
      </div>

      <div
        class="week-strip"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <div class="week-days-viewport">
          <Transition :name="slideTransitionName" mode="out-in">
            <div :key="weekStartKey" class="week-days-row">
              <button
                v-for="day in weekDays"
                :key="day.key"
                type="button"
                class="week-day"
                :class="[
                  selectedDateKey === day.key ? 'week-day-selected' : '',
                  day.isToday ? 'week-day-today' : '',
                ]"
                @click="$emit('select', day.key)"
              >
                <!-- 여행 기간 블록 배경 -->
                <div
                  v-if="day.tripActive"
                  class="week-trip-block"
                  :class="{
                    'wtb-start': day.tripStart && !day.tripEnd,
                    'wtb-end':   day.tripEnd   && !day.tripStart,
                    'wtb-only':  day.tripStart && day.tripEnd,
                  }"
                ></div>
                <div class="week-label">{{ day.weekday }}</div>
                <div class="week-number" :class="day.isToday ? 'week-number-today' : ''">
                  {{ day.day }}
                </div>
                <div class="week-dot-wrap">
                  <span v-if="hasEventOnDate(day.key)" class="week-dot"></span>
                </div>
                <div class="week-weather-wrap">
                  <template v-if="weekWeather[day.key]">
                    <span class="material-icons-round week-weather-icon">{{ WEATHER_ICON_NAMES[weekWeather[day.key]!.iconType] ?? 'cloud' }}</span>
                    <span class="week-weather-temp">{{ weekWeather[day.key]!.max }}°</span>
                  </template>
                </div>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- 월간 캘린더 오버레이 -->
    <div v-if="showCalendarOverlay" class="calendar-overlay" @click.self="showCalendarOverlay = false">
      <div class="calendar-modal">
        <div class="calendar-modal-head">
          <div class="cal-nav-row">
            <button type="button" class="cal-nav-btn" @click="shiftYear(-1)" title="이전 해">
              <ChevronsLeft :size="18" :stroke-width="2" />
            </button>
            <button type="button" class="cal-nav-btn" @click="shiftMonth(-1)" title="이전 달">
              <ChevronLeft :size="18" :stroke-width="2" />
            </button>
            <div class="calendar-month-title">{{ currentMonthLabel }}</div>
            <button type="button" class="cal-nav-btn" @click="shiftMonth(1)" title="다음 달">
              <ChevronRight :size="18" :stroke-width="2" />
            </button>
            <button type="button" class="cal-nav-btn" @click="shiftYear(1)" title="다음 해">
              <ChevronsRight :size="18" :stroke-width="2" />
            </button>
          </div>
          <button type="button" class="calendar-close-btn" @click="showCalendarOverlay = false">
            ✕
          </button>
        </div>

        <div class="calendar-grid-head">
          <div v-for="name in weekNames" :key="name" class="calendar-grid-head-cell">
            {{ name }}
          </div>
        </div>

        <div class="calendar-grid">
          <button
            v-for="cell in monthCells"
            :key="cell.key"
            type="button"
            class="calendar-cell"
            :class="[
              cell.isCurrentMonth ? '' : 'calendar-cell-muted',
              cell.isSelected ? 'calendar-cell-selected' : '',
            ]"
            @click="pickDate(cell.key)"
          >
            <!-- 여행 기간 블록 배경 -->
            <div
              v-if="cell.tripActive"
              class="cal-trip-block"
              :class="{
                'ctb-start': cell.tripStart && !cell.tripEnd,
                'ctb-end':   cell.tripEnd   && !cell.tripStart,
                'ctb-only':  cell.tripStart && cell.tripEnd,
              }"
            ></div>
            <div class="calendar-cell-inner">
              <span class="calendar-cell-number" :class="cell.isToday ? 'calendar-cell-today' : ''">
                {{ cell.day }}
              </span>
              <span v-if="hasEventOnDate(cell.key)" class="calendar-cell-dot"></span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CalendarDays } from 'lucide-vue-next'

const WEATHER_ICON_NAMES: Record<string, string> = {
  'sun':              'wb_sunny',
  'cloud-sun':        'partly_cloudy_day',
  'cloudy':           'cloud',
  'cloud':            'cloud',
  'cloud-fog':        'foggy',
  'cloud-drizzle':    'grain',
  'cloud-rain':       'rainy',
  'cloud-snow':       'ac_unit',
  'cloud-lightning':  'thunderstorm',
}

type EventLike = { type: string; dateKey?: string }
type TripRange = { id?: number; startDateKey: string; endDateKey: string; city?: string }
type WeatherData = { iconType: string; label: string; max: number; min: number }

const props = defineProps<{
  selectedDateKey: string
  items: EventLike[]
  googleEventDates?: string[]
  trips?: TripRange[]
}>()

const emit = defineEmits<{
  select: [dateKey: string]
}>()

const weekNames = ['일', '월', '화', '수', '목', '금', '토']
const shortWeekNames = ['일', '월', '화', '수', '목', '금', '토']
const today = new Date()

const showCalendarOverlay = ref(false)
const overlayYear = ref(today.getFullYear())
const overlayMonth = ref(today.getMonth()) // 0-indexed

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') showCalendarOverlay.value = false
}

watch(showCalendarOverlay, (open) => {
  if (open) {
    overlayYear.value = selectedDate.value.getFullYear()
    overlayMonth.value = selectedDate.value.getMonth()
    window.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('keydown', onKeydown)
  }
})

function shiftMonth(delta: number) {
  let m = overlayMonth.value + delta
  let y = overlayYear.value
  if (m < 0) { m = 11; y-- }
  if (m > 11) { m = 0; y++ }
  overlayMonth.value = m
  overlayYear.value = y
}

function shiftYear(delta: number) {
  overlayYear.value += delta
}
const slideDirection = ref<'left' | 'right'>('left')
const slideTransitionName = computed(() => `week-slide-${slideDirection.value}`)

const selectedDate = computed(() => {
  const [y, m, d] = props.selectedDateKey.split('-').map(Number)
  return new Date(y, m - 1, d)
})

const currentMonthLabel = computed(() =>
  `${overlayYear.value}.${String(overlayMonth.value + 1).padStart(2, '0')}`
)

const weekDays = computed(() => {
  const base = new Date(selectedDate.value)
  const sunday = new Date(base)
  sunday.setDate(base.getDate() - base.getDay())

  return Array.from({ length: 7 }).map((_, i) => {
    const current = new Date(sunday)
    current.setDate(sunday.getDate() + i)
    const key = formatDateKey(current)
    const seg = tripSegment(key)
    return {
      key,
      weekday: shortWeekNames[current.getDay()],
      day: current.getDate(),
      isToday: isSameDate(current, today),
      tripActive: seg.active,
      tripStart: seg.isStart,
      tripEnd: seg.isEnd,
    }
  })
})

const weekStartKey = computed(() => weekDays.value[0]?.key ?? '')

const monthCells = computed(() => {
  const year = overlayYear.value
  const month = overlayMonth.value
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(year, month, 1 - firstDay.getDay())

  return Array.from({ length: 42 }).map((_, i) => {
    const current = new Date(startDate)
    current.setDate(startDate.getDate() + i)
    const key = formatDateKey(current)
    const seg = tripSegment(key)
    return {
      key,
      day: current.getDate(),
      isCurrentMonth: current.getMonth() === month,
      isToday: isSameDate(current, today),
      isSelected: key === props.selectedDateKey,
      tripActive: seg.active,
      tripStart: seg.isStart,
      tripEnd: seg.isEnd,
    }
  })
})

function formatDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function hasEventOnDate(dateKey: string) {
  return props.items.some((item) => item.type === 'event' && item.dateKey === dateKey)
    || (props.googleEventDates?.includes(dateKey) ?? false)
}

function tripSegment(dayKey: string): { active: boolean; isStart: boolean; isEnd: boolean } {
  const trips = props.trips ?? []
  for (const t of trips) {
    if (dayKey >= t.startDateKey && dayKey <= t.endDateKey) {
      return {
        active: true,
        isStart: dayKey === t.startDateKey,
        isEnd: dayKey === t.endDateKey,
      }
    }
  }
  return { active: false, isStart: false, isEnd: false }
}


function pickDate(key: string) {
  emit('select', key)
  showCalendarOverlay.value = false
}

function shiftWeek(direction: number) {
  slideDirection.value = direction > 0 ? 'left' : 'right'
  const base = new Date(selectedDate.value)
  const sunday = new Date(base)
  sunday.setDate(base.getDate() - base.getDay())
  if (direction > 0) {
    // 다음 주 첫 날 (일요일)
    const nextSunday = new Date(sunday)
    nextSunday.setDate(sunday.getDate() + 7)
    emit('select', formatDateKey(nextSunday))
  } else {
    // 이전 주 마지막 날 (토요일)
    const prevSaturday = new Date(sunday)
    prevSaturday.setDate(sunday.getDate() - 1)
    emit('select', formatDateKey(prevSaturday))
  }
}

// 날씨
const weekWeather = ref<Record<string, WeatherData>>({})
let weatherFetchSeq = 0  // race condition 방지

function tripCityForDay(dayKey: string): string | undefined {
  const trips = props.trips ?? []
  for (const t of trips) {
    if (dayKey >= t.startDateKey && dayKey <= t.endDateKey && t.city) {
      return t.city
    }
  }
  return undefined
}

async function fetchWeekWeather(days: typeof weekDays.value) {
  const seq = ++weatherFetchSeq
  const results: Record<string, WeatherData> = {}
  await Promise.all(
    days.map(async (day) => {
      const city = tripCityForDay(day.key)
      try {
        const params = city
          ? `city=${encodeURIComponent(city)}&date=${day.key}`
          : `date=${day.key}`
        const data = await $fetch<WeatherData | null>(`/api/weather?${params}`)
        if (data) results[day.key] = data
      } catch {}
    })
  )
  // 더 늦게 시작한 fetch가 먼저 끝난 이전 결과를 덮어쓰지 않도록
  if (seq === weatherFetchSeq) weekWeather.value = results
}

watch(
  [weekDays, () => props.trips],
  ([days]) => { fetchWeekWeather(days as typeof weekDays.value) },
  { immediate: true }
)

// 터치 스와이프
const touchStartX = ref(0)

function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0].clientX
}

function onTouchEnd(e: TouchEvent) {
  const delta = e.changedTouches[0].clientX - touchStartX.value
  if (Math.abs(delta) < 40) return
  shiftWeek(delta < 0 ? 1 : -1)
}
</script>

<style scoped>
.week-strip {
  @apply flex items-center rounded-2xl border;
  padding: 4px 2px;
  gap: 2px;
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.04);
  -webkit-tap-highlight-color: transparent;
}

.week-days-viewport {
  @apply flex-1 overflow-hidden;
}

.week-days-row {
  @apply flex;
}

.week-day {
  @apply flex flex-1 flex-col items-center justify-center rounded-xl transition-colors;
  padding: 4px 0;
  position: relative;
  min-width: 0;
  color: rgba(255, 255, 255, 0.88);
  -webkit-tap-highlight-color: transparent;
  overflow: visible;
}

.week-day:hover {
  background: rgba(255, 255, 255, 0.1);
}

.week-day-selected {
  background: rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.88);
}

.week-day-today {
  color: rgba(255, 255, 255, 0.98);
}

.week-label {
  @apply text-[10px] font-semibold uppercase;
  letter-spacing: 0.04em;
  position: relative;
  z-index: 1;
}

.week-number {
  @apply mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-[14px] font-semibold;
  position: relative;
  z-index: 1;
}

.week-number-today {
  background: #fff;
  color: #000 !important;
}

.week-dot-wrap {
  @apply mt-0.5 flex h-2 items-center justify-center;
  position: relative;
  z-index: 1;
}

.week-dot {
  @apply h-[6px] w-[6px] rounded-full;
  background: rgba(255, 255, 255, 0.85);
}

.week-weather-wrap {
  @apply mt-0.5 flex flex-col items-center;
  position: relative;
  z-index: 1;
  min-height: 24px;
}

.week-weather-icon {
  font-size: 14px !important;
  line-height: 1;
  color: rgba(255, 255, 255, 0.8);
}

.week-weather-temp {
  font-size: 8px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: -0.02em;
  margin-top: 1px;
}

/* 주간 — 여행 블록 */
.week-trip-block {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 0;
  right: 0;
  background: rgba(99, 179, 237, 0.18);
  border-radius: 0;
  z-index: 0;
  pointer-events: none;
}

.wtb-start {
  left: 50%;
  border-radius: 12px 0 0 12px;
}

.wtb-end {
  right: 50%;
  border-radius: 0 12px 12px 0;
}

.wtb-only {
  left: 10%;
  right: 10%;
  border-radius: 12px;
}

.week-nav-btn {
  @apply flex shrink-0 items-center justify-center rounded-lg border transition hover:bg-white/10;
  width: 36px;
  height: 32px;
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

.week-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  gap: 6px;
}

.calendar-open-btn {
  @apply flex flex-1 items-center justify-center gap-1 rounded-lg border transition hover:bg-white/10;
  padding: 4px 8px;
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

.calendar-open-label {
  font-size: 12px;
  font-weight: 500;
}

/* 슬라이드 애니메이션 */
.week-slide-left-enter-active,
.week-slide-left-leave-active,
.week-slide-right-enter-active,
.week-slide-right-leave-active {
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease;
}

.week-slide-left-enter-from {
  transform: translateX(24px);
  opacity: 0;
}
.week-slide-left-leave-to {
  transform: translateX(-24px);
  opacity: 0;
}

.week-slide-right-enter-from {
  transform: translateX(-24px);
  opacity: 0;
}
.week-slide-right-leave-to {
  transform: translateX(24px);
  opacity: 0;
}

.calendar-overlay {
  @apply fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 py-10;
}

.calendar-modal {
  @apply w-full max-w-[480px] rounded-[24px] border p-5;
  border-color: rgba(255, 255, 255, 0.1);
  background: black;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
}

.calendar-modal-head {
  @apply mb-5 flex items-center justify-between gap-4;
}

.cal-nav-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cal-nav-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
  transition: background 150ms, color 150ms;
  flex-shrink: 0;
}

.cal-nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.95);
}

.calendar-month-title {
  @apply text-[22px] font-semibold;
  color: rgba(255, 255, 255, 0.94);
  min-width: 96px;
  text-align: center;
}

.calendar-close-btn {
  @apply grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10;
  color: rgba(255, 255, 255, 0.78);
}

.calendar-grid-head {
  @apply mb-2 grid grid-cols-7 gap-1;
}

.calendar-grid-head-cell {
  @apply flex items-center justify-center text-xs font-semibold;
  color: rgba(255, 255, 255, 0.7);
}

.calendar-grid {
  @apply grid grid-cols-7;
  /* gap 없앰 — 여행 블록이 셀 경계를 넘어 연결되도록 */
}

.calendar-cell {
  @apply flex aspect-square items-center justify-center transition hover:bg-white/5;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  border-radius: 0;
  overflow: visible;
}

.calendar-cell-muted {
  opacity: 0.45;
}

.calendar-cell-selected {
  background: rgba(255, 255, 255, 0.08);
}

.calendar-cell-inner {
  @apply flex h-full w-full flex-col items-center justify-center;
  position: relative;
  z-index: 1;
}

.calendar-cell-number {
  @apply flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold;
  color: rgba(255, 255, 255, 0.9);
}

.calendar-cell-today {
  background: rgba(255, 255, 255, 0.92);
  color: #000;
}

.calendar-cell-dot {
  @apply mt-0.5 h-[5px] w-[5px] rounded-full;
  background: rgba(255, 255, 255, 0.9);
}

/* 월간 — 여행 블록 */
.cal-trip-block {
  position: absolute;
  top: 12%;
  bottom: 12%;
  left: 0;
  right: 0;
  background: rgba(99, 179, 237, 0.18);
  border-radius: 0;
  z-index: 0;
  pointer-events: none;
}

.ctb-start {
  left: 50%;
  border-radius: 50% 0 0 50%;
}

.ctb-end {
  right: 50%;
  border-radius: 0 50% 50% 0;
}

.ctb-only {
  left: 15%;
  right: 15%;
  border-radius: 50%;
}
</style>
