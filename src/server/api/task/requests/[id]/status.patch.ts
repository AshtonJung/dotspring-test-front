export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig()
  const authHeader = getHeader(event, "authorization")
  const base = runtime.fastapiBaseUrl
  const id = getRouterParam(event, "id")
  const body = await readBody(event)

  return await ($fetch as any)(`${base}/requests/${id}/status`, {
    method: "PATCH",
    body,
    headers: authHeader ? { Authorization: authHeader } : undefined,
  })
})