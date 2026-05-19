export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = config.fastapiBaseUrl
  const query = getQuery(event)
  const authHeader = getCookie(event, 'auth_header') || ''

  try {
    const items = await ($fetch as any)(`${base}/todo/items`, {
      params: { date: query.week },
      headers: { Authorization: authHeader },
    })
    return (items as any[]).filter((item: any) => item.type === 'weekly_goal')
  } catch {
    return []
  }
})
