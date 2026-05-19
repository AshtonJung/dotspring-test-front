export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = config.fastapiBaseUrl
  const query = getQuery(event)
  const authHeader = getCookie(event, 'auth_header') || ''

  try {
    return await $fetch<{ ordered_keys: string[] }>(`${base}/todo/calendar-sort`, {
      params: { date: query.date },
      headers: { Authorization: authHeader },
    })
  } catch {
    return { ordered_keys: [] }
  }
})
