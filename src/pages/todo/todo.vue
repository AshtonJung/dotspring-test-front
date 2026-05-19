<template>
  <section class="page-root">

    <!-- 비행기 이동 애니메이션 -->
    <Transition name="plane-fade">
      <div v-if="showPlaneAnimation" class="plane-overlay">
        <div class="plane-wrap">
          <span class="plane-emoji">✈</span>
          <div class="plane-trail"></div>
        </div>
      </div>
    </Transition>

    <!-- 모바일 헤더 (fixed) -->
    <header class="mobile-header">
      <div class="mobile-header-inner">
        <div class="mobile-header-logo cursor-pointer" @click="router.push('/')">
          <img src="~/assets/img/logo.png" alt="woojooverse" class="w-14 h-14 object-contain" />
          <span class="mobile-header-brand">WOOJOOVERSE</span>
        </div>
        <button type="button" class="mobile-header-menu-btn" @click="sideMenuOpen = true" aria-label="메뉴">
          <span class="material-icons-round" style="font-size:24px">menu</span>
        </button>
      </div>
    </header>

    <!-- 사이드 메뉴 오버레이 -->
    <Transition name="side-overlay">
      <div v-if="sideMenuOpen && !sidebarPinned" class="side-overlay" @click="sideMenuOpen = false" />
    </Transition>

    <!-- 사이드 메뉴 -->
    <Transition name="side-menu">
      <div v-if="sideMenuOpen" class="side-menu">

        <div class="side-menu-head">
          <div class="flex items-center gap-2 cursor-pointer" @click="router.push('/')">
            <img src="~/assets/img/logo.png" alt="woojooverse" class="w-7 h-7 object-contain" />
            <span class="side-menu-brand">WOOJOOVERSE</span>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" class="side-pin-btn" :class="{ 'side-pin-btn-active': sidebarPinned }" @click="toggleSidebarPin" :title="sidebarPinned ? '사이드바 고정 해제' : '사이드바 고정'">
              <span class="material-icons-round" style="font-size:18px">{{ sidebarPinned ? 'push_pin' : 'push_pin' }}</span>
            </button>
            <button v-if="!sidebarPinned" type="button" class="side-close-btn" @click="sideMenuOpen = false">✕</button>
          </div>
        </div>
        <nav class="side-nav">
          <button type="button" class="side-nav-item" :class="{ 'side-nav-item-active': mainView === 'default' }" @click="switchMainView('default')">
            <span class="material-icons-round side-nav-icon">home</span>
            <span class="side-nav-label">홈</span>
            <span class="material-icons-round side-nav-arrow">chevron_right</span>
          </button>
          <button type="button" class="side-nav-item" :class="{ 'side-nav-item-active': mainView === 'schedule' }" @click="switchMainView('schedule')">
            <span class="material-icons-round side-nav-icon">calendar_month</span>
            <span class="side-nav-label">일정</span>
            <span class="material-icons-round side-nav-arrow">chevron_right</span>
          </button>
          <button type="button" class="side-nav-item" :class="{ 'side-nav-item-active': mainView === 'trips' }" @click="switchMainView('trips')">
            <span class="material-icons-round side-nav-icon">flight</span>
            <span class="side-nav-label">여행</span>
            <span class="material-icons-round side-nav-arrow">chevron_right</span>
          </button>
          <button type="button" class="side-nav-item" :class="{ 'side-nav-item-active': mainView === 'journals' }" @click="switchMainView('journals')">
            <span class="material-icons-round side-nav-icon">menu_book</span>
            <span class="side-nav-label">일기</span>
            <span class="material-icons-round side-nav-arrow">chevron_right</span>
          </button>
          <button type="button" class="side-nav-item" :class="{ 'side-nav-item-active': mainView === 'weekly_goals' }" @click="switchMainView('weekly_goals')">
            <span class="material-icons-round side-nav-icon">flag</span>
            <span class="side-nav-label">주간목표</span>
            <span class="material-icons-round side-nav-arrow">chevron_right</span>
          </button>
        </nav>
        <div class="side-divider" />
        <button type="button" class="side-nav-item" :class="{ 'side-nav-item-active': mainView === 'settings' }" @click="switchMainView('settings')">
          <span class="material-icons-round side-nav-icon">settings</span>
          <span class="side-nav-label">설정</span>
          <span class="material-icons-round side-nav-arrow">chevron_right</span>
        </button>
        <div class="side-divider" />
        <button type="button" class="side-logout-btn" @click="onLogout">로그아웃</button>

      </div>
    </Transition>

    <div class="content-wrap">

      <!-- ── 일정 / 여행 / 일기 메인 뷰 ── -->
      <template v-if="mainView !== 'default'">
        <div class="main-view-head">
          <button type="button" class="main-view-back" @click="mainView = 'default'">
            <span class="material-icons-round" style="font-size:20px;line-height:1">arrow_back</span>
          </button>
          <div class="main-view-title">
            {{ mainView === 'schedule' ? '일정' : mainView === 'trips' ? '여행' : mainView === 'weekly_goals' ? '주간목표' : mainView === 'settings' ? '설정' : '일기' }}
          </div>
        </div>

        <!-- 일정: Google 연동 + 캘린더 설정 -->
        <div v-if="mainView === 'schedule'" class="main-view-body">
          <div class="mv-section-label">연동 현황</div>
          <div class="side-item mb-4">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-white shrink-0">
                <img src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png" class="h-5 w-5" alt="Google Calendar" />
              </div>
              <div>
                <div class="side-item-title">Google 캘린더</div>
                <div class="side-item-desc">{{ isGoogleAuthed ? '연동됨' : '연동되지 않음' }}</div>
              </div>
            </div>
            <button v-if="!isGoogleAuthed" @click="loginWithGoogle" class="side-connect-btn">연동하기</button>
            <span v-else class="side-connected-badge">연동 중</span>
          </div>
          <template v-if="isGoogleAuthed && calendarList.length">
            <div class="mv-section-label">캘린더 표시 설정</div>
            <div class="space-y-2">
              <div v-for="cal in calendarList" :key="cal.id" class="side-cal-item">
                <span class="side-cal-dot" :style="{ background: cal.backgroundColor }"></span>
                <span class="side-cal-name">{{ cal.summary }}</span>
                <button
                  type="button"
                  class="side-cal-toggle"
                  :class="hiddenCalendarIds.includes(cal.id) ? 'toggle-off' : 'toggle-on'"
                  @click="toggleCalendar(cal.id)"
                >{{ hiddenCalendarIds.includes(cal.id) ? '숨김' : '표시' }}</button>
              </div>
            </div>
          </template>
        </div>

        <!-- 여행: 마소너리 타일 -->
        <div v-else-if="mainView === 'trips'" class="main-view-body">
          <div v-if="allTripsLoading" class="mv-empty">불러오는 중…</div>
          <div v-else-if="!allTrips.length" class="mv-empty">등록된 여행이 없습니다.</div>
          <div v-else class="masonry-grid">
            <button
              v-for="trip in allTrips"
              :key="trip.id"
              type="button"
              class="masonry-card trip-card"
              @click="navigateToTrip(trip)"
            >
              <div
                class="trip-card-thumb"
                :style="{ backgroundImage: `url(${trip.imageUrl || seaBg})` }"
              >
                <div class="trip-card-overlay">
                  <div class="trip-card-city">{{ trip.city }}</div>
                  <div class="trip-card-country">{{ trip.country }}</div>
                </div>
              </div>
              <div class="trip-card-info">
                <div class="trip-card-dates">{{ trip.startText }}{{ trip.endText ? ` ~ ${trip.endText}` : '' }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- 일기: 마소너리 타일 -->
        <div v-else-if="mainView === 'journals'" class="main-view-body">
          <div v-if="allJournalsLoading" class="mv-empty">불러오는 중…</div>
          <div v-else-if="!allJournals.length" class="mv-empty">작성된 일기가 없습니다.</div>
          <div v-else class="masonry-grid">
            <button
              v-for="j in allJournals"
              :key="j.id"
              type="button"
              class="masonry-card journal-card-tile"
              @click="navigateToJournal(j)"
            >
              <div class="journal-tile-date">{{ formatJournalDate(j.dateKey) }}</div>
              <div class="journal-tile-preview">{{ j.content.replace(/<[^>]*>/g, '').slice(0, 120) }}</div>
            </button>
          </div>
        </div>

        <!-- 주간목표 목록 -->
        <div v-else-if="mainView === 'weekly_goals'" class="main-view-body">
          <div v-if="allWeeklyGoalsLoading" class="mv-empty">불러오는 중…</div>
          <div v-else-if="!allWeeklyGoals.length" class="mv-empty">작성된 주간목표가 없습니다.</div>
          <div v-else class="weekly-goals-list">
            <div v-for="goal in allWeeklyGoals" :key="goal.id" class="wg-list-item" @click="navigateToWeekGoal(goal)">
              <div class="wg-list-week">{{ formatWeekLabel(goal.date_key) }}</div>
              <div class="wg-list-text">{{ goal.text }}</div>
            </div>
          </div>
        </div>

        <!-- 설정 -->
        <div v-else-if="mainView === 'settings'" class="main-view-body">
          <!-- 프로필 -->
          <div class="mv-section-label">프로필</div>

          <!-- 프로필 이미지 -->
          <div class="settings-profile-row">
            <div class="settings-avatar" :style="settingsImageUrl ? { backgroundImage: `url(${settingsImageUrl})` } : {}">
              <span v-if="!settingsImageUrl" class="material-icons-round" style="font-size:32px;color:rgba(255,255,255,0.3)">person</span>
            </div>
            <div class="settings-profile-info">
              <input
                type="file"
                ref="profileFileInput"
                accept="image/*"
                style="display:none"
                @change="onProfileImageSelected"
              />
              <button class="settings-btn-secondary" @click="profileFileInput?.click()">
                사진 변경
              </button>
            </div>
          </div>

          <!-- 이름 수정 -->
          <div class="settings-field">
            <div class="trip-field-label">이름</div>
            <div class="settings-input-row">
              <input v-model="settingsName" type="text" class="trip-input" placeholder="이름을 입력하세요" />
              <button class="settings-btn-primary" :disabled="settingsNameSaving" @click="saveSettingsName">
                {{ settingsNameSaving ? '저장 중…' : '저장' }}
              </button>
            </div>
          </div>

          <!-- 법적 정보 -->
          <div class="mv-section-label" style="margin-top:24px">법적 정보</div>
          <div class="settings-legal-list">
            <button class="settings-legal-item" @click="showLegal('terms')">
              <span>이용약관</span>
              <span class="material-icons-round" style="font-size:16px;opacity:0.4">chevron_right</span>
            </button>
            <button class="settings-legal-item" @click="showLegal('privacy')">
              <span>개인정보 처리방침</span>
              <span class="material-icons-round" style="font-size:16px;opacity:0.4">chevron_right</span>
            </button>
          </div>
        </div>
      </template>

      <!-- ── 기본 뷰 ── -->
      <template v-else>

      <!-- 구글 연동 배너 (미연동 시에만 표시) -->
      <div v-if="!isGoogleAuthed" class="google-banner">
        <div class="flex items-center gap-3 min-w-0">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
            <img src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png" class="h-5 w-5" alt="Google Calendar" />
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold truncate">구글 캘린더와 연동해 보세요</div>
            <div class="text-xs text-white/65 truncate">메모 사이에서 일정을 확인할 수 있습니다.</div>
          </div>
        </div>
        <button @click="loginWithGoogle" class="shrink-0 rounded-xl bg-white px-3 py-1.5 text-sm font-bold text-black transition hover:bg-white/90">
          연동하기
        </button>
      </div>

      <!-- 상단 캘린더 (sticky) -->
      <div class="week-calendar-sticky">
        <!-- <PersonalValues /> -->
        <WeekCalendar
          :selectedDateKey="selectedDateKey"
          :items="items"
          :googleEventDates="googleEventDates"
          :trips="allTripsData"
          @select="onSelectDate"
        />
      </div>

      <!-- 주간 목표 -->
      <WeeklyGoal :weekKey="weekKey" :weekLabel="weekLabel" />

      <!-- 앞으로의 여행 스트립 -->
      <div v-if="upcomingTrips.length" class="upcoming-trips-strip">
        <button type="button" class="upcoming-strip-label" @click="upcomingFolded = !upcomingFolded">
          <span>앞으로의 여행</span>
          <span class="upcoming-strip-chevron" :class="{ 'is-folded': upcomingFolded }">▾</span>
        </button>
        <Transition name="upcoming-collapse">
          <div v-if="!upcomingFolded" class="upcoming-trips-scroll">
            <button
              v-for="trip in upcomingTrips"
              :key="trip.id"
              type="button"
              class="upcoming-trip-card"
              @click="navigateToTrip(trip)"
            >
              <div
                class="upcoming-trip-img"
                :style="{ backgroundImage: `url(${trip.imageUrl || seaBg})` }"
              >
                <div class="upcoming-trip-overlay">
                  <div class="upcoming-trip-city">{{ trip.city }}</div>
                  <div class="upcoming-trip-date">{{ trip.startText }}</div>
                </div>
              </div>
            </button>
          </div>
        </Transition>
      </div>

      <!-- 여행 등록 팝업 -->
      <div v-if="showTripPopup" class="calendar-overlay" @click.self="closeTripPopup">
        <div class="trip-modal">
          <!-- 히어로 이미지 -->
          <div class="trip-hero-banner" :style="{ backgroundImage: `url(${tripDraft.imageUrl || seaBg})` }">
            <div class="trip-hero-banner-overlay">
              <div class="trip-hero-banner-city">{{ tripDraft.city || '어느 도시로 떠나시나요?' }}</div>
              <div v-if="tripDraft.startText" class="trip-hero-banner-date">
                {{ tripDraft.startText }}{{ tripDraft.endText ? ` → ${tripDraft.endText}` : '' }}
              </div>
            </div>
            <button type="button" class="trip-hero-close" @click="closeTripPopup">✕</button>
          </div>

          <!-- 폼 -->
          <div class="trip-modal-body">
            <div class="trip-form-grid">
              <!-- 도시 자동완성 -->
              <div class="trip-city-wrap">
                <div class="trip-field-label">도시</div>
                <input
                  v-model="tripDraft.city"
                  type="text"
                  class="trip-input"
                  placeholder="예: 시애틀"
                  autocomplete="off"
                  @input="onCityInput"
                  @blur="hideCitySuggestions"
                  @keydown.down.prevent="cityNavIndex = Math.min(cityNavIndex + 1, citySuggestions.length - 1)"
                  @keydown.up.prevent="cityNavIndex = Math.max(cityNavIndex - 1, 0)"
                  @keydown.enter.prevent="selectCitySuggestion(citySuggestions[cityNavIndex])"
                  @keydown.escape="showCitySuggestions = false"
                />
                <div v-if="showCitySuggestions && citySuggestions.length" class="city-suggestions">
                  <button
                    v-for="(city, i) in citySuggestions"
                    :key="city.name"
                    type="button"
                    class="city-suggestion-item"
                    :class="{ 'city-suggestion-active': i === cityNavIndex }"
                    @mousedown.prevent="selectCitySuggestion(city)"
                  >
                    <img :src="city.imageUrl" class="city-suggestion-img" :alt="city.name" />
                    <div class="city-suggestion-text">
                      <div class="city-suggestion-name">{{ city.nameKo }}</div>
                      <div class="city-suggestion-country">{{ city.countryKo }}</div>
                    </div>
                  </button>
                </div>
              </div>
              <div>
                <div class="trip-field-label">국가</div>
                <input v-model="tripDraft.country" type="text" class="trip-input" placeholder="예: 미국" />
              </div>
              <div>
                <div class="trip-field-label">시작일</div>
                <input v-model="tripDraft.startText" type="text" class="trip-input" placeholder="예: 6월 10일"
                  @focus="onTripDateInputFocus('start')"
                  @input="syncTripDatePartsFromText"
                  @blur="syncTripDatePartsFromText" />
              </div>
              <div>
                <div class="trip-field-label">종료일</div>
                <input v-model="tripDraft.endText" type="text" class="trip-input" placeholder="예: 6월 20일"
                  @focus="onTripDateInputFocus('end')"
                  @input="syncTripDatePartsFromText"
                  @blur="syncTripDatePartsFromText" />
              </div>
            </div>

            <!-- 날짜 범위 캘린더 -->
            <div v-if="showTripDatePicker" class="trip-date-picker">
              <div class="trip-date-picker-head">
                <button type="button" class="trip-picker-nav" @click="shiftTripPickerMonth(-1)"><ChevronLeft :size="16" /></button>
                <span class="trip-picker-month">{{ tripPickerMonthLabel }}</span>
                <button type="button" class="trip-picker-nav" @click="shiftTripPickerMonth(1)"><ChevronRight :size="16" /></button>
                <button type="button" class="trip-picker-close" @click="showTripDatePicker = false">✕</button>
              </div>
              <div class="trip-picker-weeknames">
                <div v-for="n in tripPickerWeekNames" :key="n" class="trip-picker-weekname">{{ n }}</div>
              </div>
              <div class="trip-picker-grid">
                <button
                  v-for="cell in tripPickerCells"
                  :key="cell.key"
                  type="button"
                  class="trip-picker-cell"
                  :class="{
                    'tp-muted': !cell.isCurrentMonth,
                    'tp-today': cell.isToday,
                    'tp-start': cell.isStart,
                    'tp-end': cell.isEnd,
                    'tp-in-range': cell.isInRange,
                  }"
                  @click="pickTripDate(cell.key)"
                >{{ cell.day }}</button>
              </div>
              <div v-if="tripPickingStart" class="trip-picker-hint">
                <span v-if="!tripPickingEnd">{{ tripPickingStart.slice(5).replace('-', '/') }} 선택됨 → 종료일을 선택하세요</span>
                <span v-else>{{ tripPickingStart.slice(5).replace('-', '/') }} ~ {{ tripPickingEnd.slice(5).replace('-', '/') }}</span>
              </div>
            </div>

            <div class="trip-action-row">
              <button type="button" class="trip-btn trip-btn-cancel" @click="closeTripPopup">취소</button>
              <button type="button" class="trip-btn trip-btn-confirm" @click="confirmTrip">등록</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 캘린더 선택 모달 -->
      <div v-if="showCalendarPicker" class="calendar-overlay" @click.self="showCalendarPicker = false">
        <div class="trip-modal" style="max-width:420px">
          <div class="trip-modal-head">
            <div>
              <div class="trip-modal-title">어느 캘린더에 저장할까요?</div>
              <div class="trip-modal-subtitle">{{ pendingEvent?.title }}</div>
            </div>
            <button type="button" class="calendar-close-btn" @click="showCalendarPicker = false">✕</button>
          </div>

          <div class="mb-4 grid grid-cols-2 gap-3">
            <div>
              <div class="trip-field-label">시작 시간 (선택)</div>
              <input v-model="pickerStartTime" type="time" class="trip-input" />
            </div>
            <div>
              <div class="trip-field-label">종료 시간 (선택)</div>
              <input v-model="pickerEndTime" type="time" class="trip-input" />
            </div>
          </div>

          <div class="space-y-2">
            <button
              v-for="cal in sortedCalendarList"
              :key="cal.id"
              @click="saveEventToCalendar(cal.id)"
              class="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition hover:bg-white/5"
              :style="cal.id === lastCalendarId
                ? 'border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04)'
                : 'border-color: rgba(255,255,255,0.1)'"
            >
              <span class="h-3 w-3 shrink-0 rounded-full" :style="{ background: cal.backgroundColor }"></span>
              <span class="text-sm text-white/90">{{ cal.summary }}</span>
              <span v-if="cal.id === lastCalendarId" class="ml-auto text-xs font-medium" style="color: rgba(255,255,255,0.5)">마지막 사용</span>
              <span v-else-if="cal.primary" class="ml-auto text-xs text-white/40">기본</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 투두리스트 -->
      <TodoList
        :selectedDate="selectedDate"
        :selectedDateKey="selectedDateKey"
        :items="items"
        :calendarEvents="todayGoogleEvents"
        :activeTripsForSelectedDate="activeTripsForSelectedDate"
        :activeTripForSelectedDate="activeTripForSelectedDate"
        :tripHeroStyle="tripHeroStyle"
        @open-trip-popup="openTripPopup"
        @item-created="onItemCreated"
        @item-updated="onItemUpdated"
        @item-deleted="onItemDeleted"
        @items-reordered="onItemsReordered"
        @delete-calendar-event="deleteGoogleEvent"
        @jump-to-date="onSelectDate"
        @copy-yesterday-todos="copyYesterdayTodos"
      />

      </template>
      <!-- /기본 뷰 -->

      <!-- 법적 정보 모달 -->
      <div v-if="legalModal" class="calendar-overlay" @click.self="legalModal = null">
        <div class="trip-modal" style="max-width:520px; max-height:80vh; overflow-y:auto; padding:24px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <div style="font-size:18px;font-weight:700;color:rgba(255,255,255,0.95)">
              {{ legalModal === 'terms' ? '이용약관' : '개인정보 처리방침' }}
            </div>
            <button @click="legalModal = null" class="calendar-close-btn">✕</button>
          </div>
          <div style="font-size:13px;line-height:1.8;color:rgba(255,255,255,0.65);white-space:pre-wrap">{{ legalModal === 'terms' ? termsText : privacyText }}</div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

