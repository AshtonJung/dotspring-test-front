export default defineEventHandler(async (event) => {
  const googleToken = getCookie(event, 'GOOGLE_AT')
  if (!googleToken) {
    throw createError({ statusCode: 401, statusMessage: 'Google 토큰 없음' })
  }

  const query = getQuery(event)
  const dateKey = (query.date as string) || new Date().toISOString().slice(0, 10)

  // 해당 날짜가 속한 주 (일~토) 범위
  const base = new Date(dateKey)
  const sunday = new Date(base)
  sunday.setDate(base.getDate() - base.getDay())
  sunday.setHours(0, 0, 0, 0)
  const saturday = new Date(sunday)
  saturday.setDate(sunday.getDate() + 6)
  saturday.setHours(23, 59, 59, 999)

  const params = {
    timeMin: sunday.toISOString(),
    timeMax: saturday.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '50',
  }
  const headers = { Authorization: `Bearer ${googleToken}` }

  try {
    // 1. 쓰기 가능한 캘린더 목록 (색상 포함)
    const calRes: any = await $fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      { headers, params: { minAccessRole: 'writer' } }
    )
    const calendars: Array<{ id: string; color: string }> = (calRes.items || []).map((c: any) => ({
      id: c.id,
      color: c.backgroundColor || '#4285F4',
    }))

    // 2. 모든 캘린더 이벤트 병렬 조회
    const results = await Promise.allSettled(
      calendars.map((cal) =>
        ($fetch as any)(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events`,
          { headers, params }
        ).then((res: any) =>
          (res.items || []).map((item: any) => {
            const start = item.start?.dateTime || item.start?.date || ''
            const attendees = (item.attendees || [])
              .filter((a: any) => !a.self)
              .map((a: any) => ({ name: a.displayName || a.email, email: a.email, status: a.responseStatus }))
            return {
              id: item.id,
              title: item.summary || '(제목 없음)',
              dateKey: start.slice(0, 10),
              start: item.start?.dateTime || item.start?.date || '',
              end: item.end?.dateTime || item.end?.date || '',
              allDay: !!item.start?.date && !item.start?.dateTime,
              htmlLink: item.htmlLink || '',
              calendarId: cal.id,
              calendarColor: cal.color,
              description: item.description || '',
              location: item.location || '',
              hangoutLink: item.hangoutLink || '',
              attendees,
              status: item.status || '',
            }
          })
        )
      )
    )

    // 3. 성공한 것만 합치기 (id 중복 제거)
    const seen = new Set<string>()
    const allEvents: any[] = []
    for (const r of results) {
      if (r.status === 'fulfilled') {
        for (const ev of r.value as any[]) {
          if (!seen.has(ev.id)) {
            seen.add(ev.id)
            allEvents.push(ev)
          }
        }
      }
    }
    return allEvents
  } catch (e: any) {
    console.error('[calendar] fetch error', e?.data || e?.message)
    throw createError({ statusCode: 502, statusMessage: '캘린더 조회 실패' })
  }
})
