export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = config.fastapiBaseUrl
  const cookieAuth = getCookie(event, 'auth_header') || ''
  const clientToken = getHeader(event, 'x-client-token') || ''
  const authHeader = cookieAuth || (clientToken ? `Bearer ${clientToken}` : '')
  const query = getQuery(event)

  try {
    return await ($fetch as any)(`${base}/todo/items`, {
      params: query,
      headers: { Authorization: authHeader },
    })
  } catch {
    return []
  }
})
