export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = config.fastapiBaseUrl
  const authHeader = getCookie(event, 'auth_header') || ''

  try {
    const items: any[] = await ($fetch as any)(`${base}/todo/items`, {
      headers: { Authorization: authHeader },
    })
    return items
      .filter((item) => item.type === 'weekly_goal')
      .sort((a, b) => (b.date_key > a.date_key ? 1 : -1))
  } catch {
    return []
  }
})