import { computed, ref, onMounted, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import seaBg from '@/assets/img/sea_bg.png'
import WeekCalendar from '@/components/todo/WeekCalendar.vue'
import PersonalValues from '@/components/todo/PersonalValues.vue'
import WeeklyGoal from '@/components/todo/WeeklyGoal.vue'
import TodoList from '@/components/todo/TodoList.vue'
import { useTodo } from '@/composables/useTodo'
import type { ItemBlock } from '@/composables/useTodo'
import { useAuth } from '@/composables/useAuth'
import { searchCities, CITIES } from '@/data/cities'
import type { CityData } from '@/data/cities'

const googleToken = useCookie('GOOGLE_AT')
const isGoogleAuthed = computed(() => !!googleToken.value)

const sidebarPinned = ref(typeof window !== 'undefined' && localStorage.getItem('woojooverse_sidebar_pinned') === '1')
const sideMenuOpen = ref(typeof window !== 'undefined' && localStorage.getItem('woojooverse_sidebar_pinned') === '1')
const sideMenuView = ref<'main'>('main')
const mainView = ref<'default' | 'schedule' | 'trips' | 'journals' | 'weekly_goals' | 'settings'>('default')

const hiddenCalendarIds = ref<string[]>(
  typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('woojooverse_hidden_cals') || '[]')
    : []
)

