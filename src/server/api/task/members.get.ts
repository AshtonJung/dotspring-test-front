// server/api/task/members.get.ts
export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig()
  const authHeader = getHeader(event, "authorization")
  const base = runtime.fastapiBaseUrl

  const query = getQuery(event)
  const q = typeof query.q === "string" ? query.q : undefined

  return await ($fetch as any)(`${base}/admin/members`, {
    method: "GET",
    query: q ? { q } : undefined,
    headers: authHeader ? { Authorization: authHeader } : undefined,
  })
})