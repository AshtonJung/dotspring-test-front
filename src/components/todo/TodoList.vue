<template>
  <!-- 여행 편집 모달 -->
  <Teleport to="body">
    <Transition name="confirm-modal">
      <div v-if="showTripEdit" class="confirm-overlay" @click.self="showTripEdit = false">
        <div class="trip-edit-modal">
          <!-- 히어로 이미지 -->
          <div class="trip-edit-hero" :style="tripHeroStyle">
            <div class="trip-edit-hero-overlay">
              <div class="trip-edit-hero-city">{{ activeTripForSelectedDate?.city }}</div>
              <div class="trip-edit-hero-country">{{ activeTripForSelectedDate?.country }}</div>
            </div>
          </div>

          <!-- 본문 -->
          <div class="trip-edit-body">
            <!-- 시작일 한 줄 -->
            <div class="trip-edit-slider-row">
              <span class="trip-edit-row-label">출발</span>
              <button type="button" class="trip-step-btn" @click="stepStart(-1)">−</button>
              <input
                type="range"
                class="trip-date-slider"
                :min="tripEditRangeMin"
                :max="tripEditEnd"
                v-model.number="tripEditStart"
              />
              <button type="button" class="trip-step-btn" @click="stepStart(1)">+</button>
              <span class="trip-slider-date">{{ formatDateLabel(tripEditStart) }}</span>
            </div>

            <!-- 종료일 한 줄 -->
            <div class="trip-edit-slider-row">
              <span class="trip-edit-row-label">귀국</span>
              <button type="button" class="trip-step-btn" @click="stepEnd(-1)">−</button>
              <input
                type="range"
                class="trip-date-slider"
                :min="tripEditStart"
                :max="tripEditRangeMax"
                v-model.number="tripEditEnd"
              />
              <button type="button" class="trip-step-btn" @click="stepEnd(1)">+</button>
              <span class="trip-slider-date">{{ formatDateLabel(tripEditEnd) }}</span>
            </div>

            <!-- 기간 요약 -->
            <div class="trip-edit-duration">
              {{ tripEditEnd - tripEditStart }}박 {{ tripEditEnd - tripEditStart + 1 }}일
            </div>

            <!-- 저장 / 취소 -->
            <div class="trip-edit-actions">
              <button type="button" class="trip-edit-btn-cancel" @click="showTripEdit = false">취소</button>
              <button type="button" class="trip-edit-btn-save" @click="saveTripEdit">저장</button>
            </div>

            <!-- 삭제 -->
            <button type="button" class="trip-edit-btn-delete" @click="askDeleteTrip">여행 삭제</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- 일정 편집 모달 -->
  <Teleport to="body">
    <Transition name="confirm-modal">
      <div v-if="eventEditTarget" class="confirm-overlay" @click.self="eventEditTarget = null">
        <div class="event-edit-modal">
          <div class="event-edit-header">
            <div class="event-edit-title">일정 수정</div>
            <button type="button" class="calendar-close-btn" @click="eventEditTarget = null">✕</button>
          </div>

          <div class="event-edit-body">
            <!-- 제목 -->
            <div class="event-edit-row">
              <label class="event-edit-label">제목</label>
              <input v-model="eventEditDraft.title" type="text" class="event-edit-input" placeholder="일정 제목" />
            </div>

            <!-- 날짜 -->
            <div class="event-edit-row">
              <label class="event-edit-label">날짜</label>
              <input v-model="eventEditDraft.dateKey" type="date" class="event-edit-input" />
            </div>

            <!-- 시작/종료 시간 -->
            <div class="event-edit-row event-edit-row-time">
              <div class="event-edit-time-group">
                <label class="event-edit-label">시작</label>
                <input v-model="eventEditDraft.startTime" type="time" class="event-edit-input" />
              </div>
              <div class="event-edit-time-sep">—</div>
              <div class="event-edit-time-group">
                <label class="event-edit-label">종료</label>
                <input v-model="eventEditDraft.endTime" type="time" class="event-edit-input" />
              </div>
            </div>

            <!-- 장소 -->
            <div class="event-edit-row">
              <label class="event-edit-label">장소</label>
              <input v-model="eventEditDraft.location" type="text" class="event-edit-input" placeholder="장소 또는 주소" />
            </div>

            <!-- URL -->
            <div class="event-edit-row">
              <label class="event-edit-label">URL</label>
              <input v-model="eventEditDraft.url" type="url" class="event-edit-input" placeholder="https://..." />
            </div>

            <!-- 메모 -->
            <div class="event-edit-row">
              <label class="event-edit-label">메모</label>
              <textarea v-model="eventEditDraft.memo" class="event-edit-input event-edit-textarea" placeholder="메모를 입력하세요" rows="3" />
            </div>

            <!-- 색상 -->
            <div class="event-edit-row">
              <label class="event-edit-label">색상</label>
              <div class="event-edit-colors">
                <button
                  v-for="c in EVENT_COLORS"
                  :key="c.value"
                  type="button"
                  class="event-edit-color-btn"
                  :class="{ 'event-edit-color-active': eventEditDraft.color === c.value }"
                  :style="c.value ? { backgroundColor: EVENT_COLOR_HEX[c.value] } : {}"
                  :title="c.label"
                  @click="eventEditDraft.color = c.value"
                >
                  <span v-if="!c.value" style="font-size:12px">✕</span>
                </button>
              </div>
            </div>
          </div>

          <div class="event-edit-actions">
            <button type="button" class="trip-edit-btn-cancel" @click="eventEditTarget = null">취소</button>
            <button type="button" class="trip-edit-btn-save" @click="saveEventEdit">저장</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- 삭제 확인 모달 -->
  <Teleport to="body">
    <Transition name="confirm-modal">
      <div v-if="confirmState.show" class="confirm-overlay" @click.self="cancelDelete">
        <div class="confirm-modal">
          <div class="confirm-title">{{ confirmState.show && confirmState.title ? confirmState.title : '일정을 삭제할까요?' }}</div>
          <div class="confirm-desc">{{ confirmState.label }}</div>
          <div class="confirm-actions">
            <button type="button" class="confirm-btn-cancel" @click="cancelDelete">취소</button>
            <button type="button" class="confirm-btn-delete" @click="confirmDelete">삭제</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <div class="rounded-[20px] border border-white/20 bg-black overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
    <!-- 날짜 제목 / 여행 Hero -->
    <div
      class="title-wrap"
      :class="activeTrips.length ? 'title-wrap-trip' : ''"
      :style="activeTrips.length ? currentHeroStyle : undefined"
    >
      <div v-if="activeTrips.length" class="title-overlay"></div>

      <div class="title-content">
        <div class="title-row">
          <div class="title-text">
            {{ displayDateTitle.date }}
            <span class="title-weekday">{{ displayDateTitle.weekday }}</span>
            <Transition name="weather-fade">
              <span v-if="weather" class="weather-badge">
                <span class="material-icons-round weather-icon">{{ WEATHER_ICON_NAMES[weather.iconType] ?? 'cloud' }}</span>
                <span class="weather-temp">{{ weather.max }}° / {{ weather.min }}°</span>
              </span>
            </Transition>
          </div>
          <div class="title-nav">
            <Transition name="today-btn">
              <button v-if="!isToday" type="button" class="today-btn" @click="emit('jump-to-date', todayDateKey)">
                오늘
              </button>
            </Transition>
            <button type="button" class="day-nav-btn" @click="emit('jump-to-date', prevDayKey)" aria-label="이전 날">
              <span class="material-icons-round" style="font-size:18px;line-height:1">chevron_left</span>
            </button>
            <button type="button" class="day-nav-btn" @click="emit('jump-to-date', nextDayKey)" aria-label="다음 날">
              <span class="material-icons-round" style="font-size:18px;line-height:1">chevron_right</span>
            </button>
          </div>
        </div>

        <div v-if="currentHeroTrip" class="trip-hero">
          <div class="trip-hero-label">여행</div>
          <div class="trip-hero-city">{{ currentHeroTrip.city }}</div>
          <div v-if="currentHeroTrip.country" class="trip-hero-country">
            <span class="trip-hero-flag">{{ COUNTRY_FLAGS[currentHeroTrip.country] }}</span>
            {{ currentHeroTrip.country }}
          </div>
          <div class="trip-hero-from-to">
            <div>
              <div class="trip-hero-date">from. {{ currentHeroTrip.startText }}</div>
              <div class="trip-hero-date">to. {{ currentHeroTrip.endText }}</div>
            </div>
            <button type="button" class="trip-hero-edit-btn" @click.stop="openTripEdit">편집</button>
          </div>
          <!-- 멀티 히어로 dot 네비게이션 -->
          <div v-if="activeTrips.length > 1" class="hero-dots">
            <button
              v-for="(_, i) in activeTrips"
              :key="i"
              type="button"
              class="hero-dot"
              :class="{ 'hero-dot-active': i === heroIndex }"
              @click.stop="heroIndex = i"
            />
          </div>
        </div>
      </div>
    </div>


    <!-- 진행 중 항목 -->
    <TransitionGroup name="todo-list" tag="div" class="mt-2 space-y-2 px-3">
      <template v-for="item in activeItems" :key="item._source === 'google' ? 'gcal-' + item.id : item.id">

        <!-- 구글 캘린더 이벤트 -->
        <div
          v-if="item._source === 'google'"
          class="event-card"
          :class="{ dragging: dragKey === itemKey(item), 'event-card-open': expandedKey === itemKey(item) }"
          :data-drag-key="itemKey(item)"
          @dragover.prevent="(e) => onDragOver(itemKey(item), e)"
          @drop.prevent="onDrop"
          @click="toggleExpand(itemKey(item))"
        >
          <div class="event-card-row">
            <button
              type="button"
              class="drag-handle"
              draggable="true"
              @dragstart="(e) => onDragStart(itemKey(item), e)"
              @dragend="onDragEnd"
              @touchstart.prevent="onTouchDragStart(itemKey(item))"
              @click.stop
              aria-label="순서 이동"
            >
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
            </button>
            <div class="min-w-0 flex-1">
              <div v-if="!item.allDay" class="event-badge" style="color: rgba(255,255,255,0.6)">
                {{ item.start.slice(11,16) }} ~ {{ item.end.slice(11,16) }}
              </div>
              <div class="event-title">
                <span v-if="item.calendarColor" class="cal-color-dot" :style="{ background: item.calendarColor }"></span>
                <component :is="getEventIcon(item.title)" class="event-cal-icon" :class="getEventIconClass(item.title)" :size="13" :stroke-width="1.8" />
                {{ item.title }}
                <a
                  v-if="!item.hangoutLink && extractMeetingLink(item)"
                  :href="extractMeetingLink(item)!"
                  target="_blank"
                  rel="noopener"
                  class="event-link-btn"
                  @click.stop
                  aria-label="링크 열기"
                >🔗</a>
              </div>
            </div>
            <ChevronRight class="event-chevron" :class="{ 'event-chevron-open': expandedKey === itemKey(item) }" :size="18" :stroke-width="2" />
            <button type="button" class="icon-btn danger-btn" @click.stop="askDeleteGcal(item)" aria-label="삭제">✕</button>
          </div>

          <Transition name="event-expand">
            <div v-if="expandedKey === itemKey(item)" class="event-detail">
              <!-- 날짜 / 시간 -->
              <div class="event-detail-row">
                <span class="event-detail-label">날짜</span>
                <span class="event-detail-value">{{ formatDetailDate(item.dateKey) }}</span>
              </div>
              <div class="event-detail-row">
                <span class="event-detail-label">시간</span>
                <span class="event-detail-value">{{ item.allDay ? '하루 종일' : `${item.start.slice(11,16)} ~ ${item.end.slice(11,16)}` }}</span>
              </div>

              <!-- 장소 -->
              <div v-if="item.location" class="event-detail-row">
                <span class="event-detail-label">장소</span>
                <span class="event-detail-value event-detail-ellipsis">{{ item.location }}</span>
              </div>

              <!-- 메모 -->
              <div v-if="item.description" class="event-detail-row event-detail-row-col">
                <span class="event-detail-label">메모</span>
                <p class="event-detail-memo">{{ item.description }}</p>
              </div>

              <!-- Google Meet -->
              <a
                v-if="item.hangoutLink"
                :href="item.hangoutLink"
                target="_blank"
                rel="noopener"
                class="event-detail-meet"
                @click.stop
              >
                <svg viewBox="0 0 24 24" class="meet-icon" fill="currentColor">
                  <path d="M20.9 4.5H3.1C1.9 4.5 1 5.4 1 6.6v10.8c0 1.2.9 2.1 2.1 2.1h11.7l4.2 2.1v-2.1h1.9c1.2 0 2.1-.9 2.1-2.1V6.6c0-1.2-.9-2.1-2.1-2.1zm-6.8 10.1-3.3-2.5-3.3 2.5V8.4h6.6v6.2z"/>
                </svg>
                Google Meet 참여
              </a>

              <!-- 참석자 -->
              <div v-if="item.attendees && item.attendees.length" class="event-detail-row event-detail-row-col">
                <span class="event-detail-label">참석자</span>
                <div class="event-attendees">
                  <div v-for="att in item.attendees" :key="att.email" class="event-attendee">
                    <span class="attendee-avatar">{{ (att.name || att.email)[0].toUpperCase() }}</span>
                    <div class="attendee-info">
                      <div class="attendee-name">{{ att.name || att.email }}</div>
                      <div class="attendee-status" :class="`status-${att.status}`">{{ attendeeStatusLabel(att.status) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 구글 캘린더 링크 -->
              <a
                v-if="item.htmlLink"
                :href="item.htmlLink"
                target="_blank"
                rel="noopener"
                class="event-detail-link"
                @click.stop
              >
                구글 캘린더에서 보기 →
              </a>
            </div>
          </Transition>
        </div>

        <!-- todo -->
        <div
          v-else-if="item.type === 'todo'"
          class="todo-item-wrap"
          :data-drag-key="itemKey(item)"
          @dragover.prevent="(e) => onDragOver(itemKey(item), e)"
          @drop.prevent="onDrop"
        >
          <div class="todo-row" :class="{ dragging: dragKey === itemKey(item) }">
            <button
              type="button"
              class="drag-handle"
              draggable="true"
              @dragstart="(e) => onDragStart(itemKey(item), e)"
              @dragend="onDragEnd"
              @touchstart.prevent="onTouchDragStart(itemKey(item))"
              aria-label="순서 이동"
              title="순서 이동"
            >
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
            </button>

            <button type="button" class="todo-check todo-check-off" @click="toggleTodo(item.id)" />

            <input
              v-model="item.text"
              type="text"
              class="todo-input todo-active"
              placeholder="할 일..."
              @input="onTodoInput(item.id, $event)"
              @keyup="onTodoInput(item.id, $event)"
              @keydown.enter.prevent
              @keyup.enter="handleEnter(item.id)"
              @keydown.backspace="handleBackspace(item.id, $event)"
              @keydown.escape="slashMenuItemId = null"
              @keydown.down.prevent="tripCitySuggestions.length ? tripCityNavIndex = Math.min(tripCityNavIndex + 1, tripCitySuggestions.length - 1) : null"
              @keydown.up.prevent="tripCitySuggestions.length ? tripCityNavIndex = Math.max(tripCityNavIndex - 1, 0) : null"
              @blur="handleBlur(item.id)"
            />

            <button type="button" class="icon-btn danger-btn" @click="removeItem(item.id)" aria-label="삭제" title="삭제">
              ✕
            </button>
          </div>

          <!-- 슬래시 명령어 드롭다운 -->
          <Transition name="slash-menu">
            <div v-if="slashMenuItemId === item.id && slashMenuFiltered.length" class="slash-menu">
              <button
                v-for="cmd in slashMenuFiltered"
                :key="cmd.prefix"
                type="button"
                class="slash-cmd"
                @pointerdown.prevent="selectSlashCommand(item as TodoBlock, cmd.prefix)"
              >
                <div class="slash-cmd-icon">
                  <component :is="cmd.icon" :size="18" :stroke-width="1.8" />
                </div>
                <div class="slash-cmd-text">
                  <div class="slash-cmd-name">{{ cmd.name }}</div>
                  <div class="slash-cmd-desc">{{ cmd.desc }}</div>
                </div>
              </button>
            </div>
          </Transition>

          <!-- /여행 도시 자동완성 -->
          <Transition name="slash-menu">
            <div v-if="slashMenuItemId === item.id && tripCitySuggestions.length" class="slash-menu">
              <button
                v-for="(city, i) in tripCitySuggestions"
                :key="city.name"
                type="button"
                class="trip-city-cmd"
                :class="{ 'trip-city-cmd-active': i === tripCityNavIndex }"
                @pointerdown.prevent="selectTripCityFromSuggestion(item.id, city)"
              >
                <div class="trip-city-cmd-img-wrap">
                  <img
                    v-if="!cityImgErrors[cityImgKey(city)]"
                    :src="cityImageUrls[cityImgKey(city)] || city.imageUrl"
                    class="trip-city-cmd-img"
                    :alt="city.name"
                    @error="onCityImgError(cityImgKey(city))"
                  />
                  <div v-else class="trip-city-cmd-img-fallback">
                    {{ city.nameKo[0] }}
                  </div>
                </div>
                <div class="trip-city-cmd-text">
                  <div class="trip-city-cmd-name">{{ city.nameKo }}</div>
                  <div class="trip-city-cmd-country">{{ city.countryKo }}</div>
                </div>
              </button>
            </div>
          </Transition>

          <!-- /여행 날짜 선택 드롭다운 -->
          <Transition name="slash-menu">
            <div v-if="tripDatePickerItemId === item.id" class="trip-date-picker">
              <div class="trip-date-picker-city">
                <span v-if="tripDatePickerCity">{{ COUNTRY_FLAGS[tripDatePickerCity.countryKo] }}</span>
                {{ tripDatePickerCity?.nameKo }}
              </div>
              <div class="trip-date-picker-row">
                <label class="trip-date-picker-label">from</label>
                <input type="date" class="trip-date-picker-input" v-model="tripDateFrom" />
              </div>
              <div class="trip-date-picker-row">
                <label class="trip-date-picker-label">to</label>
                <input type="date" class="trip-date-picker-input" v-model="tripDateTo" :min="tripDateFrom" />
              </div>
              <div class="trip-date-picker-actions">
                <button type="button" class="trip-date-picker-cancel" @pointerdown.prevent="cancelTripDatePicker">취소</button>
                <button type="button" class="trip-date-picker-confirm" @pointerdown.prevent="confirmTripDates" :disabled="!tripDateFrom">등록</button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- DB 이벤트 -->
        <div
          v-else-if="item.type === 'event'"
          :class="(item as EventBlock).dateKey !== selectedDateKey ? 'other-day-wrap' : ''"
        >
          <div
            class="event-card"
            :class="{ dragging: dragKey === itemKey(item), 'event-card-open': expandedKey === itemKey(item) }"
            :data-drag-key="itemKey(item)"
            @dragover.prevent="(e) => onDragOver(itemKey(item), e)"
            @drop.prevent="onDrop"
            @click="toggleExpand(itemKey(item))"
          >
            <div class="event-card-row">
              <button
                type="button"
                class="drag-handle"
                draggable="true"
                @dragstart="(e) => onDragStart(itemKey(item), e)"
                @dragend="onDragEnd"
                @touchstart.prevent="onTouchDragStart(itemKey(item))"
                @click.stop
                aria-label="순서 이동"
                title="순서 이동"
              >
                <span></span><span></span><span></span>
                <span></span><span></span><span></span>
              </button>

              <button type="button" class="todo-check todo-check-off" @click.stop="toggleTodo(item.id)" />

              <div class="min-w-0 flex-1">
                <div class="event-badge">{{ formatEventBadge(item as EventBlock) }}</div>
                <div class="event-title">
                  <component :is="getEventIcon(item.title)" class="event-cal-icon" :class="getEventIconClass(item.title)" :size="13" :stroke-width="1.8" />
                  {{ item.title }}
                </div>
              </div>

              <ChevronRight class="event-chevron" :class="{ 'event-chevron-open': expandedKey === itemKey(item) }" :size="18" :stroke-width="2" />
              <button type="button" class="icon-btn edit-btn" @click.stop="openEventEdit(item as EventBlock)" aria-label="수정" title="수정">
                ✎
              </button>
              <button type="button" class="icon-btn danger-btn" @click.stop="askDeleteItem(item.id, (item as any).title)" aria-label="삭제" title="삭제">
                ✕
              </button>
            </div>

            <Transition name="event-expand">
              <div v-if="expandedKey === itemKey(item)" class="event-detail">
                <div class="event-detail-row">
                  <span class="event-detail-label">날짜</span>
                  <span class="event-detail-value">{{ formatDetailDate((item as any).dateKey) }}</span>
                </div>
                <div v-if="(item as EventBlock).startTime" class="event-detail-row">
                  <span class="event-detail-label">시간</span>
                  <span class="event-detail-value">{{ formatTimeStr((item as EventBlock).startTime) }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <!-- 다른 날짜 일정: 날짜로 건너뛰는 버튼 -->
          <button
            v-if="(item as EventBlock).dateKey !== selectedDateKey"
            type="button"
            class="jump-btn"
            :title="`${(item as EventBlock).dateKey}으로 이동`"
            @click.stop="emit('jump-to-date', (item as EventBlock).dateKey)"
          >
            <ArrowUpRight :size="20" :stroke-width="2.2" />
          </button>
        </div>
      </template>
    </TransitionGroup>

    <!-- 등록 카드: 항상 최하단 고정 -->
    <div v-if="registrationCard" class="mt-2 todo-item-wrap reg-card-wrap px-3 pb-4">
      <div class="todo-row reg-card-row">
        <input
          ref="registrationInputRef"
          v-model="registrationCard.text"
          type="text"
          class="todo-input todo-active"
          placeholder="바로 입력해서 할 일을 등록하거나 /일기 /여행 /일정 을 등록해보세요."
          @input="onTodoInput(registrationCard!.id, $event)"
          @keyup="onTodoInput(registrationCard!.id, $event)"
          @keydown.enter.prevent
          @keyup.enter="handleEnter(registrationCard!.id)"
          @keydown.backspace="handleBackspace(registrationCard!.id, $event)"
          @keydown.escape="slashMenuItemId = null"
          @keydown.down.prevent="tripCitySuggestions.length ? tripCityNavIndex = Math.min(tripCityNavIndex + 1, tripCitySuggestions.length - 1) : null"
          @keydown.up.prevent="tripCitySuggestions.length ? tripCityNavIndex = Math.max(tripCityNavIndex - 1, 0) : null"
          @blur="handleBlur(registrationCard!.id)"
        />
      </div>

      <!-- 입력 가이드 힌트 -->
      <Transition name="slash-menu">
        <div v-if="registrationGuideText" class="reg-guide-hint">
          <span class="reg-guide-arrow">›</span>
          <span>{{ registrationGuideText }}</span>
        </div>
      </Transition>

      <Transition name="slash-menu">
        <div v-if="slashMenuItemId === registrationCard.id && slashMenuFiltered.length" class="slash-menu">
          <button
            v-for="cmd in slashMenuFiltered"
            :key="cmd.prefix"
            type="button"
            class="slash-cmd"
            @pointerdown.prevent="selectSlashCommand(registrationCard!, cmd.prefix)"
          >
            <div class="slash-cmd-icon">
              <component :is="cmd.icon" :size="18" :stroke-width="1.8" />
            </div>
            <div class="slash-cmd-text">
              <div class="slash-cmd-name">{{ cmd.name }}</div>
              <div class="slash-cmd-desc">{{ cmd.desc }}</div>
            </div>
          </button>
        </div>
      </Transition>

      <!-- /여행 도시 자동완성 (등록 카드) -->
      <Transition name="slash-menu">
        <div v-if="slashMenuItemId === registrationCard.id && tripCitySuggestions.length" class="slash-menu">
          <button
            v-for="(city, i) in tripCitySuggestions"
            :key="city.name"
            type="button"
            class="trip-city-cmd"
            :class="{ 'trip-city-cmd-active': i === tripCityNavIndex }"
            @pointerdown.prevent="selectTripCityFromSuggestion(registrationCard!.id, city)"
          >
            <div class="trip-city-cmd-img-wrap">
              <img
                v-if="!cityImgErrors[cityImgKey(city)]"
                :src="cityImageUrls[cityImgKey(city)] || city.imageUrl"
                class="trip-city-cmd-img"
                :alt="city.name"
                @error="onCityImgError(cityImgKey(city))"
              />
              <div v-else class="trip-city-cmd-img-fallback">
                {{ city.nameKo[0] }}
              </div>
            </div>
            <div class="trip-city-cmd-text">
              <div class="trip-city-cmd-name">{{ city.nameKo }}</div>
              <div class="trip-city-cmd-country">{{ city.countryKo }}</div>
            </div>
          </button>
        </div>
      </Transition>

      <!-- /여행 날짜 선택 드롭다운 (등록 카드) -->
      <Transition name="slash-menu">
        <div v-if="tripDatePickerItemId === registrationCard.id" class="trip-date-picker">
          <div class="trip-date-picker-city">
            <span v-if="tripDatePickerCity">{{ COUNTRY_FLAGS[tripDatePickerCity.countryKo] }}</span>
            {{ tripDatePickerCity?.nameKo }}
          </div>
          <div class="trip-date-picker-row">
            <label class="trip-date-picker-label">from</label>
            <input
              type="date"
              class="trip-date-picker-input"
              v-model="tripDateFrom"
            />
          </div>
          <div class="trip-date-picker-row">
            <label class="trip-date-picker-label">to</label>
            <input
              type="date"
              class="trip-date-picker-input"
              v-model="tripDateTo"
              :min="tripDateFrom"
            />
          </div>
          <div class="trip-date-picker-actions">
            <button type="button" class="trip-date-picker-cancel" @pointerdown.prevent="cancelTripDatePicker">취소</button>
            <button type="button" class="trip-date-picker-confirm" @pointerdown.prevent="confirmTripDates" :disabled="!tripDateFrom">등록</button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 어제 미완료 가져오기 버튼 -->
    <div v-if="!yesterdayCopied" class="px-3 mt-2 pb-2">
      <button
        type="button"
        class="carry-over-btn"
        @click="() => { yesterdayCopied = true; emit('copy-yesterday-todos') }"
      >
        어제 미완료 목록 가져오기
      </button>
    </div>

    <!-- 체크 완료 -->
    <div v-if="completedItems.length > 0" class="mt-8 border-t border-white/10 pt-6 px-3 pb-4">
      <button type="button" class="done-toggle" @click="doneFolded = !doneFolded">
        <span>{{ doneFolded ? '▶' : '▼' }}</span>
        <span>체크 완료 {{ completedItems.length }}개</span>
      </button>

      <div v-if="!doneFolded" class="mt-4 space-y-2">
        <template v-for="item in completedItems" :key="item.id">
          <div v-if="item.type === 'todo'" class="todo-row done-row">
            <button type="button" class="todo-check todo-check-on" @click="toggleTodo(item.id)"><span class="material-icons-round check-icon">check</span></button>
            <input v-model="item.text" type="text" class="todo-input todo-done" placeholder="완료된 항목" />
            <button type="button" class="icon-btn danger-btn" @click="removeItem(item.id)" aria-label="삭제" title="삭제">
              ✕
            </button>
          </div>

          <div v-else class="event-card event-card-done">
            <div class="event-card-row">
              <button type="button" class="todo-check todo-check-on" @click="toggleTodo(item.id)"><span class="material-icons-round check-icon">check</span></button>
              <div class="min-w-0 flex-1">
                <div class="event-badge">일정</div>
                <div class="event-title event-title-done">
                  <component :is="getEventIcon((item as any).title)" class="event-cal-icon" :size="13" :stroke-width="1.8" />
                  {{ (item as any).title }}
                </div>
              </div>
              <button type="button" class="icon-btn danger-btn" @click="askDeleteItem(item.id, (item as any).title)" aria-label="삭제" title="삭제">
                ✕
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 오늘의 일기 -->
    <div v-if="journalBlocks.length > 0" class="mt-8 border-t border-white/10 pt-6">
      <div class="mb-3 text-sm font-semibold text-white/70">오늘의 일기</div>

      <div
        v-for="journal in journalBlocks"
        :key="journal.dateKey"
        class="journal-card"
        :class="{ 'journal-card-editing': editingJournalId === journal.id }"
        @click="startEditJournal(journal)"
      >
        <div class="journal-head">
          <div>
            <div class="journal-label">일기</div>
            <div class="journal-date">{{ formatReadableDate(journal.dateKey) }}</div>
          </div>
          <div class="journal-head-actions">
            <!-- 편집 모드: 삭제 확인 + 완료 버튼 -->
            <template v-if="editingJournalId === journal.id">
              <button type="button" class="journal-action-btn journal-action-delete" @click.stop="askDeleteItem(journal.id, `${formatReadableDate(journal.dateKey)}`, '일기를 삭제할까요?')" aria-label="삭제">
                ✕
              </button>
              <button type="button" class="journal-action-btn journal-action-done" @click.stop="onJournalBlur(journal)" aria-label="완료">
                <span class="material-icons-round" style="font-size:17px;line-height:1">check</span>
              </button>
            </template>
            <!-- 기본 모드: 삭제 바로 -->
            <button v-else type="button" class="icon-btn danger-btn" @click.stop="askDeleteItem(journal.id, `${formatReadableDate(journal.dateKey)}`, '일기를 삭제할까요?')" aria-label="삭제">
              ✕
            </button>
          </div>
        </div>

        <!-- 편집 모드 -->
        <textarea
          v-if="editingJournalId === journal.id"
          :ref="(el) => { if (el) journalTextareaRefs[journal.id] = el as HTMLTextAreaElement }"
          v-model="journal.content"
          class="journal-textarea"
          placeholder="오늘의 일기를 적어보면 어떨까요"
          @click.stop
          @input="autoResizeJournal($event.target as HTMLTextAreaElement)"
          @blur="onJournalBlur(journal)"
        />

        <!-- 미리보기 모드 -->
        <div v-else class="journal-preview">
          <span v-if="journal.content">{{ journal.content.replace(/<[^>]*>/g, '') }}</span>
          <span v-else class="journal-preview-empty">탭해서 일기를 작성해보세요</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import { ChevronRight, ArrowUpRight, CalendarDays, BookText, Plane, BedDouble, Video } from 'lucide-vue-next'
import { searchCities, type CityData } from '@/data/cities'

type TodoBlock    = { id: number; type: 'todo';    text: string; done: boolean; _isRegistrationSlot?: boolean }
type EventBlock   = { id: number; type: 'event';   title: string; month: string; day: string; dateKey: string; startTime?: string; endTime?: string; location?: string; memo?: string; url?: string; color?: string; done: boolean }
type JournalBlock = { id: number; type: 'journal'; dateKey: string; content: string; done: boolean }
type TripBlock    = { id: number; type: 'trip';    city: string; country: string; startDateKey: string; endDateKey: string; startText: string; endText: string; imageUrl: string; done: boolean }
type ItemBlock = TodoBlock | EventBlock | JournalBlock | TripBlock

type TripDraft = {
  city: string; country: string
  startMonth: number | null; startDay: number | null
  endMonth: number | null; endDay: number | null
  startText: string; endText: string; imageUrl: string
}

type CalendarEvent = {
  id: string; title: string; dateKey: string
  start: string; end: string; allDay: boolean; htmlLink: string
  calendarId?: string; calendarColor?: string
  description?: string; location?: string; hangoutLink?: string
  attendees?: Array<{ name: string; email: string; status: string }>
}

const props = defineProps<{
  selectedDate: Date
  selectedDateKey: string
  items: ItemBlock[]
  calendarEvents?: CalendarEvent[]
  activeTripsForSelectedDate?: TripBlock[]
  activeTripForSelectedDate?: TripBlock
  tripHeroStyle: Record<string, string>
}>()

const emit = defineEmits<{
  'open-trip-popup': [draft: TripDraft]
  'item-created':   [payload: { item: ItemBlock; dateKey: string }]
  'item-updated':   [payload: { id: number; body: object }]
  'item-deleted':   [id: number]
  'items-reordered': [orderedKeys: string[]]
  'delete-calendar-event': [ev: CalendarEvent]
  'jump-to-date':   [dateKey: string]
  'copy-yesterday-todos': []
}>()

const todayDateKey = formatDateKey(new Date())
const isToday = computed(() => props.selectedDateKey === todayDateKey)

// 일정 편집 모달
const eventEditTarget = ref<EventBlock | null>(null)
const eventEditDraft = ref({ title: '', dateKey: '', startTime: '', endTime: '', location: '', memo: '', url: '', color: '' })
const EVENT_COLORS = [
  { value: '', label: '없음' },
  { value: 'red', label: '빨강' },
  { value: 'orange', label: '주황' },
  { value: 'yellow', label: '노랑' },
  { value: 'green', label: '초록' },
  { value: 'blue', label: '파랑' },
  { value: 'purple', label: '보라' },
]
const EVENT_COLOR_HEX: Record<string, string> = {
  red: '#f87171', orange: '#fb923c', yellow: '#fbbf24',
  green: '#4ade80', blue: '#60a5fa', purple: '#c084fc',
}

function openEventEdit(item: EventBlock) {
  eventEditTarget.value = item
  eventEditDraft.value = {
    title: item.title,
    dateKey: item.dateKey,
    startTime: item.startTime ?? '',
    endTime: item.endTime ?? '',
    location: item.location ?? '',
    memo: item.memo ?? '',
    url: item.url ?? '',
    color: item.color ?? '',
  }
}

function saveEventEdit() {
  if (!eventEditTarget.value) return
  const d = eventEditDraft.value
  emit('item-updated', {
    id: eventEditTarget.value.id,
    body: {
      title: d.title,
      date_key: d.dateKey,
      event_start_time: d.startTime || null,
      event_end_time: d.endTime || null,
      event_location: d.location || null,
      event_memo: d.memo || null,
      event_url: d.url || null,
      event_color: d.color || null,
    },
  })
  eventEditTarget.value = null
}

const yesterdayCopied = ref(false)
watch(() => props.selectedDateKey, () => { yesterdayCopied.value = false })

// 날씨
const COUNTRY_FLAGS: Record<string, string> = {
  '한국': '🇰🇷', '일본': '🇯🇵', '미국': '🇺🇸', '영국': '🇬🇧', '프랑스': '🇫🇷',
  '이탈리아': '🇮🇹', '스페인': '🇪🇸', '독일': '🇩🇪', '태국': '🇹🇭', '베트남': '🇻🇳',
  '싱가포르': '🇸🇬', '홍콩': '🇭🇰', '대만': '🇹🇼', '중국': '🇨🇳', '호주': '🇦🇺',
  '캐나다': '🇨🇦', '멕시코': '🇲🇽', '브라질': '🇧🇷', '아르헨티나': '🇦🇷',
  '포르투갈': '🇵🇹', '네덜란드': '🇳🇱', '벨기에': '🇧🇪', '스위스': '🇨🇭',
  '오스트리아': '🇦🇹', '스웨덴': '🇸🇪', '노르웨이': '🇳🇴', '덴마크': '🇩🇰',
  '핀란드': '🇫🇮', '폴란드': '🇵🇱', '체코': '🇨🇿', '헝가리': '🇭🇺',
  '그리스': '🇬🇷', '터키': '🇹🇷', '이집트': '🇪🇬', '모로코': '🇲🇦',
  '남아프리카공화국': '🇿🇦', '케냐': '🇰🇪', 'UAE': '🇦🇪', '인도': '🇮🇳',
  '인도네시아': '🇮🇩', '필리핀': '🇵🇭', '말레이시아': '🇲🇾', '캄보디아': '🇰🇭',
  '미얀마': '🇲🇲', '스리랑카': '🇱🇰', '네팔': '🇳🇵', '뉴질랜드': '🇳🇿',
  '페루': '🇵🇪', '콜롬비아': '🇨🇴', '칠레': '🇨🇱',
}

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

type WeatherData = { iconType: string; label: string; max: number; min: number } | null
const weather = ref<WeatherData>(null)

async function fetchWeather(dateKey: string, city?: string) {
  weather.value = null
  try {
    const params = city ? `city=${encodeURIComponent(city)}&date=${dateKey}` : `date=${dateKey}`
    const res: any = await $fetch(`/api/weather?${params}`)
    weather.value = res ?? null
  } catch {}
}

watch(
  [() => props.selectedDateKey, () => props.activeTripsForSelectedDate],
  ([dateKey, trips]) => {
    const tripCity = (trips as any)?.[0]?.city
    fetchWeather(dateKey, tripCity)
  },
  { immediate: true }
)

// 멀티 히어로 슬라이더
const heroIndex = ref(0)
const activeTrips = computed(() => props.activeTripsForSelectedDate ?? (props.activeTripForSelectedDate ? [props.activeTripForSelectedDate] : []))
const currentHeroTrip = computed(() => activeTrips.value[heroIndex.value] ?? null)
const currentHeroStyle = computed((): Record<string, string> => {
  if (!currentHeroTrip.value?.imageUrl) return props.tripHeroStyle
  return { backgroundImage: `url(${currentHeroTrip.value.imageUrl})` }
})
watch(() => props.selectedDateKey, () => { heroIndex.value = 0 })

// 도시 이미지 캐시 (메모리 + localStorage)
const CACHE_PREFIX = 'wjv_city_img_'
const cityImageCache = new Map<string, string>()

function getCachedImage(key: string): string | null {
  if (cityImageCache.has(key)) return cityImageCache.get(key)!
  const stored = localStorage.getItem(CACHE_PREFIX + key)
  if (stored) { cityImageCache.set(key, stored); return stored }
  return null
}

function setCachedImage(key: string, url: string) {
  cityImageCache.set(key, url)
  try { localStorage.setItem(CACHE_PREFIX + key, url) } catch {}
}

async function fetchCityImage(city: CityData): Promise<string> {
  const key = city.name.toLowerCase().replace(/\s/g, '_')
  const cached = getCachedImage(key)
  if (cached) return cached

  try {
    const res: any = await $fetch(`/api/city-image?city=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.countryKo)}`)
    if (res?.url) {
      setCachedImage(key, res.url)
      return res.url
    }
  } catch {}
  return city.imageUrl
}

// 표시용 이미지 URL (suggestion 목록)
const cityImageUrls = ref<Record<string, string>>({})
const cityImgErrors = ref<Record<string, boolean>>({})

function onCityImgError(cityKey: string) {
  cityImgErrors.value = { ...cityImgErrors.value, [cityKey]: true }
}

function cityImgKey(city: CityData) {
  return city.name.toLowerCase().replace(/\s/g, '_')
}

const prevDayKey = computed(() => {
  const d = new Date(props.selectedDate)
  d.setDate(d.getDate() - 1)
  return formatDateKey(d)
})
const nextDayKey = computed(() => {
  const d = new Date(props.selectedDate)
  d.setDate(d.getDate() + 1)
  return formatDateKey(d)
})

// ── 여행 편집 팝업 ──
const showTripEdit = ref(false)
const tripEditStart = ref(1)
const tripEditEnd = ref(1)
const tripOriginalStart = ref(1)
const tripOriginalEnd = ref(1)
const TRIP_EDIT_RANGE = 15

const tripEditRangeMin = computed(() => Math.max(1, tripOriginalStart.value - TRIP_EDIT_RANGE))
const tripEditRangeMax = computed(() => Math.min(366, tripOriginalEnd.value + TRIP_EDIT_RANGE))

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1)
  return Math.floor((date.getTime() - start.getTime()) / 86400000) + 1
}

function dateFromDayOfYear(day: number, year: number): Date {
  return new Date(year, 0, day)
}

function formatDateLabel(day: number): string {
  const year = new Date().getFullYear()
  const d = dateFromDayOfYear(day, year)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

function openTripEdit() {
  if (!props.activeTripForSelectedDate) return
  const trip = props.activeTripForSelectedDate
  const parseKey = (key: string) => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d) }
  tripOriginalStart.value = dayOfYear(parseKey(trip.startDateKey))
  tripOriginalEnd.value = dayOfYear(parseKey(trip.endDateKey))
  tripEditStart.value = tripOriginalStart.value
  tripEditEnd.value = tripOriginalEnd.value
  showTripEdit.value = true
}

