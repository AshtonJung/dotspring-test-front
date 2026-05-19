// server/api/task/check-username.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  return await ($fetch as any)(`${config.public.apiBase}/auth/check-username`, {
    method: "POST",
    body,
  })
})