const allTripsData = ref<any[]>([])
const allTrips = ref<any[]>([])
const allTripsLoading = ref(false)
const allJournals = ref<any[]>([])
const allJournalsLoading = ref(false)
const allWeeklyGoals = ref<any[]>([])
const allWeeklyGoalsLoading = ref(false)

const upcomingFolded = ref(typeof window !== 'undefined' && localStorage.getItem('woojooverse_upcoming_folded') === '1')

watch(upcomingFolded, (v) => {
  localStorage.setItem('woojooverse_upcoming_folded', v ? '1' : '0')
})

const upcomingTrips = computed(() => {
  const refKey = selectedDateKey.value || formatDateKey(new Date())
  return allTripsData.value
    .filter((t: any) => t.startDateKey > refKey)   // 선택된 날짜 기준 — 여행 시작 당일부터 사라짐
    .sort((a: any, b: any) => a.startDateKey.localeCompare(b.startDateKey))
    .slice(0, 12)
})

watch(sideMenuOpen, (open) => {
  if (!open) setTimeout(() => { sideMenuView.value = 'main' }, 250)
})

function toggleSidebarPin() {
  sidebarPinned.value = !sidebarPinned.value
  localStorage.setItem('woojooverse_sidebar_pinned', sidebarPinned.value ? '1' : '0')
  if (sidebarPinned.value) sideMenuOpen.value = true
}

function toggleCalendar(calId: string) {
  const idx = hiddenCalendarIds.value.indexOf(calId)
  if (idx >= 0) hiddenCalendarIds.value.splice(idx, 1)
  else hiddenCalendarIds.value.push(calId)
  localStorage.setItem('woojooverse_hidden_cals', JSON.stringify(hiddenCalendarIds.value))
}

function mapTripItem(item: any) {
  return {
    id: item.id,
    city: item.trip_city || '',
    country: item.trip_country || '',
    startDateKey: item.trip_start_key || '',
    endDateKey: item.trip_end_key || '',
    startText: item.trip_start_text || '',
    endText: item.trip_end_text || '',
    imageUrl: item.trip_image_url || '',
  }
}

async function loadAllTripsData() {
  try {
    const res = await fetchTrips()
    allTripsData.value = res.map(mapTripItem)
  } catch { allTripsData.value = [] }
}