function stepStart(delta: number) {
  const next = tripEditStart.value + delta
  if (next >= tripEditRangeMin.value && next <= tripEditEnd.value) tripEditStart.value = next
}
function stepEnd(delta: number) {
  const next = tripEditEnd.value + delta
  if (next >= tripEditStart.value && next <= tripEditRangeMax.value) tripEditEnd.value = next
}

function saveTripEdit() {
  if (!props.activeTripForSelectedDate) return
  const year = new Date().getFullYear()
  const startDate = dateFromDayOfYear(tripEditStart.value, year)
  const endDate = dateFromDayOfYear(tripEditEnd.value, year)
  const toKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  const toText = (d: Date) => `${d.getMonth()+1}월 ${d.getDate()}일`
  const trip = props.activeTripForSelectedDate as any
  trip.startDateKey = toKey(startDate)
  trip.endDateKey   = toKey(endDate)
  trip.startText    = toText(startDate)
  trip.endText      = toText(endDate)
  emit('item-updated', {
    id: trip.id,
    body: { trip_start_key: trip.startDateKey, trip_end_key: trip.endDateKey, trip_start_text: trip.startText, trip_end_text: trip.endText },
  })
  showTripEdit.value = false
}

function askDeleteTrip() {
  if (!props.activeTripForSelectedDate) return
  const id = props.activeTripForSelectedDate.id
  const city = props.activeTripForSelectedDate.city
  confirmState.value = {
    show: true,
    label: `${city} 여행을 삭제할까요?`,
    action: () => {
      const idx = props.items.findIndex(i => i.id === id)
      if (idx !== -1) props.items.splice(idx, 1)
      if (id > 0) emit('item-deleted', id)
      showTripEdit.value = false
    },
  }
}

