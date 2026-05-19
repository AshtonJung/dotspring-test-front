type TodoBlock    = { id: number; type: 'todo';    text: string; done: boolean }
type EventBlock   = { id: number; type: 'event';   title: string; month: string; day: string; dateKey: string; done: boolean; startTime?: string; endTime?: string; location?: string; memo?: string; url?: string; color?: string }
type JournalBlock = { id: number; type: 'journal'; dateKey: string; content: string; done: boolean }
type TripBlock    = { id: number; type: 'trip';    city: string; country: string; startDateKey: string; endDateKey: string; startText: string; endText: string; imageUrl: string; done: boolean }
export type ItemBlock = TodoBlock | EventBlock | JournalBlock | TripBlock

// API 응답 → 프론트 블록 타입 변환
function mapApiToBlock(item: any): ItemBlock {
  if (item.type === 'event') {
    return {
      id: item.id, type: 'event',
      title: item.title ?? '',
      month: item.event_month ?? '',
      day: item.event_day ?? '',
      dateKey: item.date_key,
      done: item.done,
      startTime: item.event_start_time ?? undefined,
      endTime: item.event_end_time ?? undefined,
      location: item.event_location ?? undefined,
      memo: item.event_memo ?? undefined,
      url: item.event_url ?? undefined,
      color: item.event_color ?? undefined,
    }
  }
  if (item.type === 'journal') {
    return { id: item.id, type: 'journal', dateKey: item.date_key, content: item.journal_content ?? '', done: item.done }
  }
  if (item.type === 'trip') {
    return {
      id: item.id, type: 'trip',
      city: item.trip_city ?? '', country: item.trip_country ?? '',
      startDateKey: item.trip_start_key ?? '', endDateKey: item.trip_end_key ?? '',
      startText: item.trip_start_text ?? '', endText: item.trip_end_text ?? '',
      imageUrl: item.trip_image_url ?? '',
      done: item.done,
    }
  }
  // todo (default)
  return { id: item.id, type: 'todo', text: item.text ?? '', done: item.done }
}

function getClientToken(): string {
  if (!process.client) return ''
  return sessionStorage.getItem('DDSP_AT') || ''
}

function clientHeaders(): Record<string, string> {
  const t = getClientToken()
  return t ? { 'x-client-token': t } : {}
}

// Capacitor 앱(모바일)에서는 외부 절대 URL, 웹(개발/프로덕션)에서는 상대 URL
function apiUrl(path: string): string {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string
  // localhost/127.0.0.1이 아닌 외부 URL(예: https://woojooverse.com)인 경우만 절대 경로 사용
  // → Capacitor 앱 전용. 웹 환경에서는 Nitro 프록시 경유를 위해 상대 URL 사용
  if (base && base.startsWith('http') && !base.includes('127.0.0.1') && !base.includes('localhost')) {
    return `${base}${path}`
  }
  return path
}

export function useTodo() {
  async function fetchItems(dateKey: string): Promise<ItemBlock[]> {
    const res = await $fetch<any[]>(apiUrl('/api/todo/items'), {
      params: { date: dateKey },
      headers: clientHeaders(),
    })
    return res.map(mapApiToBlock)
  }

  async function createItem(body: object): Promise<ItemBlock> {
    const res: any = await $fetch(apiUrl('/api/todo/items'), {
      method: 'POST',
      body,
      headers: clientHeaders(),
    })
    return mapApiToBlock(res)
  }

  async function updateItem(id: number, body: object): Promise<ItemBlock> {
    const res: any = await $fetch(apiUrl(`/api/todo/items/${id}`), {
      method: 'PATCH',
      body,
      headers: clientHeaders(),
    })
    return mapApiToBlock(res)
  }

  async function deleteItem(id: number): Promise<void> {
    await $fetch(apiUrl(`/api/todo/items/${id}`), {
      method: 'DELETE',
      headers: clientHeaders(),
    })
  }

  async function reorderItems(orderedIds: number[]): Promise<void> {
    await $fetch(apiUrl('/api/todo/items/reorder'), {
      method: 'PATCH',
      body: { ordered_ids: orderedIds },
      headers: clientHeaders(),
    })
  }

  async function fetchTrips(): Promise<any[]> {
    return await $fetch<any[]>(apiUrl('/api/todo/trips'), { headers: clientHeaders() })
  }

  async function getCalendarSort(dateKey: string): Promise<string[]> {
    const res: any = await $fetch(apiUrl('/api/todo/calendar-sort'), { params: { date: dateKey } })
    return res.ordered_keys || []
  }

  async function saveCalendarSort(dateKey: string, orderedKeys: string[]): Promise<void> {
    await $fetch(apiUrl('/api/todo/calendar-sort'), {
      method: 'POST',
      body: { date_key: dateKey, ordered_keys: orderedKeys },
    })
  }

  return { fetchItems, createItem, updateItem, deleteItem, reorderItems, fetchTrips, getCalendarSort, saveCalendarSort }
}
