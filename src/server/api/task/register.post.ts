// server/api/task/register.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  return await ($fetch as any)(`${config.public.apiBase}/auth/register`, {
    method: "POST",
    body,
  })
})