const doneFolded = ref(false)
const dragKey = ref<string | null>(null)
const expandedKey = ref<string | null>(null)
const registrationInputRef = ref<HTMLInputElement | null>(null)

// 슬래시 명령어 드롭다운
const SLASH_COMMANDS = [
  { prefix: '/일정 ', icon: CalendarDays, name: '일정', desc: '날짜·시간을 포함한 일정 등록' },
  { prefix: '/일기',  icon: BookText,    name: '일기',  desc: '오늘의 일기 작성' },
  { prefix: '/여행 ', icon: Plane,       name: '여행',  desc: '여행 일정 등록' },
] as const

const slashMenuItemId = ref<number | null>(null)

// /여행 날짜 선택 드롭다운
const tripDatePickerItemId = ref<number | null>(null)
const tripDatePickerCity = ref<CityData | null>(null)
const tripDateFrom = ref('')
const tripDateTo = ref('')

function confirmTripDates() {
  if (!tripDatePickerItemId.value || !tripDatePickerCity.value) return
  const id = tripDatePickerItemId.value
  const city = tripDatePickerCity.value

  const index = props.items.findIndex((i) => i.id === id)

  // 날짜 파싱
  let startMonth: number | null = null, startDay: number | null = null
  let endMonth: number | null = null, endDay: number | null = null
  let startText = '', endText = ''

  if (tripDateFrom.value) {
    const [, fm, fd] = tripDateFrom.value.split('-').map(Number)
    startMonth = fm; startDay = fd
    startText = `${fm}월 ${fd}일`
  }
  if (tripDateTo.value) {
    const [, tm, td] = tripDateTo.value.split('-').map(Number)
    endMonth = tm; endDay = td
    endText = `${tm}월 ${td}일`
  }

  const draft: TripDraft = {
    city: city.nameKo,
    country: city.countryKo,
    startMonth, startDay, endMonth, endDay,
    startText, endText,
    imageUrl: cityImageUrls.value[cityImgKey(city)] || city.imageUrl,
  }

  // 임시 todo 아이템 제거
  if (index !== -1) {
    props.items.splice(index, 1)
    if (id > 0) emit('item-deleted', id)
  }

  tripDatePickerItemId.value = null
  tripDatePickerCity.value = null
  tripDateFrom.value = ''
  tripDateTo.value = ''

  emit('open-trip-popup', draft)
  ensureTrailingEmptyTodo()
  nextTick(() => registrationInputRef.value?.focus())
}

