export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig()
  const authHeader = getHeader(event, "authorization")
  const base = runtime.fastapiBaseUrl

  const query = getQuery(event) // q, status
  return await ($fetch as any)(`${base}/requests`, {
    method: "GET",
    query,
    headers: authHeader ? { Authorization: authHeader } : undefined,
  })
})