// 도시 목록을 받아 Unsplash에서 이미지 URL 일괄 조회
// Rate limit: 50 req/hour → 호출 간격 조절 필요
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const key = config.unsplashAccessKey
  if (!key) return { results: [] }

  const body = await readBody(event) as { cities: Array<{ name: string; countryKo: string }> }
  if (!body?.cities?.length) return { results: [] }

  const results: Array<{ name: string; url: string | null }> = []

  for (const city of body.cities) {
    const query = `${city.name} ${city.countryKo} landmark cityscape`
    try {
      const res: any = await $fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${key}` } }
      )
      const photo = res?.results?.[0]
      results.push({
        name: city.name,
        url: photo ? `${photo.urls.raw}&w=800&h=500&fit=crop&q=80` : null,
      })
    } catch {
      results.push({ name: city.name, url: null })
    }
    // Unsplash rate limit 대응: 요청 간 75ms 간격 (50req/hour = ~1req/72ms)
    await new Promise((r) => setTimeout(r, 80))
  }

  return { results }
})