function cancelTripDatePicker() {
  tripDatePickerItemId.value = null
  tripDatePickerCity.value = null
  tripDateFrom.value = ''
  tripDateTo.value = ''
  nextTick(() => registrationInputRef.value?.focus())
}

// /여행 [도시쿼리] 자동완성
const tripCityNavIndex = ref(0)
// IME 조합 중에도 event.target.value로 직접 읽은 최신 텍스트
const liveInputText = ref('')

const tripCitySuggestions = computed((): CityData[] => {
  if (slashMenuItemId.value === null) return []
  const text = liveInputText.value
  if (!text.startsWith('/여행 ')) return []
  const raw = text.slice('/여행 '.length)
  // 날짜 정보가 포함되면 도시 검색 종료
  if (/\d+[월/]/.test(raw)) return []
  const query = raw.trim()
  if (!query) return []
  return searchCities(query)
})

watch(tripCitySuggestions, async (cities) => {
  for (const city of cities) {
    const key = city.name.toLowerCase().replace(/\s/g, '_')
    if (cityImageUrls.value[key]) continue
    cityImageUrls.value[key] = city.imageUrl  // 일단 기존 이미지 표시
    const url = await fetchCityImage(city)
    cityImageUrls.value = { ...cityImageUrls.value, [key]: url }
  }
})