async function switchMainView(view: 'default' | 'schedule' | 'trips' | 'journals' | 'weekly_goals' | 'settings') {
  mainView.value = view
  if (!sidebarPinned.value) sideMenuOpen.value = false

  if (view === 'trips') {
    allTripsLoading.value = true
    allTrips.value = []
    try {
      if (allTripsData.value.length) {
        allTrips.value = [...allTripsData.value].sort((a, b) => a.startDateKey.localeCompare(b.startDateKey))
      } else {
        await loadAllTripsData()
        allTrips.value = [...allTripsData.value].sort((a, b) => a.startDateKey.localeCompare(b.startDateKey))
      }
    } catch { allTrips.value = [] }
    finally { allTripsLoading.value = false }
  }
  if (view === 'journals') {
    allJournalsLoading.value = true
    allJournals.value = []
    try {
      const res: any[] = await ($fetch as any)('/api/todo/journals')
      allJournals.value = res
        .map((item: any) => ({ id: item.id, dateKey: item.date_key || '', content: item.journal_content || '' }))
        .sort((a: any, b: any) => b.dateKey.localeCompare(a.dateKey))
    } catch { allJournals.value = [] }
    finally { allJournalsLoading.value = false }
  }
  if (view === 'weekly_goals') {
    allWeeklyGoalsLoading.value = true
    allWeeklyGoals.value = []
    try {
      const res: any[] = await ($fetch as any)('/api/todo/weekly-goals-all')
      allWeeklyGoals.value = res
    } catch { allWeeklyGoals.value = [] }
    finally { allWeeklyGoalsLoading.value = false }
  }
}

function navigateToTrip(trip: any) {
  onSelectDate(trip.startDateKey)
  mainView.value = 'default'
}

function navigateToJournal(journal: any) {
  onSelectDate(journal.dateKey)
  mainView.value = 'default'
}

function formatJournalDate(dateKey: string) {
  if (!dateKey) return ''
  const [y, m, d] = dateKey.split('-').map(Number)
  return `${y}. ${m}. ${d}`
}

// 주간 목표 관련
const weekKey = computed(() => {
  const [y, m, d] = selectedDateKey.value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const sunday = new Date(date)
  sunday.setDate(date.getDate() - date.getDay())
  return formatDateKey(sunday)
})

const weekLabel = computed(() => {
  const [y, m, d] = weekKey.value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const startOfYear = new Date(y, 0, 1)
  const weekNum = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  return `${y}년 ${weekNum}주차`
})

function navigateToWeekGoal(goal: any) {
  // wk:2026-05-10 → 2026-05-10
  const dateKey = goal.date_key.replace('wk:', '')
  onSelectDate(dateKey)
  mainView.value = 'default'
}

function formatWeekLabel(dateKey: string): string {
  // wk:2026-05-10 → 2026년 20주차
  const cleanKey = dateKey.replace('wk:', '')
  const [y, m, d] = cleanKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const startOfYear = new Date(y, 0, 1)
  const weekNum = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  return `${y}년 ${weekNum}주차 (${m}/${d})`
}

// 설정 관련
const settingsName = ref('')
const settingsNameSaving = ref(false)
const settingsImageUrl = ref('')
const settingsImageSaving = ref(false)
const profileFileInput = ref<HTMLInputElement | null>(null)
const legalModal = ref<null | 'terms' | 'privacy'>(null)

async function saveSettingsName() {
  if (!settingsName.value.trim()) return
  settingsNameSaving.value = true
  try {
    await ($fetch as any)('/api/task/me', {
      method: 'PATCH',
      body: { name: settingsName.value.trim() },
    })
    if (user.value) user.value = { ...user.value, name: settingsName.value.trim() } as any
  } catch (e) { console.error(e) }
  finally { settingsNameSaving.value = false }
}

async function onProfileImageSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async (ev) => {
    // base64 미리보기
    settingsImageUrl.value = ev.target?.result as string
    // TODO: S3 업로드 후 URL 저장 (현재는 로컬 미리보기만)
    // 실제 구현 시 presigned URL 업로드 후 me.patch 호출
  }
  reader.readAsDataURL(file)
}

function showLegal(type: 'terms' | 'privacy') { legalModal.value = type }

const termsText = `제1조 (목적)
이 약관은 woojooverse 서비스 이용에 관한 기본적인 사항을 규정합니다.

제2조 (서비스 이용)
회원은 본 서비스를 개인적, 비상업적 목적으로만 이용할 수 있습니다.

제3조 (금지 행위)
타인의 개인정보를 무단으로 수집하거나 이용하는 행위를 금지합니다.

제4조 (서비스 변경 및 중단)
회사는 서비스 내용을 변경하거나 중단할 수 있으며, 이 경우 사전 공지합니다.

제5조 (면책조항)
천재지변 등 불가항력적 사유로 인한 서비스 장애에 대해서는 책임을 지지 않습니다.`

const privacyText = `1. 수집하는 개인정보
- 이름, 이메일 주소, 프로필 사진 (선택)
- Google 계정 연동 시 Google 프로필 정보

2. 개인정보 이용 목적
- 서비스 제공 및 개인화
- 고객 문의 응대

3. 개인정보 보유 기간
- 회원 탈퇴 시까지 보유 후 즉시 파기

4. 개인정보 제3자 제공
- 원칙적으로 제3자에게 제공하지 않습니다.

5. 이용자 권리
- 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.

문의: support@woojooverse.app`

const loginWithGoogle = () => {
  window.location.href = '/api/auth/google/login'
}

type TripDraft = {
  city: string; country: string
  startMonth: number | null; startDay: number | null
  endMonth: number | null; endDay: number | null
  startText: string; endText: string; imageUrl: string
}

const route = useRoute()
const router = useRouter()
const { user, setSession, hydrate, logout } = useAuth()

watch(user, (u) => {
  if (u) {
    settingsName.value = (u as any).name || (u as any).username || ''
    settingsImageUrl.value = (u as any).profile_image_url || ''
  }
}, { immediate: true })

const onLogout = async () => {
  await logout()
  await router.push('/users/login')
}
const { fetchItems, createItem, updateItem, deleteItem, reorderItems, fetchTrips, getCalendarSort, saveCalendarSort } = useTodo()


// 비행기 애니메이션
const showPlaneAnimation = ref(false)

// 도시 자동완성
const citySuggestions = ref<CityData[]>([])
const showCitySuggestions = ref(false)
const cityNavIndex = ref(0)

function onCityInput() {
  const q = tripDraft.value.city.trim()
  citySuggestions.value = q.length >= 1 ? searchCities(q) : []
  showCitySuggestions.value = citySuggestions.value.length > 0
  cityNavIndex.value = 0
}

function selectCitySuggestion(city: CityData | undefined) {
  if (!city) return
  tripDraft.value.city = city.nameKo
  tripDraft.value.country = city.countryKo
  tripDraft.value.imageUrl = city.imageUrl
  showCitySuggestions.value = false
}

function hideCitySuggestions() {
  // mousedown.prevent로 클릭이 blur보다 먼저 처리되므로 약간 딜레이
  setTimeout(() => { showCitySuggestions.value = false }, 150)
}

const showTripPopup = ref(false)
const showTripDatePicker = ref(false)
const tripPickerYear = ref(new Date().getFullYear())
const tripPickerMonth = ref(new Date().getMonth())
const tripPickingStart = ref('')
const tripPickingEnd = ref('')

const tripPickerWeekNames = ['일', '월', '화', '수', '목', '금', '토']

const tripPickerCells = computed(() => {
  const year = tripPickerYear.value
  const month = tripPickerMonth.value
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(year, month, 1 - firstDay.getDay())
  return Array.from({ length: 42 }).map((_, i) => {
    const cur = new Date(startDate)
    cur.setDate(startDate.getDate() + i)
    const key = formatDateKey(cur)
    const isInRange = tripPickingStart.value && tripPickingEnd.value
      ? key > tripPickingStart.value && key < tripPickingEnd.value
      : false
    return {
      key,
      day: cur.getDate(),
      isCurrentMonth: cur.getMonth() === month,
      isToday: formatDateKey(cur) === formatDateKey(new Date()),
      isStart: key === tripPickingStart.value,
      isEnd: key === tripPickingEnd.value,
      isInRange,
    }
  })
})

const tripPickerMonthLabel = computed(() =>
  `${tripPickerYear.value}.${String(tripPickerMonth.value + 1).padStart(2, '0')}`
)

function shiftTripPickerMonth(delta: number) {
  let m = tripPickerMonth.value + delta
  let y = tripPickerYear.value
  if (m < 0) { m = 11; y-- }
  if (m > 11) { m = 0; y++ }
  tripPickerMonth.value = m
  tripPickerYear.value = y
}

function onTripDateInputFocus(type: 'start' | 'end') {
  showTripDatePicker.value = true
  const now = new Date()
  tripPickerYear.value = now.getFullYear()
  tripPickerMonth.value = now.getMonth()
  if (!tripPickingStart.value && !tripPickingEnd.value) {
    // pre-fill from existing draft if available
    if (tripDraft.value.startMonth && tripDraft.value.startDay) {
      const sy = now.getFullYear()
      tripPickingStart.value = `${sy}-${String(tripDraft.value.startMonth).padStart(2,'0')}-${String(tripDraft.value.startDay).padStart(2,'0')}`
      tripPickerMonth.value = tripDraft.value.startMonth - 1
    }
    if (tripDraft.value.endMonth && tripDraft.value.endDay) {
      const ey = now.getFullYear()
      tripPickingEnd.value = `${ey}-${String(tripDraft.value.endMonth).padStart(2,'0')}-${String(tripDraft.value.endDay).padStart(2,'0')}`
    }
  }
}

