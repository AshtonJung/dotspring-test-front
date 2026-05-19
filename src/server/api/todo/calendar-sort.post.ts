export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = config.fastapiBaseUrl
  const body = await readBody(event)
  const authHeader = getCookie(event, 'auth_header') || ''

  try {
    return await $fetch<{ ordered_keys: string[] }>(`${base}/todo/calendar-sort`, {
      method: 'POST',
      body,
      headers: { Authorization: authHeader },
    })
  } catch {
    return { ordered_keys: [] }
  }
})
