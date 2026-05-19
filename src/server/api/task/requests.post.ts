// server/api/requests.post.ts
export default defineEventHandler(async (event) => {
  const t0 = Date.now()

  const runtime = useRuntimeConfig()

  // (1) 헤더는 먼저 읽고
  const authHeader = getHeader(event, "authorization") || ""

  // (2) body 읽는 시간도 은근히 걸릴 수 있어서 분리
  const tBody0 = Date.now()
  const body = await readBody(event)
  const tBody = Date.now() - tBody0

  const base = runtime.fastapiBaseUrl

  // ✅ 값 로그(필요하면 유지)
  console.log("[REQ_CREATE] BASE:", base)
  console.log("[REQ_CREATE] AUTH exists:", Boolean(authHeader))
  console.log("[REQ_CREATE] BODY size:", JSON.stringify(body || {}).length)

  // ✅ 핵심: 타이밍 로그
  console.log("[REQ_CREATE] readBody:", tBody, "ms")

  const tFetch0 = Date.now()
  try {
    const data = await $fetch(`${base}/requests`, {
      method: "POST",
      body,
      headers: authHeader ? { Authorization: authHeader } : undefined,
    })

    console.log("[REQ_CREATE] fastapi fetch:", Date.now() - tFetch0, "ms")
    console.log("[REQ_CREATE] total:", Date.now() - t0, "ms")

    return data
  } catch (err: any) {
    console.log("[REQ_CREATE] fastapi fetch FAIL:", Date.now() - tFetch0, "ms")
    console.log("[REQ_CREATE] total FAIL:", Date.now() - t0, "ms")
    console.error("[REQ_CREATE] error:", err?.data || err)

    throw err
  }
})