function pickTripDate(key: string) {
  if (!tripPickingStart.value || (tripPickingStart.value && tripPickingEnd.value)) {
    // Reset - start new selection
    tripPickingStart.value = key
    tripPickingEnd.value = ''
  } else if (key < tripPickingStart.value) {
    // Clicked before start → make it the new start
    tripPickingStart.value = key
    tripPickingEnd.value = ''
  } else if (key === tripPickingStart.value) {
    // Clicked same day → single day trip
    tripPickingEnd.value = key
    applyTripDateRange(tripPickingStart.value, tripPickingEnd.value)
  } else {
    // Set end date and apply
    tripPickingEnd.value = key
    applyTripDateRange(tripPickingStart.value, tripPickingEnd.value)
  }
}

function applyTripDateRange(startKey: string, endKey: string) {
  const [, sm, sd] = startKey.split('-').map(Number)
  const [, em, ed] = endKey.split('-').map(Number)
  tripDraft.value.startText = `${sm}월 ${sd}일`
  tripDraft.value.endText = `${em}월 ${ed}일`
  tripDraft.value.startMonth = sm
  tripDraft.value.startDay = sd
  tripDraft.value.endMonth = em
  tripDraft.value.endDay = ed
}

const today = new Date()
const currentYear = today.getFullYear()
const selectedDate = ref(new Date(today.getFullYear(), today.getMonth(), today.getDate()))

const tripDraft = ref<TripDraft>({
  city: '', country: '',
  startMonth: null, startDay: null,
  endMonth: null, endDay: null,
  startText: '', endText: '',
  imageUrl: seaBg,
})

const items = ref<ItemBlock[]>([])
const googleEvents = ref<any[]>([])
const calendarList = ref<any[]>([])

// 캘린더 선택 모달
const showCalendarPicker = ref(false)
const pendingEvent = ref<{ title: string; dateKey: string; _tempItem?: any } | null>(null)
const pickerStartTime = ref('')
const pickerEndTime = ref('')

const LAST_CAL_KEY = 'woojooverse_last_calendar'
const lastCalendarId = ref<string>(
  typeof window !== 'undefined' ? (localStorage.getItem(LAST_CAL_KEY) || '') : ''
)

// 마지막 사용 캘린더가 목록 맨 위에 오도록 정렬
const sortedCalendarList = computed(() => {
  if (!lastCalendarId.value) return calendarList.value
  return [...calendarList.value].sort((a, b) => {
    if (a.id === lastCalendarId.value) return -1
    if (b.id === lastCalendarId.value) return 1
    return 0
  })
})

// 캘린더 선택 모달 Escape 닫기
function onCalendarPickerKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') showCalendarPicker.value = false
}

watch(showCalendarPicker, (open) => {
  if (open) window.addEventListener('keydown', onCalendarPickerKeydown)
  else window.removeEventListener('keydown', onCalendarPickerKeydown)
})

const selectedDateKey = computed(() => formatDateKey(selectedDate.value))

const tripBlocks = computed(() =>
  items.value.filter((item): item is any => item.type === 'trip')
)

const activeTripsForSelectedDate = computed(() =>
  tripBlocks.value.filter(
    (trip: any) => selectedDateKey.value >= trip.startDateKey && selectedDateKey.value <= trip.endDateKey
  )
)

const activeTripForSelectedDate = computed(() => activeTripsForSelectedDate.value[0] ?? null)

const tripHeroStyle = computed((): Record<string, string> => {
  if (!activeTripForSelectedDate.value) return {}
  return { backgroundImage: `url(${activeTripForSelectedDate.value.imageUrl})` }
})