const slashMenuFiltered = computed(() => {
  if (slashMenuItemId.value === null) return []
  // 도시 자동완성 모드면 슬래시 메뉴 숨김
  if (tripCitySuggestions.value.length) return []
  const text = liveInputText.value
  if (text.startsWith('/여행 ')) return []
  const query = text.slice(1).toLowerCase()
  if (!query) return SLASH_COMMANDS
  return SLASH_COMMANDS.filter((cmd) => cmd.name.startsWith(query))
})

// 등록 카드 입력 가이드 텍스트
const registrationGuideText = computed((): string => {
  if (!registrationCard.value) return ''
  const text = registrationCard.value.text

  // /일기 가이드
  if (text === '/일기') return '오늘 무슨일이 있었나요?'
  if (text.startsWith('/일기') && text.length > '/일기'.length) return ''

  // /여행 가이드
  if (text.startsWith('/여행 ')) {
    const after = text.slice('/여행 '.length)
    if (!after.trim()) return '도시 입력'
    // 도시가 선택되고 공백으로 끝나면 (도시명 뒤 날짜 입력 대기)
    if (!tripCitySuggestions.value.length && after.endsWith(' ')) return '날짜 입력'
    return ''
  }

  // /일정 가이드
  if (text.startsWith('/일정')) {
    const raw = text.replace('/일정', '').trim()
    if (!raw) return '날짜 입력'
    const hasDate = /(\d{1,2})월\s*(\d{1,2})일/.test(raw) || /\b\d{1,2}\/\d{1,2}\b/.test(raw)
    if (!hasDate) return '날짜 입력'
    const hasTime = /(오전|오후)\s*\d{1,2}시/.test(raw) || /\b\d{1,2}시/.test(raw) || /\b\d{1,2}:\d{2}\b/.test(raw)
    if (!hasTime) return '시간 입력'
    // 날짜·시간 제거 후 남은 내용이 없으면 내용 입력 안내
    let remaining = raw
    remaining = remaining.replace(/(오전|오후)\s*\d{1,2}시(?:\s*\d{1,2}분)?/, '').trim()
    remaining = remaining.replace(/\b\d{1,2}시(?:\s*\d{1,2}분)?/, '').trim()
    remaining = remaining.replace(/\b\d{1,2}:\d{2}\b/, '').trim()
    remaining = remaining.replace(/(\d{1,2})월\s*(\d{1,2})일/, '').trim()
    remaining = remaining.replace(/\b\d{1,2}\/\d{1,2}\b/, '').trim()
    if (!remaining) return '내용 입력'
    return ''
  }

  return ''
})

function onTodoInput(id: number, event?: Event) {
  const found = props.items.find((i) => i.id === id) as TodoBlock | undefined
  // IME 조합 중에도 DOM 값을 직접 읽어야 한글이 실시간 반영됨
  // found가 없어도 event 값으로 슬래시 메뉴는 처리 (모바일 타이밍 이슈 대응)
  const text = (event?.target as HTMLInputElement)?.value ?? found?.text ?? ''
  liveInputText.value = text

  if ((text.startsWith('/') && !text.includes(' ')) || text.startsWith('/여행 ')) {
    slashMenuItemId.value = id
    tripCityNavIndex.value = 0
  } else {
    slashMenuItemId.value = null
    liveInputText.value = ''
  }

  if (!found) return
}

function selectSlashCommand(item: TodoBlock, prefix: string) {
  item.text = prefix
  slashMenuItemId.value = null
}

async function selectTripCityFromSuggestion(id: number, city: CityData) {
  const found = props.items.find((i) => i.id === id) as TodoBlock | undefined
  if (!found) return
  slashMenuItemId.value = null
  tripCityNavIndex.value = 0
  // 선택 시 Unsplash 이미지 미리 캐싱
  fetchCityImage(city)

  // 날짜 피커 드롭다운 표시
  tripDatePickerItemId.value = id
  tripDatePickerCity.value = city
  tripDateFrom.value = props.selectedDateKey
  tripDateTo.value = ''
}

// 아직 서버에 저장되지 않은 임시 아이템에 고유 음수 ID를 부여
// → 여러 미저장 항목이 동시에 있어도 id 충돌 없이 올바른 항목을 찾을 수 있음
let tempIdSeq = -1
function nextTempId() { return tempIdSeq-- }

type ConfirmState =
  | { show: false }
  | { show: true; title?: string; label: string; action: () => void }

const confirmState = ref<ConfirmState>({ show: false })

function askDeleteItem(id: number, label: string, title?: string) {
  confirmState.value = {
    show: true,
    title,
    label,
    action: () => removeItem(id),
  }
}

function askDeleteGcal(item: any) {
  confirmState.value = {
    show: true,
    label: item.title,
    action: () => emit('delete-calendar-event', item),
  }
}

function confirmDelete() {
  if (confirmState.value.show) confirmState.value.action()
  confirmState.value = { show: false }
}

function cancelDelete() {
  confirmState.value = { show: false }
}

function toggleExpand(key: string) {
  expandedKey.value = expandedKey.value === key ? null : key
}

const weekdayNames = ['일', '월', '화', '수', '목', '금', '토']
const weekdayFullNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

function formatDetailDate(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${y}년 ${m}월 ${d}일 (${weekdayFullNames[date.getDay()]})`
}

function itemKey(item: MixedItem) {
  return item._source === 'google' ? `gcal:${item.id}` : `db:${item.id}`
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const displayDateTitle = computed(() => {
  const y = props.selectedDate.getFullYear()
  const m = props.selectedDate.getMonth() + 1
  const d = props.selectedDate.getDate()
  const weekday = weekdayNames[props.selectedDate.getDay()]
  return { date: `${y}.${m}.${d}`, weekday }
})

type MixedItem =
  | (ItemBlock & { _source: 'db' })
  | (CalendarEvent & { _source: 'google' })

// 드래그 가능한 항목 (등록 카드 제외)
const activeItems = computed((): MixedItem[] => {
  const dbItems = props.items
    .filter((item) => !item.done && (item.type === 'todo' || item.type === 'event')
      && !(item.type === 'todo' && (item as TodoBlock)._isRegistrationSlot))
    .map((item) => {
      ;(item as any)._source = 'db'
      return item as MixedItem
    })
  const gcalItems = (props.calendarEvents || []).map((ev) => ({ ...ev, _source: 'google' as const }))
  return [...dbItems, ...gcalItems]
})

// 등록 카드: _isRegistrationSlot 플래그가 있는 todo — 항상 리스트 최하단에 고정
const registrationCard = computed(() =>
  props.items.find(
    (item): item is TodoBlock => item.type === 'todo' && !item.done && !!item._isRegistrationSlot
  ) ?? null
)

const completedItems = computed(() =>
  props.items.filter((item) => item.done && (item.type === 'todo' || item.type === 'event'))
)

const journalBlocks = computed(() =>
  props.items.filter(
    (item): item is JournalBlock => item.type === 'journal' && item.dateKey === props.selectedDateKey
  )
)

function attendeeStatusLabel(status: string) {
  return { accepted: '수락', declined: '거절', tentative: '미정', needsAction: '미응답' }[status] ?? status
}

function formatTimeStr(timeStr?: string): string {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h < 12 ? '오전' : '오후'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m > 0 ? `${ampm} ${hour12}시 ${m}분` : `${ampm} ${hour12}시`
}

function formatEventBadge(item: EventBlock): string {
  const isOtherDay = item.dateKey && item.dateKey !== props.selectedDateKey
  const timeStr = formatTimeStr(item.startTime)
  if (isOtherDay) {
    const [y, mo, d] = item.dateKey.split('-').map(Number)
    return timeStr ? `${y}년 ${mo}월 ${d}일 ${timeStr}` : `${y}년 ${mo}월 ${d}일`
  }
  return timeStr || '일정'
}

function formatReadableDate(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`
}

function formatDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getEventIcon(title: string) {
  const t = title.toLowerCase()
  if (/비행|항공|flight|✈|air|탑승/.test(t)) return Plane
  if (/호텔|hotel|숙박|체크인|check-in|inn|resort/.test(t)) return BedDouble
  if (/zoom|teams|meet|webex|skype|회의|미팅|meeting|화상|conference/.test(t)) return Video
  return CalendarDays
}

function getEventIconClass(title: string): string {
  const t = title.toLowerCase()
  if (/비행|항공|flight|✈|air|탑승/.test(t)) return 'event-cal-icon--plane'
  if (/호텔|hotel|숙박|체크인|check-in|inn|resort/.test(t)) return 'event-cal-icon--hotel'
  if (/zoom|teams|meet|webex|skype|회의|미팅|meeting|화상|conference/.test(t)) return 'event-cal-icon--video'
  return ''
}

