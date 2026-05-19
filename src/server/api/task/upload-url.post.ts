// server/api/task/upload-url.post.ts
export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig()
  const body = await readBody(event)
  const authHeader = getHeader(event, "authorization")

  const base = runtime.fastapiBaseUrl

  return await ($fetch as any)(`${base}/requests/upload-url`, {
    method: "POST",
    body,
    headers: authHeader ? { Authorization: authHeader } : undefined,
  })
})