const tripModalStyle = computed(() => ({
  backgroundImage: `linear-gradient(180deg, rgba(24,26,32,0.72), rgba(24,26,32,0.92)), url(${tripDraft.value.imageUrl || seaBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
}))

function formatDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 저장된 순서(calendarSort)를 DB 아이템에 적용
function applyDbSort(sortKeys: string[]) {
  const dbKeyOrder = sortKeys
    .filter((k) => k.startsWith('db:'))
    .map((k) => Number(k.slice(3)))
  if (!dbKeyOrder.length) return
  items.value.sort((a, b) => {
    const ai = dbKeyOrder.indexOf(a.id)
    const bi = dbKeyOrder.indexOf(b.id)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

// API에서 날짜별 항목 로드
async function loadItems(dateKey: string) {
  try {
    const fetched = await fetchItems(dateKey)
    items.value = fetched
    ensureTrailingEmptyTodo()
  } catch (e) {
    console.error('[todo] fetchItems 실패:', e)
    items.value = []
    ensureTrailingEmptyTodo()
  }
}

// 구글 캘린더 이벤트 로드 (주 단위)
async function loadGoogleEvents(dateKey: string) {
  if (!isGoogleAuthed.value) return
  try {
    const res: any[] = await ($fetch as any)('/api/calendar/events', { params: { date: dateKey } })
    googleEvents.value = res
  } catch (e) {
    console.error('[calendar] 조회 실패:', e)
    googleEvents.value = []
  }
}

// 캘린더 목록 로드
async function loadCalendarList() {
  if (!isGoogleAuthed.value) return
  try {
    calendarList.value = await ($fetch as any)('/api/calendar/calendars')
  } catch (e) {
    console.error('[calendar] 목록 조회 실패:', e)
  }
}

// 구글 캘린더 이벤트가 있는 날짜 목록 (WeekCalendar 점 표시용)
const googleEventDates = computed(() =>
  [...new Set(googleEvents.value.map((e) => e.dateKey as string))]
)

// 선택한 날짜의 구글 캘린더 이벤트 (저장된 순서 적용)
const calendarSortKeys = ref<string[]>([])

const todayGoogleEvents = computed(() => {
  const evs = googleEvents.value
    .filter((e) => e.dateKey === selectedDateKey.value)
    .filter((e) => !hiddenCalendarIds.value.includes(e.calendarId))
  if (!calendarSortKeys.value.length) return evs

  const gcalKeys = calendarSortKeys.value
    .filter((k) => k.startsWith('gcal:'))
    .map((k) => k.slice(5))

  return [...evs].sort((a, b) => {
    const ai = gcalKeys.indexOf(a.id)
    const bi = gcalKeys.indexOf(b.id)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
})

// 구글 캘린더에 이벤트 등록
async function saveEventToCalendar(calendarId: string) {
  if (!pendingEvent.value) return
  showCalendarPicker.value = false
  const saved = pendingEvent.value
  try {
    await ($fetch as any)('/api/calendar/event', {
      method: 'POST',
      body: {
        calendarId,
        title: saved.title,
        dateKey: saved.dateKey,
        startTime: pickerStartTime.value || undefined,
        endTime: pickerEndTime.value || undefined,
      },
    })
    // 마지막 사용 캘린더 저장
    lastCalendarId.value = calendarId
    localStorage.setItem(LAST_CAL_KEY, calendarId)
    await loadGoogleEvents(selectedDateKey.value)
    // 같은 날짜면 gcal 이벤트로 대체되므로 temp 제거
    // 다른 날짜면 화면에 남겨서 사용자가 등록 결과를 확인할 수 있게 함
    if (saved.dateKey === selectedDateKey.value && saved._tempItem) {
      const idx = items.value.findIndex((i) => i === saved._tempItem)
      if (idx !== -1) items.value.splice(idx, 1)
    }
  } catch (e) {
    console.error('[calendar] 이벤트 등록 실패:', e)
  } finally {
    pendingEvent.value = null
    pickerStartTime.value = ''
    pickerEndTime.value = ''
  }
}

// 구글 캘린더 이벤트 삭제
async function deleteGoogleEvent(ev: any) {
  try {
    await ($fetch as any)('/api/calendar/event', {
      method: 'DELETE',
      body: { calendarId: ev.calendarId || 'primary', eventId: ev.id },
    })
    await loadGoogleEvents(selectedDateKey.value)
  } catch (e) {
    console.error('[calendar] 이벤트 삭제 실패:', e)
  }
}

let _emptySeq = -100000
function ensureTrailingEmptyTodo() {
  const activeTodos = items.value.filter((item) => item.type === 'todo' && !item.done) as any[]
  if (!activeTodos.some((item) => item._isRegistrationSlot)) {
    items.value.push({ id: _emptySeq--, type: 'todo', text: '', done: false, _isRegistrationSlot: true } as any)
  }
}

// 구글 콜백 토큰 처리 + 아이템 로드
onMounted(async () => {
  const token = route.query.token as string
  const username = route.query.username as string
  if (token) {
    setSession({ access_token: token, user: { username } })
    await router.replace('/todo/todo')
  } else {
    hydrate()
  }
  await loadItems(selectedDateKey.value)
  await loadGoogleEvents(selectedDateKey.value)
  await loadCalendarList()
  calendarSortKeys.value = await getCalendarSort(selectedDateKey.value)
  applyDbSort(calendarSortKeys.value)
  loadAllTripsData()
  prefetchCityImages()
})

// 백그라운드 도시 이미지 프리페치
// localStorage에 없는 도시만, 50개 배치씩 나눠서 순차 처리
const CACHE_PREFIX = 'wjv_city_img_'
async function prefetchCityImages() {
  const missing = CITIES.filter((c) => {
    const key = CACHE_PREFIX + c.name.toLowerCase().replace(/\s/g, '_')
    return !localStorage.getItem(key)
  })
  if (!missing.length) return

  const BATCH = 50
  for (let i = 0; i < missing.length; i += BATCH) {
    const batch = missing.slice(i, i + BATCH)
    try {
      const res: any = await $fetch('/api/city-image-bulk', {
        method: 'POST',
        body: { cities: batch.map((c) => ({ name: c.name, countryKo: c.countryKo })) },
      })
      for (const item of res?.results ?? []) {
        if (item.url) {
          const key = CACHE_PREFIX + item.name.toLowerCase().replace(/\s/g, '_')
          try { localStorage.setItem(key, item.url) } catch {}
        }
      }
    } catch {}
    // 다음 배치 전 1분 대기 (rate limit: 50req/hour)
    if (i + BATCH < missing.length) {
      await new Promise((r) => setTimeout(r, 62000))
    }
  }
}

watch(selectedDateKey, async (dateKey) => {
  await loadItems(dateKey)
  loadGoogleEvents(dateKey)
  calendarSortKeys.value = await getCalendarSort(dateKey)
  applyDbSort(calendarSortKeys.value)
})

function onSelectDate(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  selectedDate.value = new Date(y, m - 1, d)
}

// TodoList에서 올라오는 이벤트 핸들러
async function onItemCreated(payload: { item: ItemBlock; dateKey: string }) {
  const { item, dateKey } = payload
  try {
    // 이벤트는 구글 캘린더로 저장
    if (item.type === 'event') {
      if (isGoogleAuthed.value) {
        pendingEvent.value = {
          title: (item as any).title,
          dateKey: (item as any).dateKey || dateKey,
          _tempItem: item,  // 임시 항목 참조 보관
        }
        // 자동 파싱된 시간이 있으면 캘린더 선택 모달에 미리 채움
        pickerStartTime.value = (item as any).startTime || ''
        pickerEndTime.value = (item as any).endTime || ''
        showCalendarPicker.value = true
        // 바로 제거하지 않음 — 사용자가 등록한 사실을 화면에서 확인할 수 있도록
        // (새로고침/날짜 이동 시 loadItems로 자동 제거됨)
      }
      return
    }

    let body: any = { type: item.type, date_key: dateKey, done: false }

    if (item.type === 'todo')    body.text = (item as any).text
    if (item.type === 'journal') {
      body.journal_content = (item as any).content
      body.date_key = (item as any).dateKey || dateKey
    }
    if (item.type === 'trip') {
      const t = item as any
      body.trip_city = t.city; body.trip_country = t.country
      body.trip_start_key = t.startDateKey; body.trip_end_key = t.endDateKey
      body.trip_start_text = t.startText; body.trip_end_text = t.endText
      body.date_key = t.startDateKey || dateKey
      // Unsplash 이미지 가져오기 (캐시 우선, 없으면 API 호출)
      try {
        const imgRes: any = await $fetch(`/api/city-image?city=${encodeURIComponent(t.city)}&country=${encodeURIComponent(t.country || '')}`)
        body.trip_image_url = imgRes?.url || t.imageUrl
      } catch {
        body.trip_image_url = t.imageUrl
      }
    }

    const saved = await createItem(body)
    const idx = items.value.findIndex((i) => i === item)
    if (idx !== -1) {
      if (item.type === 'journal') {
        // journal은 객체 참조 유지 (textarea DOM 재생성 방지)
        // id만 업데이트하고, 사용자가 그 사이 입력한 내용이 있으면 DB에도 반영
        const latestContent = (items.value[idx] as any).content ?? ''
        ;(items.value[idx] as any).id = saved.id
        if (latestContent !== (body as any).journal_content) {
          await updateItem(saved.id, { journal_content: latestContent })
        }
      } else {
        items.value.splice(idx, 1, saved)
      }
    }
  } catch (e) {
    console.error('[todo] createItem 실패:', e)
  }
}

async function onItemUpdated(payload: { id: number; body: object }) {
  if (payload.id <= 0) return
  try {
    await updateItem(payload.id, payload.body)
    await loadItems(selectedDateKey.value)
  } catch (e) {
    console.error('[todo] updateItem 실패:', e)
  }
}

async function onItemDeleted(id: number) {
  if (id <= 0) return
  allTripsData.value = allTripsData.value.filter((t) => t.id !== id)
  try {
    await deleteItem(id)
  } catch (e) {
    console.error('[todo] deleteItem 실패:', e)
  }
}

async function onItemsReordered(orderedKeys: string[]) {
  try {
    // DB 아이템 순서 저장
    const dbIds = orderedKeys
      .filter((k) => k.startsWith('db:'))
      .map((k) => Number(k.slice(3)))
      .filter((id) => id > 0)
    if (dbIds.length) await reorderItems(dbIds)

    // 구글 캘린더 포함 전체 순서 저장
    await saveCalendarSort(selectedDateKey.value, orderedKeys)
    calendarSortKeys.value = orderedKeys
  } catch (e) {
    console.error('[todo] reorder 실패:', e)
  }
}

// 전날 미완료 할일 복사
async function copyYesterdayTodos() {
  const prev = new Date(selectedDate.value)
  prev.setDate(prev.getDate() - 1)
  const prevKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(prev.getDate()).padStart(2, '0')}`

  try {
    const prevItems = await fetchItems(prevKey)
    const undone = prevItems.filter((it) => it.type === 'todo' && !it.done)

    if (!undone.length) {
      alert('전날 미완료 할일이 없어요.')
      return
    }

    await Promise.all(
      undone.map((it) =>
        createItem({ type: 'todo', date_key: selectedDateKey.value, text: (it as any).text, done: false })
      )
    )
    await loadItems(selectedDateKey.value)
  } catch (e) {
    console.error('[todo] 전날 할일 복사 실패:', e)
  }
}

// 여행 팝업
function parseDateText(text: string) {
  const match = text.trim().match(/(\d{1,2})월\s*(\d{1,2})일/)
  if (!match) return null
  return { month: Number(match[1]), day: Number(match[2]) }
}

function syncTripDatePartsFromText() {
  const start = parseDateText(tripDraft.value.startText)
  const end = parseDateText(tripDraft.value.endText)
  if (start) { tripDraft.value.startMonth = start.month; tripDraft.value.startDay = start.day }
  if (end) { tripDraft.value.endMonth = end.month; tripDraft.value.endDay = end.day }
}

function openTripPopup(draft: TripDraft) {
  // 도시명으로 이미지 자동 매칭
  let imageUrl = draft.imageUrl?.startsWith('http') ? draft.imageUrl : ''
  if (draft.city && !imageUrl) {
    const matched = searchCities(draft.city)[0]
    if (matched) {
      imageUrl = matched.imageUrl
      draft.country = draft.country || matched.countryKo
    }
  }
  tripDraft.value = { ...draft, imageUrl }
  citySuggestions.value = []
  showCitySuggestions.value = false
  showTripPopup.value = true
}

function closeTripPopup() {
  showTripPopup.value = false
}

async function confirmTrip() {
  syncTripDatePartsFromText()
  if (!tripDraft.value.city || !tripDraft.value.startMonth || !tripDraft.value.startDay || !tripDraft.value.endMonth || !tripDraft.value.endDay) return

  const startDate = new Date(currentYear, tripDraft.value.startMonth - 1, tripDraft.value.startDay)
  const endDate = new Date(currentYear, tripDraft.value.endMonth - 1, tripDraft.value.endDay)
  const startDateKey = formatDateKey(startDate)

  const newTrip: any = {
    id: 0,
    type: 'trip',
    city: tripDraft.value.city,
    country: tripDraft.value.country,
    startDateKey,
    endDateKey: formatDateKey(endDate),
    startText: tripDraft.value.startText,
    endText: tripDraft.value.endText,
    imageUrl: tripDraft.value.imageUrl?.startsWith('http') ? tripDraft.value.imageUrl : '',
    done: false,
  }
  items.value.push(newTrip)
  showTripPopup.value = false

  // 비행기 애니메이션 → 여행 시작 날짜로 이동
  showPlaneAnimation.value = true
  setTimeout(() => {
    onSelectDate(startDateKey)
    setTimeout(() => { showPlaneAnimation.value = false }, 400)
  }, 1100)

  // API 저장
  onItemCreated({ item: newTrip, dateKey: selectedDateKey.value })
}

function burstStyle(index: number) {
  const angle = (360 / 12) * index
  const distance = 42 + (index % 3) * 10
  return { transform: `rotate(${angle}deg) translateY(-${distance}px)` }
}
</script>

<style scoped>
.page-root {
  @apply min-h-screen bg-black text-white;
}

/* 모바일 헤더 */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  background: #0e0e0e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: env(safe-area-inset-top, 0px);
}

.mobile-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 64px;
}

