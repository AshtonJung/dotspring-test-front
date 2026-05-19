export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = config.fastapiBaseUrl
  const cookieAuth = getCookie(event, 'auth_header') || ''
  const clientToken = getHeader(event, 'x-client-token') || ''
  const authHeader = cookieAuth || (clientToken ? `Bearer ${clientToken}` : '')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  return await ($fetch as any)(`${base}/todo/items/${id}`, {
    method: 'PATCH',
    body,
    headers: { Authorization: authHeader },
  })
})
