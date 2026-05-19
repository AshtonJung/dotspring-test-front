export default defineEventHandler(async (event) => {
  const googleToken = getCookie(event, 'GOOGLE_AT')
  if (!googleToken) {
    throw createError({ statusCode: 401, statusMessage: 'Google 토큰 없음' })
  }

  const body = await readBody(event)
  const { calendarId = 'primary', title, dateKey, startTime, endTime } = body

  if (!title || !dateKey) {
    throw createError({ statusCode: 400, statusMessage: 'title, dateKey 필수' })
  }

  // 시간 없으면 하루 종일 이벤트
  const eventBody: any = {
    summary: title,
  }

  if (startTime && endTime) {
    eventBody.start = { dateTime: `${dateKey}T${startTime}:00`, timeZone: 'Asia/Seoul' }
    eventBody.end   = { dateTime: `${dateKey}T${endTime}:00`,   timeZone: 'Asia/Seoul' }
  } else {
    const nextDay = new Date(dateKey)
    nextDay.setDate(nextDay.getDate() + 1)
    const nextDayKey = nextDay.toISOString().slice(0, 10)
    eventBody.start = { date: dateKey }
    eventBody.end   = { date: nextDayKey }
  }

  try {
    const res: any = await $fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleToken}`,
          'Content-Type': 'application/json',
        },
        body: eventBody,
      }
    )
    return { id: res.id, htmlLink: res.htmlLink }
  } catch (e: any) {
    console.error('[calendar/event] create error', e?.data || e?.message)
    throw createError({ statusCode: 502, statusMessage: '캘린더 이벤트 등록 실패' })
  }
})