.mobile-header-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile-header-brand {
  font-size: 1.15rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.01em;
}

.mobile-header-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  background: transparent;
  transition: background 0.15s;
}

.mobile-header-menu-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.content-wrap {
  @apply mx-auto w-full max-w-[600px] px-4 pb-10;
  padding-top: calc(64px + env(safe-area-inset-top, 0px) + 1rem);
}

.week-calendar-sticky {
  position: sticky;
  top: calc(64px + env(safe-area-inset-top, 0px));
  z-index: 20;
  background: #202124;
  padding-bottom: 8px;
  margin-bottom: -8px;
}

.google-banner {
  @apply mb-4 flex items-center justify-between gap-3 rounded-2xl border p-3;
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
}

/* 앞으로의 여행 스트립 */
.upcoming-trips-strip {
  margin-bottom: 14px;
}

.upcoming-strip-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.15s;
}

.upcoming-strip-label:hover {
  color: rgba(255, 255, 255, 0.7);
}

.upcoming-strip-chevron {
  font-size: 13px;
  transition: transform 0.2s ease;
  display: inline-block;
}

.upcoming-strip-chevron.is-folded {
  transform: rotate(-90deg);
}

.upcoming-collapse-enter-active,
.upcoming-collapse-leave-active {
  transition: opacity 0.2s ease, max-height 0.25s ease;
  max-height: 120px;
  overflow: hidden;
}

.upcoming-collapse-enter-from,
.upcoming-collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.upcoming-trips-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 2px;
}

.upcoming-trips-scroll::-webkit-scrollbar {
  display: none;
}

.upcoming-trip-card {
  flex-shrink: 0;
  width: 108px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  -webkit-tap-highlight-color: transparent;
  transition: transform 150ms, opacity 150ms;
}

.upcoming-trip-card:hover {
  transform: scale(0.96);
  opacity: 0.88;
}

.upcoming-trip-img {
  position: relative;
  width: 100%;
  padding-top: 78%;
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.06);
}

.upcoming-trip-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.05) 55%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 8px 10px;
}

.upcoming-trip-city {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.96);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upcoming-trip-date {
  margin-top: 2px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.65);
}

.side-overlay {
  @apply fixed inset-0 z-40 bg-black/60;
}

.side-menu {
  @apply fixed left-0 top-0 z-50 flex h-full w-[80vw] max-w-[300px] flex-col border-r px-5 py-6 overflow-hidden;
  border-color: rgba(255, 255, 255, 0.12);
  background: #0e0e0e;
  padding-top: max(1.5rem, env(safe-area-inset-top, 1.5rem));
}

.side-menu-head {
  @apply mb-6 flex items-center justify-between;
}

.side-menu-username {
  @apply text-lg font-semibold;
  color: rgba(255, 255, 255, 0.95);
}

.side-menu-brand {
  @apply text-base font-bold tracking-wide;
  color: rgba(255, 255, 255, 0.95);
}

.side-close-btn {
  @apply grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10;
  color: rgba(255, 255, 255, 0.7);
}

.side-pin-btn {
  @apply grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10;
  color: rgba(255, 255, 255, 0.38);
}

.side-pin-btn-active {
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.08);
}

/* 사이드 메뉴 내비게이션 */
.side-nav {
  @apply flex flex-col gap-1;
}

/* 메인 뷰 전환 */
.main-view-head {
  @apply mb-5 flex items-center gap-3;
}

.main-view-back {
  @apply grid h-9 w-9 shrink-0 place-items-center rounded-full transition;
  color: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.main-view-back:hover {
  background: rgba(255, 255, 255, 0.08);
}

.main-view-title {
  @apply text-xl font-semibold;
  color: rgba(255, 255, 255, 0.95);
}

.main-view-body {
  @apply w-full;
}

.mv-section-label {
  @apply mb-3 text-[11px] font-semibold uppercase tracking-widest;
  color: rgba(255, 255, 255, 0.45);
}

.mv-empty {
  @apply py-20 text-center text-sm;
  color: rgba(255, 255, 255, 0.35);
}

/* 마소너리 타일 그리드 */
.masonry-grid {
  columns: 2;
  column-gap: 10px;
}

.masonry-card {
  break-inside: avoid;
  display: block;
  width: 100%;
  margin-bottom: 10px;
  text-align: left;
  border-radius: 18px;
  overflow: hidden;
  transition: transform 150ms, opacity 150ms;
  -webkit-tap-highlight-color: transparent;
}

.masonry-card:hover {
  transform: scale(0.98);
  opacity: 0.9;
}

/* 여행 카드 */
.trip-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.trip-card-thumb {
  position: relative;
  width: 100%;
  padding-top: 65%;
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.06);
}

.trip-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 55%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px 12px;
}

.trip-card-city {
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.96);
  line-height: 1.2;
}

.trip-card-country {
  margin-top: 2px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
}

.trip-card-info {
  padding: 8px 12px 10px;
  background: rgba(255, 255, 255, 0.03);
}

.trip-card-dates {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
}

/* 일기 카드 */
.journal-card-tile {
  padding: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 80px;
}

.journal-tile-date {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 6px;
}

.journal-tile-preview {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 사이드 메뉴 active 상태 */
.side-nav-item-active {
  background: rgba(255, 255, 255, 0.1);
}

.side-nav-item {
  @apply flex items-center gap-3 rounded-xl px-3 py-3 text-left transition;
  color: rgba(255, 255, 255, 0.88);
  -webkit-tap-highlight-color: transparent;
}

.side-nav-item:hover {
  background: rgba(255, 255, 255, 0.07);
}

.side-nav-icon {
  font-size: 20px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.6);
}

.side-nav-label {
  @apply flex-1 text-sm font-semibold;
}

.side-nav-arrow {
  font-size: 18px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.3);
}

/* 서브 뷰 헤더 */
.side-sub-head {
  @apply mb-5 flex items-center gap-2;
}

.side-sub-title {
  @apply flex-1 text-base font-semibold;
  color: rgba(255, 255, 255, 0.95);
}

.side-back-btn {
  @apply grid h-8 w-8 place-items-center rounded-full transition;
  color: rgba(255, 255, 255, 0.7);
}

.side-back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 스크롤 영역 */
.side-scroll {
  @apply flex-1 overflow-y-auto;
  /* iOS 모멘텀 스크롤 */
  -webkit-overflow-scrolling: touch;
}

/* 섹션 레이블 */
.side-section-label {
  @apply mb-2 text-[11px] font-semibold uppercase tracking-widest;
  color: rgba(255, 255, 255, 0.45);
}

/* 캘린더 토글 아이템 */
.side-cal-item {
  @apply flex items-center gap-3 rounded-xl px-3 py-2.5;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.side-cal-dot {
  @apply h-3 w-3 shrink-0 rounded-full;
}

.side-cal-name {
  @apply flex-1 text-sm;
  color: rgba(255, 255, 255, 0.88);
}

.side-cal-toggle {
  @apply rounded-lg px-2.5 py-1 text-xs font-semibold transition;
}

.toggle-on {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
}

.toggle-off {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.4);
}

/* 여행 목록 아이템 */
.side-trip-item {
  @apply flex w-full items-center gap-3 rounded-xl p-2 text-left transition;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  -webkit-tap-highlight-color: transparent;
}

.side-trip-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.side-trip-thumb {
  width: 60px;
  height: 48px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  background-color: rgba(255, 255, 255, 0.08);
}

.side-trip-info {
  @apply flex-1 min-w-0;
}

.side-trip-city {
  @apply text-sm font-semibold truncate;
  color: rgba(255, 255, 255, 0.92);
}

.side-trip-dates {
  @apply mt-0.5 text-xs truncate;
  color: rgba(255, 255, 255, 0.55);
}

