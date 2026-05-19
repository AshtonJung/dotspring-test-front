export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = config.fastapiBaseUrl
  const body = await readBody(event)
  const authHeader = getHeader(event, 'authorization') || getCookie(event, 'auth_header') || ''

  console.log('[weekly-goal POST] base:', base, '| authHeader 있음:', !!authHeader, '| body:', JSON.stringify(body))

  try {
    const result = await ($fetch as any)(`${base}/todo/items`, {
      method: 'POST',
      body,
      headers: { Authorization: authHeader },
    })
    console.log('[weekly-goal POST] 성공:', JSON.stringify(result))
    return result
  } catch (err: any) {
    console.error('[weekly-goal POST] 실패:', err?.data ?? err?.message ?? err)
    throw createError({
      statusCode: err?.response?.status ?? 500,
      statusMessage: err?.data?.detail ?? err?.message ?? '저장 실패',
    })
  }
})
