export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = config.fastapiBaseUrl
  const authHeader = getCookie(event, 'auth_header') || ''
  try {
    return await ($fetch as any)(`${base}/todo/journals`, {
      headers: { Authorization: authHeader },
    })
  } catch {
    return []
  }
})