.side-trip-country {
  @apply text-xs;
  color: rgba(255, 255, 255, 0.38);
}

/* 일기 그리드 */
.journal-grid {
  @apply grid grid-cols-2 gap-2;
}

.journal-grid-cell {
  @apply flex flex-col rounded-xl p-3 text-left transition;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  min-height: 88px;
  -webkit-tap-highlight-color: transparent;
}

.journal-grid-cell:hover {
  background: rgba(255, 255, 255, 0.07);
}

.journal-grid-date {
  @apply text-xs font-semibold;
  color: rgba(255, 255, 255, 0.88);
}

.journal-grid-preview {
  @apply mt-1.5 text-[11px] leading-relaxed;
  color: rgba(255, 255, 255, 0.45);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 빈 상태 */
.side-empty {
  @apply pt-10 text-center text-sm;
  color: rgba(255, 255, 255, 0.35);
}

.side-item {
  @apply flex items-center justify-between rounded-2xl border p-3;
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.side-item-title {
  @apply text-sm font-semibold;
  color: rgba(255, 255, 255, 0.92);
}

.side-item-desc {
  @apply mt-0.5 text-xs;
  color: rgba(255, 255, 255, 0.5);
}

.side-connect-btn {
  @apply shrink-0 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-black transition hover:bg-white/90;
}

.side-connected-badge {
  @apply shrink-0 text-xs font-semibold;
  color: #4ade80;
}

.side-divider {
  @apply my-5 border-t;
  border-color: rgba(255, 255, 255, 0.08);
}

.side-logout-btn {
  @apply rounded-xl px-3 py-2.5 text-sm font-semibold transition text-left;
  color: rgba(255, 255, 255, 0.65);
}

.side-logout-btn:hover {
  background: rgba(255, 255, 255, 0.06);
}

.side-overlay-enter-active,
.side-overlay-leave-active {
  transition: opacity 200ms ease;
}

.side-overlay-enter-from,
.side-overlay-leave-to {
  opacity: 0;
}

.side-menu-enter-active,
.side-menu-leave-active {
  transition: transform 220ms ease;
}

.side-menu-enter-from,
.side-menu-leave-to {
  transform: translateX(-100%);
}

.calendar-overlay {
  @apply fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 py-10;
  overflow-y: auto;
}

.calendar-close-btn {
  @apply grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10;
  color: rgba(255, 255, 255, 0.78);
}

.trip-modal {
  @apply relative w-full max-w-[560px] rounded-[24px];
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  background: #111;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
  /* overflow: hidden 제거 → city-suggestions 드롭다운이 클리핑되지 않도록 */
}

.trip-hero-banner {
  position: relative;
  height: 180px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  /* 히어로 배너만 개별 클리핑 (상단 모서리) */
  overflow: hidden;
  border-radius: 22px 22px 0 0;
}

.trip-hero-banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 18px 20px;
}

.trip-hero-banner-city {
  font-size: 26px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.96);
  line-height: 1.2;
}

.trip-hero-banner-date {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
}

.trip-hero-close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  backdrop-filter: blur(4px);
  transition: background 150ms;
}

.trip-hero-close:hover {
  background: rgba(0, 0, 0, 0.6);
}

.trip-modal-body {
  padding: 20px;
}

/* 비행기 애니메이션 */
.plane-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  pointer-events: none;
  overflow: hidden;
}

.plane-wrap {
  position: absolute;
  display: flex;
  align-items: center;
  animation: plane-fly 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.plane-emoji {
  font-size: 42px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
  transform: rotate(-10deg);
}

.plane-trail {
  width: 60px;
  height: 2px;
  margin-left: -8px;
  background: linear-gradient(to left, rgba(255,255,255,0.5), transparent);
  border-radius: 2px;
}

@keyframes plane-fly {
  0% {
    left: -100px;
    top: 75vh;
    opacity: 0;
    transform: scale(0.7);
  }
  10% {
    opacity: 1;
    transform: scale(1);
  }
  85% {
    opacity: 1;
  }
  100% {
    left: calc(100vw + 100px);
    top: 15vh;
    opacity: 0;
    transform: scale(0.8);
  }
}

.plane-fade-enter-active { transition: opacity 200ms ease; }
.plane-fade-leave-active { transition: opacity 300ms ease; }
.plane-fade-enter-from,
.plane-fade-leave-to { opacity: 0; }

.trip-form-grid {
  @apply grid gap-3 sm:grid-cols-2;
}

.trip-city-wrap {
  @apply relative;
}

.city-suggestions {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 60;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: #0e0e0e;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55);
  overflow: hidden;
}

.city-suggestion-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  text-align: left;
  transition: background 120ms;
  -webkit-tap-highlight-color: transparent;
}

.city-suggestion-item:hover,
.city-suggestion-active {
  background: rgba(255, 255, 255, 0.07);
}

.city-suggestion-img {
  width: 44px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.city-suggestion-name {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
}

.city-suggestion-country {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 1px;
}

.trip-field-label {
  @apply mb-2 text-xs font-semibold uppercase tracking-[0.14em];
  color: rgba(255, 255, 255, 0.72);
}

.trip-input {
  @apply w-full rounded-2xl border px-4 py-3 text-sm outline-none transition;
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(20, 22, 28, 0.42);
  color: rgba(255, 255, 255, 0.92);
}

.trip-input:focus {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
}

/* 날짜 범위 피커 */
.trip-date-picker {
  margin-top: 14px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
}

.trip-date-picker-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.trip-picker-month {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.trip-picker-nav {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
  transition: background 120ms;
}

.trip-picker-nav:hover {
  background: rgba(255, 255, 255, 0.08);
}

.trip-picker-close {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  transition: background 120ms;
}

.trip-picker-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.trip-picker-weeknames {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
}

.trip-picker-weekname {
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  padding: 4px 0;
}

.trip-picker-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.trip-picker-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  transition: background 100ms;
  -webkit-tap-highlight-color: transparent;
}

.trip-picker-cell:hover {
  background: rgba(255, 255, 255, 0.1);
}

.trip-picker-cell.tp-muted {
  opacity: 0.3;
}

.trip-picker-cell.tp-today {
  font-weight: 700;
  color: #fff;
}

.trip-picker-cell.tp-in-range {
  background: rgba(99, 179, 237, 0.18);
  border-radius: 0;
}

.trip-picker-cell.tp-start,
.trip-picker-cell.tp-end {
  background: rgba(99, 179, 237, 0.85);
  color: #000;
  font-weight: 700;
  border-radius: 8px;
}

.trip-picker-hint {
  margin-top: 8px;
  text-align: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
}

.trip-action-row {
  @apply mt-5 flex items-center justify-end gap-2;
}

.trip-btn {
  @apply rounded-2xl px-4 py-3 text-sm font-semibold transition;
}

.trip-btn-cancel {
  @apply border;
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.82);
}

.trip-btn-confirm {
  background: #d93025;
  color: white;
}

.trip-burst {
  @apply pointer-events-none absolute inset-0;
}

.burst-dot {
  @apply absolute left-1/2 top-[92px] h-[8px] w-[8px] rounded-full;
  background: rgba(255, 120, 120, 0.95);
  transform-origin: center center;
  animation: burst 700ms ease-out forwards;
}

@keyframes burst {
  0% { opacity: 0; transform: scale(0.2); }
  15% { opacity: 1; }
  100% { opacity: 0; }
}

/* 주간목표 목록 */
.weekly-goals-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.wg-list-item {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  cursor: pointer;
  transition: background 150ms;
  text-align: left;
}
.wg-list-item:hover { background: rgba(255,255,255,0.07); }
.wg-list-week {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.45);
  margin-bottom: 6px;
}
.wg-list-text {
  font-size: 14px;
  color: rgba(255,255,255,0.88);
  line-height: 1.5;
}

/* 설정 */
.settings-profile-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.settings-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}
.settings-profile-info {
  flex: 1;
}
.settings-field { margin-bottom: 16px; }
.settings-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.settings-input-row .trip-input { flex: 1; }
.settings-btn-primary {
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.9);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 150ms;
}
.settings-btn-primary:hover { background: rgba(255,255,255,0.18); }
.settings-btn-primary:disabled { opacity: 0.5; }
.settings-btn-secondary {
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.75);
  font-size: 12px;
  font-weight: 500;
  transition: background 150ms;
}
.settings-btn-secondary:hover { background: rgba(255,255,255,0.06); }
.settings-legal-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.settings-legal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.8);
  font-size: 14px;
  transition: background 150ms;
  width: 100%;
  text-align: left;
}
.settings-legal-item:hover { background: rgba(255,255,255,0.05); }
</style>