function extractMeetingLink(event: CalendarEvent): string | null {
  const text = `${event.description || ''} ${event.hangoutLink || ''} ${event.title || ''}`
  const urlMatch = text.match(/https?:\/\/[^\s<>"']+/i)
  return urlMatch ? urlMatch[0] : null
}

function createEmptyTodo(): TodoBlock {
  return { id: nextTempId(), type: 'todo', text: '', done: false, _isRegistrationSlot: true }
}

function ensureTrailingEmptyTodo() {
  const activeTodos = props.items.filter((item) => item.type === 'todo' && !item.done) as TodoBlock[]
  if (!activeTodos.some((item) => item._isRegistrationSlot)) {
    props.items.push(createEmptyTodo())
  }
}

function parseDateText(text: string) {
  const match = text.trim().match(/(\d{1,2})월\s*(\d{1,2})일/)
  if (!match) return null
  return { month: Number(match[1]), day: Number(match[2]) }
}

function parseScheduleCommand(text: string) {
  const trimmed = text.trim()
  if (!trimmed.startsWith('/일정')) return null
  let raw = trimmed.replace('/일정', '').trim()

  // ── 날짜 감지 ──────────────────────────────────────────
  let dateKey = formatDateKey(props.selectedDate)

  // 5월20일 / 5월 20일
  const dateKorRe = /(\d{1,2})월\s*(\d{1,2})일/
  const dateKorMatch = raw.match(dateKorRe)
  if (dateKorMatch) {
    const m = Number(dateKorMatch[1])
    const d = Number(dateKorMatch[2])
    const parsed = new Date(props.selectedDate.getFullYear(), m - 1, d)
    dateKey = formatDateKey(parsed)
    raw = raw.replace(dateKorMatch[0], '').trim()
  } else {
    // 5/20
    const dateSlashRe = /\b(\d{1,2})\/(\d{1,2})\b/
    const dateSlashMatch = raw.match(dateSlashRe)
    if (dateSlashMatch) {
      const m = Number(dateSlashMatch[1])
      const d = Number(dateSlashMatch[2])
      const parsed = new Date(props.selectedDate.getFullYear(), m - 1, d)
      dateKey = formatDateKey(parsed)
      raw = raw.replace(dateSlashMatch[0], '').trim()
    }
  }

  // ── 시간 감지 ──────────────────────────────────────────
  let startTime: string | undefined
  let endTime: string | undefined

  function toTimeStr(h: number, m: number) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  // 오전/오후 N시 [N분]
  const ampmRe = /(오전|오후)\s*(\d{1,2})시(?:\s*(\d{1,2})분)?/
  const ampmMatch = raw.match(ampmRe)
  if (ampmMatch) {
    let h = Number(ampmMatch[2])
    const min = Number(ampmMatch[3] ?? 0)
    if (ampmMatch[1] === '오후' && h < 12) h += 12
    if (ampmMatch[1] === '오전' && h === 12) h = 0
    startTime = toTimeStr(h, min)
    raw = raw.replace(ampmMatch[0], '').trim()
  }

  // N시 [N분] (오전/오후 없는 경우)
  if (!startTime) {
    const hourRe = /\b(\d{1,2})시(?:\s*(\d{1,2})분)?/
    const hourMatch = raw.match(hourRe)
    if (hourMatch) {
      const h = Number(hourMatch[1])
      const min = Number(hourMatch[2] ?? 0)
      if (h < 24) {
        startTime = toTimeStr(h, min)
        raw = raw.replace(hourMatch[0], '').trim()
      }
    }
  }

  // HH:MM
  if (!startTime) {
    const colonRe = /\b(\d{1,2}):(\d{2})\b/
    const colonMatch = raw.match(colonRe)
    if (colonMatch) {
      const h = Number(colonMatch[1])
      const min = Number(colonMatch[2])
      if (h < 24 && min < 60) {
        startTime = toTimeStr(h, min)
        raw = raw.replace(colonMatch[0], '').trim()
      }
    }
  }

  // 종료시간: 시작 + 1시간 (자동)
  if (startTime) {
    const [sh, sm] = startTime.split(':').map(Number)
    const eh = (sh + 1) % 24
    endTime = toTimeStr(eh, sm)
  }

  // ── 남은 텍스트 → 제목 ────────────────────────────────
  const title = raw.trim() || '새 일정'

  const targetDate = new Date(dateKey + 'T00:00:00')
  return {
    title,
    month: monthNames[targetDate.getMonth()],
    day: String(targetDate.getDate()),
    dateKey,
    startTime,
    endTime,
  }
}

function parseJournalCommand(text: string) {
  const trimmed = text.trim()
  if (!trimmed.startsWith('/일기')) return null
  return trimmed.replace('/일기', '').trim()
}

function parseTripCommand(text: string): TripDraft | null {
  const trimmed = text.trim()
  if (!trimmed.startsWith('/여행')) return null

  const raw = trimmed.replace('/여행', '').trim()

  // 날짜 패턴: "6월10일", "6월 10일", "6/10" 모두 인식
  const dateRegex = /(\d{1,2})(?:월\s*(\d{1,2})일|\/(\d{1,2}))/g
  const matches = [...raw.matchAll(dateRegex)]

  if (matches.length >= 2) {
    const toDate = (m: RegExpMatchArray) => {
      const month = Number(m[1])
      const day = Number(m[2] ?? m[3])
      return { month, day, text: `${month}월 ${day}일` }
    }
    const start = toDate(matches[0])
    const end = toDate(matches[1])

    // 첫 번째 날짜 이전 텍스트에서 도시명 추출 (구분자 제거)
    const city = raw.slice(0, matches[0].index!).replace(/[\s~\-,]+$/, '').trim()

    return {
      city,
      country: '',
      startMonth: start.month, startDay: start.day,
      endMonth: end.month, endDay: end.day,
      startText: start.text, endText: end.text,
      imageUrl: '',
    }
  }

  // 날짜 없이 도시명만 입력한 경우
  const firstWord = raw.split(/[\s,]/)[0] || ''
  return { city: firstWord, country: '', startMonth: null, startDay: null, endMonth: null, endDay: null, startText: '', endText: '', imageUrl: '' }
}

function createOrUpdateJournal(content: string) {
  const existing = props.items.find(
    (item) => item.type === 'journal' && item.dateKey === props.selectedDateKey
  ) as JournalBlock | undefined

  if (existing) {
    existing.content = content
    emit('item-updated', { id: existing.id, body: { journal_content: content } })
    return
  }

  const newJournal: JournalBlock = {
    id: nextTempId(),
    type: 'journal',
    dateKey: props.selectedDateKey,
    content,
    done: false,
  }
  props.items.push(newJournal)
  emit('item-created', { item: newJournal, dateKey: props.selectedDateKey })
}

function handleTodoConversion(id: number) {
  const index = props.items.findIndex((item) => item.id === id)
  if (index === -1) return

  const target = props.items[index]
  if (target.type !== 'todo') return

  const value = target.text.trim()
  if (!value) { ensureTrailingEmptyTodo(); return }
  // 슬래시만 있거나 아직 명령어 선택 중이면 저장하지 않음
  if (value.startsWith('/') && !value.includes(' ') && value !== '/일기') { ensureTrailingEmptyTodo(); return }

  const tripData = parseTripCommand(value)
  if (tripData) {
    props.items.splice(index, 1)
    if (id > 0) emit('item-deleted', id)
    emit('open-trip-popup', tripData)
    ensureTrailingEmptyTodo()
    return
  }

  const journalContent = parseJournalCommand(value)
  if (journalContent !== null) {
    props.items.splice(index, 1)
    if (id > 0) emit('item-deleted', id)
    createOrUpdateJournal(journalContent)
    ensureTrailingEmptyTodo()
    return
  }

  const scheduleData = parseScheduleCommand(value)
  if (scheduleData) {
    const newEvent: EventBlock = {
      id: target.id,
      type: 'event',
      title: scheduleData.title,
      month: scheduleData.month,
      day: scheduleData.day,
      dateKey: scheduleData.dateKey,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      done: false,
    }
    props.items.splice(index, 1, newEvent)
    props.items.splice(index + 1, 0, createEmptyTodo())
    // 기존 todo가 저장된 항목이면 삭제 후 새로 생성, 미저장이면 그냥 생성
    if (id > 0) emit('item-deleted', id)
    emit('item-created', { item: newEvent, dateKey: props.selectedDateKey })
    ensureTrailingEmptyTodo()
    return
  }

  // 일반 todo 저장 (id < 0 이면 임시 신규, id > 0 이면 업데이트)
  // 등록 카드 플래그 해제 — 저장되면 일반 아이템으로 전환
  delete (target as TodoBlock)._isRegistrationSlot
  if (id <= 0) {
    // 모바일에서 Enter → blur + keyup 이 연속 발화해 중복 생성되는 것을 방지
    if ((target as any)._creating) return
    ;(target as any)._creating = true
    emit('item-created', { item: target, dateKey: props.selectedDateKey })
  } else {
    emit('item-updated', { id, body: { text: value } })
  }

  ensureTrailingEmptyTodo()
}

function handleEnter(id: number) {
  // 도시 자동완성 중이면 현재 하이라이트된 도시 선택
  if (tripCitySuggestions.value.length && slashMenuItemId.value === id) {
    selectTripCityFromSuggestion(id, tripCitySuggestions.value[tripCityNavIndex.value])
    return
  }

  const index = props.items.findIndex((item) => item.id === id)
  if (index === -1) return

  handleTodoConversion(id)

  const nextIndex = props.items.findIndex((item, i) => i > index && item.type === 'todo' && !item.done)
  if (nextIndex === -1) props.items.push(createEmptyTodo())

  ensureTrailingEmptyTodo()

  nextTick(() => registrationInputRef.value?.focus())
}

function handleBlur(id: number) {
  const found = props.items.find((i) => i.id === id) as TodoBlock | undefined
  const text = found?.text ?? liveInputText.value
  // 슬래시 커맨드 입력 중이면 blur로 메뉴를 닫지 않음 (모바일 키보드 올라오는 타이밍 대응)
  if (!text.startsWith('/')) {
    slashMenuItemId.value = null
  }
  handleTodoConversion(id)
}

function handleBackspace(id: number, event: KeyboardEvent) {
  const index = props.items.findIndex((item) => item.id === id)
  if (index === -1) return

  const target = props.items[index]
  if (target.type !== 'todo' || target.text !== '') return

  const activeTodoCount = props.items.filter((item) => item.type === 'todo' && !item.done).length
  if (activeTodoCount <= 1) return

  event.preventDefault()
  props.items.splice(index, 1)
  ensureTrailingEmptyTodo()
}

function removeItem(id: number) {
  const index = props.items.findIndex((item) => item.id === id)
  if (index === -1) return
  props.items.splice(index, 1)
  if (id > 0) emit('item-deleted', id)
  ensureTrailingEmptyTodo()
}

function toggleTodo(id: number) {
  const target = props.items.find((item) => item.id === id)
  if (!target || target.type === 'journal' || target.type === 'trip') return
  target.done = !target.done
  if (id > 0) emit('item-updated', { id, body: { done: target.done } })
  ensureTrailingEmptyTodo()
}

const editingJournalId = ref<number | null>(null)
const journalTextareaRefs: Record<number, HTMLTextAreaElement> = {}

function autoResizeJournal(el: HTMLTextAreaElement) {
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

function startEditJournal(journal: JournalBlock) {
  if (editingJournalId.value === journal.id) return
  editingJournalId.value = journal.id
  nextTick(() => {
    const el = journalTextareaRefs[journal.id]
    if (el) {
      autoResizeJournal(el)
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
    }
  })
}

function onJournalBlur(journal: JournalBlock) {
  editingJournalId.value = null
  if (journal.id > 0) {
    emit('item-updated', { id: journal.id, body: { journal_content: journal.content } })
  }
  // id === 0: API 응답 대기 중 — todo.vue onItemCreated에서 latestContent로 처리됨
}

function onDragStart(key: string, event: DragEvent) {
  dragKey.value = key
  if (event.dataTransfer) {
    const ghost = document.createElement('div')
    ghost.style.position = 'fixed'
    ghost.style.top = '-9999px'
    document.body.appendChild(ghost)
    event.dataTransfer.setDragImage(ghost, 0, 0)
    requestAnimationFrame(() => document.body.removeChild(ghost))
  }
}

function onDragOver(targetKey: string, event?: DragEvent) {
  if (!dragKey.value || dragKey.value === targetKey) return

  const allItems = activeItems.value
  const fromIndex = allItems.findIndex((i) => itemKey(i) === dragKey.value)
  const toIndex = allItems.findIndex((i) => itemKey(i) === targetKey)
  if (fromIndex === -1 || toIndex === -1) return

  // 마우스가 대상 카드의 중간 지점을 넘었을 때만 이동 (oscillation 방지)
  if (event) {
    const el = event.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    if (fromIndex < toIndex && event.clientY < midY) return  // 아래로 이동: 중간 아직 안 넘음
    if (fromIndex > toIndex && event.clientY > midY) return  // 위로 이동: 중간 아직 안 넘음
  }

  // DB 아이템인 경우 journal/trip은 드래그 제외
  const dragged = allItems[fromIndex]
  const target = allItems[toIndex]
  if (dragged._source === 'db' && (dragged.type === 'journal' || dragged.type === 'trip')) return
  if (target._source === 'db' && (target.type === 'journal' || target.type === 'trip')) return

  // DB 아이템끼리는 done 상태 같아야 함
  if (dragged._source === 'db' && target._source === 'db' && dragged.done !== target.done) return

  if (dragged._source === 'db' && target._source === 'db') {
    const fromDbIndex = props.items.findIndex((i) => i.id === (dragged as any).id)
    const toDbIndex = props.items.findIndex((i) => i.id === (target as any).id)
    if (fromDbIndex !== -1 && toDbIndex !== -1) {
      const copied = [...props.items]
      const [moved] = copied.splice(fromDbIndex, 1)
      copied.splice(toDbIndex, 0, moved)
      props.items.splice(0, props.items.length, ...copied)
    }
  }
}

function onDrop() {
  ensureTrailingEmptyTodo()
  const orderedKeys = activeItems.value.map((i) => itemKey(i))
  emit('items-reordered', orderedKeys)
  onDragEnd()
}

function onDragEnd() {
  dragKey.value = null
}

// 모바일 터치 드래그
function onTouchDragStart(key: string) {
  dragKey.value = key
  document.addEventListener('touchmove', onTouchDragMove, { passive: false })
  document.addEventListener('touchend', onTouchDragEnd, { once: true })
}

function onTouchDragMove(event: TouchEvent) {
  event.preventDefault()
  if (!dragKey.value) return
  const touch = event.touches[0]
  const el = document.elementFromPoint(touch.clientX, touch.clientY)
  if (!el) return
  const itemEl = el.closest('[data-drag-key]') as HTMLElement | null
  if (!itemEl?.dataset.dragKey) return
  onDragOver(itemEl.dataset.dragKey)
}

function onTouchDragEnd() {
  document.removeEventListener('touchmove', onTouchDragMove)
  if (dragKey.value) onDrop()
}
</script>

<style scoped>
.title-wrap {
  @apply relative overflow-hidden rounded-2xl;
  background: black;
}

.title-wrap-trip {
  min-height: 180px;
  background-size: cover;
  background-position: center center;
}

.title-overlay {
  @apply absolute inset-0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.58));
}

.title-content {
  @apply relative z-10;
  padding: 16px 18px;
}

.title-row {
  @apply flex items-center justify-between gap-3;
}

.title-text {
  @apply flex items-baseline gap-2.5 text-[28px] font-semibold sm:text-[34px];
  color: rgba(255, 255, 255, 0.92);
}

.title-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.day-nav-btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.7);
  transition: background 150ms;
  flex-shrink: 0;
}

