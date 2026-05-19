export default defineEventHandler(async (event) => {
  const googleToken = getCookie(event, 'GOOGLE_AT')
  if (!googleToken) {
    throw createError({ statusCode: 401, statusMessage: 'Google 토큰 없음' })
  }

  const body = await readBody(event)
  const { calendarId = 'primary', eventId } = body

  if (!eventId) {
    throw createError({ statusCode: 400, statusMessage: 'eventId 필수' })
  }

  try {
    await $fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${googleToken}` },
      }
    )
    return { ok: true }
  } catch (e: any) {
    console.error('[calendar/event] delete error', e?.data || e?.message)
    throw createError({ statusCode: 502, statusMessage: '캘린더 이벤트 삭제 실패' })
  }
})
