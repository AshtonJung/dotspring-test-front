export default defineEventHandler(async (event) => {
  const googleToken = getCookie(event, 'GOOGLE_AT')
  if (!googleToken) {
    throw createError({ statusCode: 401, statusMessage: 'Google 토큰 없음' })
  }

  try {
    const res: any = await $fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        headers: { Authorization: `Bearer ${googleToken}` },
        params: { minAccessRole: 'writer' },
      }
    )
    return (res.items || []).map((cal: any) => ({
      id: cal.id,
      summary: cal.summary,
      primary: cal.primary || false,
      backgroundColor: cal.backgroundColor || '#4285F4',
    }))
  } catch (e: any) {
    console.error('[calendars] fetch error', e?.data || e?.message)
    throw createError({ statusCode: 502, statusMessage: '캘린더 목록 조회 실패' })
  }
})