.day-nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.95);
}

.today-btn {
  @apply shrink-0 rounded-lg border font-semibold transition hover:bg-white/10;
  padding: 2px 7px;
  font-size: 11px;
  border-color: rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.82);
}

.carry-over-btn {
  @apply w-full rounded-xl border py-3 text-sm font-semibold transition hover:bg-white/10;
  border-color: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.5);
  border-style: dashed;
}

.today-btn-enter-active,
.today-btn-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.today-btn-enter-from,
.today-btn-leave-to {
  opacity: 0;
  transform: scale(0.88);
}

.weather-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  margin-left: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  vertical-align: middle;
}

.weather-icon {
  font-size: 28px !important;
  line-height: 1;
  color: rgba(255, 255, 255, 0.9);
}

.weather-temp {
  font-size: 9px;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.65);
}

.weather-fade-enter-active,
.weather-fade-leave-active {
  transition: opacity 0.3s ease;
}
.weather-fade-enter-from,
.weather-fade-leave-to {
  opacity: 0;
}

.title-weekday {
  @apply text-[16px] font-medium sm:text-[18px];
  color: rgba(255, 255, 255, 0.5);
}

.trip-hero {
  @apply mt-5 max-w-[280px] rounded-2xl border p-4 backdrop-blur-sm;
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.2);
}

.trip-hero-label {
  @apply text-[11px] font-semibold uppercase tracking-[0.16em];
  color: rgba(255, 255, 255, 0.7);
}

.trip-hero-city {
  @apply mt-2 text-[28px] font-semibold leading-tight;
  color: rgba(255, 255, 255, 0.96);
}

.trip-hero-country {
  @apply mt-0.5 flex items-center gap-1 text-[12px];
  color: rgba(255, 255, 255, 0.65);
}

.trip-hero-flag {
  font-size: 14px;
}

.trip-hero-from-to {
  @apply mt-2 flex items-end justify-between gap-2;
}

.trip-hero-date {
  @apply text-sm;
  color: rgba(255, 255, 255, 0.88);
}

.trip-hero-edit-btn {
  @apply shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.trip-hero-edit-btn:hover {
  background: rgba(255, 255, 255, 0.22);
}

.hero-dots {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.hero-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  transition: all 0.2s ease;
  border: none;
  padding: 0;
}

.hero-dot-active {
  background: rgba(255, 255, 255, 0.95);
  width: 18px;
  border-radius: 4px;
}

/* ── 여행 편집 모달 ── */
.trip-edit-modal {
  @apply w-full overflow-hidden rounded-[24px];
  max-width: 420px;
  background: #111;
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65);
}

.trip-edit-hero {
  position: relative;
  height: 140px;
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.05);
}

.trip-edit-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px 20px;
}

.trip-edit-hero-city {
  font-size: 22px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.96);
}

.trip-edit-hero-country {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}

.trip-edit-body {
  padding: 20px;
}

.trip-edit-slider-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.trip-edit-row-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.45);
  width: 28px;
  flex-shrink: 0;
}

.trip-step-btn {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.82);
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
  transition: background 120ms;
  user-select: none;
}

.trip-step-btn:hover {
  background: rgba(255, 255, 255, 0.14);
}

.trip-step-btn:active {
  background: rgba(255, 255, 255, 0.22);
}

.trip-slider-date {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  min-width: 58px;
  text-align: right;
  flex-shrink: 0;
}

/* 슬라이더 커스텀 */
.trip-date-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.18);
  outline: none;
  cursor: pointer;
}

.trip-date-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  transition: transform 120ms;
}

.trip-date-slider::-webkit-slider-thumb:active {
  transform: scale(1.15);
}

.trip-date-slider::-moz-range-thumb {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.trip-edit-duration {
  @apply mb-5 text-center text-sm font-semibold;
  color: rgba(255, 255, 255, 0.6);
}

.trip-edit-actions {
  @apply flex gap-2;
}

.trip-edit-btn-cancel {
  @apply flex-1 rounded-2xl py-3 text-sm font-semibold transition;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.trip-edit-btn-save {
  @apply flex-1 rounded-2xl py-3 text-sm font-semibold transition;
  background: rgba(255, 255, 255, 0.9);
  color: #000;
}

.trip-edit-btn-save:hover {
  background: #fff;
}

.trip-edit-btn-delete {
  @apply mt-3 w-full rounded-2xl py-3 text-sm font-semibold transition;
  color: rgba(255, 100, 100, 0.85);
  background: rgba(255, 80, 80, 0.06);
  border: 1px solid rgba(255, 80, 80, 0.15);
}

.trip-edit-btn-delete:hover {
  background: rgba(255, 80, 80, 0.12);
}

.todo-item-wrap {
  @apply relative;
}

.todo-row {
  @apply flex items-center gap-2 rounded-2xl px-3 py-2.5 transition;
  border: 2px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.02);
  -webkit-tap-highlight-color: transparent;
}

.done-row {
  opacity: 0.8;
}

.todo-check {
  @apply grid h-7 w-7 shrink-0 place-items-center rounded-[6px] border transition;
}

.todo-check-on {
  @apply border-white/60 bg-white/10;
}

.todo-check-off {
  @apply border-white/55 bg-transparent;
}

.check-icon {
  font-size: 17px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.92);
  user-select: none;
}

.todo-input {
  @apply w-full bg-transparent text-[16px] outline-none sm:text-[18px];
}

.todo-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.todo-active {
  color: rgba(255, 255, 255, 0.92);
}

.todo-done {
  color: rgba(255, 255, 255, 0.55);
  text-decoration: line-through;
}

.done-toggle {
  @apply flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold transition hover:bg-white/10;
  color: rgba(255, 255, 255, 0.82);
}

.event-card {
  @apply rounded-2xl px-3 py-2.5 transition cursor-pointer;
  border: 2px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.04);
  -webkit-tap-highlight-color: transparent;
}

.event-card:hover {
  background: rgba(255, 255, 255, 0.07);
}

.event-card-open {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.6);
}

.event-card-row {
  @apply flex items-center gap-3;
}

.event-chevron {
  @apply shrink-0 transition-transform duration-200;
  color: rgba(255, 255, 255, 0.5);
}

.event-chevron-open {
  transform: rotate(90deg);
  color: rgba(255, 255, 255, 0.88);
}

