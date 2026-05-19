// server/api/task/requests/[id]/files.post.ts
export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig()
  const authHeader = getHeader(event, "authorization")
  const body = await readBody(event)

  const id = getRouterParam(event, "id")
  const base = runtime.fastapiBaseUrl

  return await ($fetch as any)(`${base}/requests/${id}/files`, {
    method: "POST",
    body,
    headers: authHeader ? { Authorization: authHeader } : undefined,
  })
})