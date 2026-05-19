// src/server/api/keyword-suggest.post.ts
import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ category?: string; name?: string; region?: string }>(event)
    const category = (body?.category || '').trim()
    const name = (body?.name || '').trim()
    const region = (body?.region || '').trim()

    if (!category) {
      setResponseStatus(event, 400)
      return { ok: false, error: 'category is required' }
    }

    const config = useRuntimeConfig()
    if (!config.openaiApiKey) {
      setResponseStatus(event, 500)
      return { ok: false, error: 'OPENAI_API_KEY is missing (runtimeConfig.openaiApiKey)' }
    }

    const client = new OpenAI({ apiKey: config.openaiApiKey })

    const prompt = `
당신은 한인 비즈니스 디렉토리 등록을 돕는 도우미입니다.
아래 정보를 바탕으로 "키워드 후보"를 12~18개 추천해 주세요.

- 업종: ${category}
- 상호(선택): ${name || '(없음)'}
- 지역(선택): ${region || '(없음)'}

조건:
- 키워드는 짧은 명사/명사구 형태로 (예: 주차가능, 단체예약, 포장가능, 예약필수 등)
- 중복 없이
- 한국어로
- JSON 배열로만 출력 (예: ["키워드1","키워드2",...])
`.trim()

    // ✅ 모델은 text 생성용으로 (프로젝트에 맞춰 변경 가능)
    const completion = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    })

    const raw = completion.choices?.[0]?.message?.content || '[]'

    let keywords: string[] = []
    try {
      keywords = JSON.parse(raw)
    } catch {
      // JSON이 깨져오면 최소한의 파싱 보정
      keywords = raw
        .replace(/[\[\]\n"]/g, '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }

    // 안전 필터
    keywords = Array.from(new Set(keywords)).slice(0, 24)

    return { ok: true, keywords }
  } catch (err: any) {
    console.error('[/api/keyword-suggest] error:', err)
    setResponseStatus(event, 500)
    return { ok: false, error: err?.message || 'unknown error' }
  }
})