.event-detail {
  @apply mt-3 pt-3 space-y-2;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.event-detail-row {
  @apply flex items-center gap-3;
}

.event-detail-label {
  @apply text-xs font-semibold uppercase tracking-widest w-10 shrink-0;
  color: rgba(255, 255, 255, 0.5);
}

.event-detail-value {
  @apply text-sm font-medium;
  color: rgba(255, 255, 255, 0.9);
}

.event-detail-row-col {
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.event-detail-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-detail-memo {
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  color: rgba(255, 255, 255, 0.82);
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  width: 100%;
}

.event-detail-meet {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 2px;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: rgba(26, 115, 232, 0.18);
  border: 1px solid rgba(26, 115, 232, 0.4);
  color: rgba(100, 170, 255, 0.95);
  transition: background 150ms;
}

.event-detail-meet:hover {
  background: rgba(26, 115, 232, 0.28);
}

.meet-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.event-attendees {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.event-attendee {
  display: flex;
  align-items: center;
  gap: 10px;
}

.attendee-avatar {
  display: flex;
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.88);
}

.attendee-info {
  min-width: 0;
}

.attendee-name {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.88);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attendee-status {
  font-size: 11px;
  margin-top: 1px;
}

.status-accepted  { color: #4ade80; }
.status-declined  { color: #f87171; }
.status-tentative { color: #fbbf24; }
.status-needsAction { color: rgba(255,255,255,0.45); }

.event-detail-link {
  @apply mt-1 inline-block text-xs font-semibold transition;
  color: rgba(66, 133, 244, 0.9);
}

.event-detail-link:hover {
  color: rgba(66, 133, 244, 1);
}

.event-expand-enter-active,
.event-expand-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.event-expand-enter-from,
.event-expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.cal-icon {
  @apply flex h-10 w-10 shrink-0 items-center justify-center rounded-xl;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.88);
}

.cal-icon svg {
  width: 24px;
  height: 24px;
}

.event-card-done {
  opacity: 0.55;
}

.other-day-wrap {
  display: flex;
  align-items: stretch;
  gap: 8px;
}

.other-day-wrap .event-card {
  flex: 1;
  min-width: 0;
  opacity: 0.82;
}

.jump-btn {
  display: flex;
  flex-shrink: 0;
  width: 44px;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.82);
  transition: background 150ms, color 150ms;
  -webkit-tap-highlight-color: transparent;
}

.jump-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.95);
}

/* 슬래시 명령어 드롭다운 */
/* 등록 카드 - 왼쪽 공백 없이 입력란만 */
.reg-card-row {
  padding-left: 14px;
  padding-right: 14px;
}

/* 등록 카드의 slash-menu / trip-city 드롭다운은 위로 펼쳐짐 (카드가 맨 아래라 아래쪽은 뷰포트 밖) */
.reg-card-wrap .slash-menu,
.reg-card-wrap .slash-menu ~ .slash-menu {
  top: auto;
  bottom: calc(100% + 6px);
}

/* 등록 카드 가이드 힌트 */
.reg-guide-hint {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  padding-left: 14px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  user-select: none;
  pointer-events: none;
}

.reg-guide-arrow {
  font-size: 16px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.3);
}

.slash-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 20;
  border-radius: 16px;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  background: #111;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55);
  overflow: hidden;
  padding: 6px;
}

.slash-cmd {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  border-radius: 10px;
  padding: 10px 12px;
  text-align: left;
  transition: background 120ms;
  -webkit-tap-highlight-color: transparent;
}

.slash-cmd:hover {
  background: rgba(255, 255, 255, 0.08);
}

.slash-cmd-icon {
  display: flex;
  height: 36px;
  width: 36px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.82);
}

.slash-cmd-text {
  min-width: 0;
}

.slash-cmd-name {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
}

.slash-cmd-desc {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.slash-menu-enter-active,
.slash-menu-leave-active {
  transition: opacity 130ms ease, transform 130ms ease;
}

.slash-menu-enter-from,
.slash-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* /여행 도시 자동완성 아이템 */
.trip-city-cmd {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  padding: 8px 10px;
  text-align: left;
  transition: background 120ms;
  -webkit-tap-highlight-color: transparent;
}

.trip-city-cmd:hover,
.trip-city-cmd-active {
  background: rgba(255, 255, 255, 0.08);
}

.trip-city-cmd-img-wrap {
  width: 48px;
  height: 34px;
  border-radius: 8px;
  flex-shrink: 0;
  overflow: hidden;
}

.trip-city-cmd-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.06);
}

.trip-city-cmd-img-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  background: linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.5));
}

.trip-city-cmd-text {
  min-width: 0;
}

.trip-city-cmd-name {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
}

.trip-city-cmd-country {
  margin-top: 1px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

/* /여행 날짜 선택 드롭다운 */
.trip-date-picker {
  margin: 6px 0 0;
  padding: 14px 14px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(30, 30, 50, 0.88);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trip-date-picker-city {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 6px;
}

.trip-date-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.trip-date-picker-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  width: 28px;
  flex-shrink: 0;
}

.trip-date-picker-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  padding: 5px 8px;
  outline: none;
  color-scheme: dark;
}

.trip-date-picker-input:focus {
  border-color: rgba(255, 255, 255, 0.45);
}

.trip-date-picker-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 2px;
}

.trip-date-picker-cancel {
  font-size: 13px;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
}

.trip-date-picker-confirm {
  font-size: 13px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 8px;
  border: none;
  background: rgba(120, 160, 255, 0.75);
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}

.trip-date-picker-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.trip-date-picker-confirm:not(:disabled):hover {
  background: rgba(120, 160, 255, 0.95);
}

.calendar-badge {
  @apply flex w-[52px] shrink-0 flex-col overflow-hidden rounded-xl border;
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
}

.calendar-month {
  @apply flex h-[22px] items-center justify-center text-[10px] font-bold uppercase tracking-[0.12em];
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.88);
}

.calendar-day {
  @apply flex h-[30px] items-center justify-center text-[20px] font-semibold;
  color: rgba(255, 255, 255, 0.95);
}

.event-badge {
  @apply text-[11px] font-semibold tracking-[0.16em];
  color: rgba(255, 255, 255, 0.72);
}

.event-title {
  @apply mt-0.5 flex items-center gap-2 text-[17px] font-medium;
  color: rgba(255, 255, 255, 0.92);
}

.cal-color-dot {
  @apply inline-block h-2.5 w-2.5 shrink-0 rounded-full;
}

.event-cal-icon {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.5);
}

.event-cal-icon--plane {
  color: rgba(99, 179, 237, 0.9);
}

.event-cal-icon--hotel {
  color: rgba(251, 191, 36, 0.9);
}

.event-cal-icon--video {
  color: rgba(96, 165, 250, 0.9);
}

.event-link-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
  padding: 2px 5px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: background 150ms;
  flex-shrink: 0;
}

.event-link-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.95);
}

.event-title-done {
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.55);
}

.journal-card {
  @apply rounded-2xl border p-4 transition cursor-pointer;
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
}

.journal-card:hover:not(.journal-card-editing) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.22);
}

.journal-card-editing {
  cursor: default;
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.05);
}

.journal-preview {
  font-size: 15px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
  color: rgba(255, 255, 255, 0.82);
  min-height: 52px;
}

.journal-preview-empty {
  color: rgba(255, 255, 255, 0.35);
  font-size: 14px;
}

.journal-head {
  @apply mb-3 flex items-start justify-between gap-3;
}

.journal-head-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.journal-action-btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: background 150ms;
}

.journal-action-delete {
  color: rgba(255, 100, 100, 0.8);
  font-size: 14px;
}

.journal-action-delete:hover {
  background: rgba(255, 80, 80, 0.12);
}

.journal-action-done {
  color: rgba(100, 220, 120, 0.88);
}

.journal-action-done:hover {
  background: rgba(80, 200, 100, 0.12);
}

.journal-label {
  @apply text-[11px] font-semibold uppercase tracking-[0.16em];
  color: rgba(255, 255, 255, 0.72);
}

.journal-date {
  @apply mt-1 text-sm font-medium;
  color: rgba(255, 255, 255, 0.9);
}

.journal-textarea {
  @apply w-full resize-none bg-transparent text-[16px] leading-7 outline-none overflow-hidden;
  color: rgba(255, 255, 255, 0.92);
  min-height: 48px;
}

.journal-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.icon-btn {
  @apply grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition hover:bg-white/10;
  border-color: rgba(255, 255, 255, 0.1);
}

.danger-btn {
  color: rgba(255, 255, 255, 0.7);
}

.danger-btn:hover {
  color: rgba(255, 255, 255, 0.98);
}

.edit-btn {
  color: rgba(255, 255, 255, 0.45);
  font-size: 15px;
}

.edit-btn:hover {
  color: rgba(255, 255, 255, 0.9);
}

.event-edit-modal {
  background: #1e1e2e;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.event-edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-edit-title {
  font-size: 17px;
  font-weight: 700;
  color: rgba(255,255,255,0.92);
}

.event-edit-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.event-edit-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.event-edit-row-time {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.event-edit-time-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.event-edit-time-sep {
  color: rgba(255,255,255,0.3);
  padding-top: 22px;
}

.event-edit-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.45);
  letter-spacing: 0.04em;
}

.event-edit-input {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: rgba(255,255,255,0.88);
  outline: none;
  width: 100%;
  transition: border-color 0.15s;
  color-scheme: dark;
}

.event-edit-input:focus {
  border-color: rgba(255,255,255,0.3);
}

.event-edit-textarea {
  resize: vertical;
  min-height: 72px;
}

.event-edit-colors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.event-edit-color-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  color: rgba(255,255,255,0.5);
}

.event-edit-color-btn:hover {
  opacity: 0.85;
  transform: scale(1.1);
}

.event-edit-color-active {
  border-color: white;
  transform: scale(1.15);
}

.event-edit-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.drag-handle {
  @apply flex shrink-0 items-center justify-center rounded-lg border transition hover:bg-white/10;
  width: 28px;
  height: 28px;
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  cursor: grab;
  display: grid;
  grid-template-columns: repeat(2, 4px);
  grid-template-rows: repeat(3, 4px);
  gap: 3px 3px;
  place-items: center;
  place-content: center;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle span {
  width: 3px;
  height: 3px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.72);
}

.dragging {
  opacity: 0.35;
  transform: scale(0.98);
  transition: opacity 150ms ease, transform 150ms ease;
}

.todo-list-move {
  transition: transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.todo-list-enter-active {
  transition: all 180ms ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.gcal-time {
  @apply text-xs mt-0.5;
  color: rgba(255, 255, 255, 0.45);
}

.confirm-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4;
}

.confirm-modal {
  @apply w-full max-w-[340px] rounded-2xl border p-5;
  border-color: rgba(255, 255, 255, 0.15);
  background: #111;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.confirm-title {
  @apply text-[18px] font-semibold;
  color: rgba(255, 255, 255, 0.96);
}

.confirm-desc {
  @apply mt-1 text-sm truncate;
  color: rgba(255, 255, 255, 0.6);
}

.confirm-actions {
  @apply mt-5 flex items-center justify-end gap-2;
}

.confirm-btn-cancel {
  @apply rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-white/10;
  border-color: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
}

.confirm-btn-delete {
  @apply rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90;
  background: #d93025;
  color: white;
}

.confirm-modal-enter-active,
.confirm-modal-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.confirm-modal-enter-from,
.confirm-modal-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
