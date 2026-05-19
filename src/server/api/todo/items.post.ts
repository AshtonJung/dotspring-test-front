export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = config.fastapiBaseUrl
  const cookieAuth = getCookie(event, 'auth_header') || ''
  const clientToken = getHeader(event, 'x-client-token') || ''
  const authHeader = cookieAuth || (clientToken ? `Bearer ${clientToken}` : '')
  const body = await readBody(event)

  return await ($fetch as any)(`${base}/todo/items`, {
    method: 'POST',
    body,
    headers: { Authorization: authHeader },
  })
})
