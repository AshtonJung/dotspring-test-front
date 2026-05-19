export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig()
  const authHeader = getHeader(event, "authorization")
  const base = runtime.fastapiBaseUrl
  const id = getRouterParam(event, "id")

  return await ($fetch as any)(`${base}/requests/${id}`, {
    method: "GET",
    headers: authHeader ? { Authorization: authHeader } : undefined,
  })
})