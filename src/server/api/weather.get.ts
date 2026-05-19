// Open-Meteo 날씨 API (무료, API 키 불필요)
// geocoding → lat/lon → 날씨 예보

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

// WMO 날씨 코드 → iconType + 설명
function weatherInfo(code: number): { iconType: string; label: string } {
  if (code === 0)               return { iconType: 'sun',             label: '맑음' }
  if (code === 1)               return { iconType: 'cloud-sun',       label: '대체로 맑음' }
  if (code === 2)               return { iconType: 'cloud-sun',       label: '구름 조금' }
  if (code === 3)               return { iconType: 'cloudy',          label: '흐림' }
  if ([45, 48].includes(code))  return { iconType: 'cloud-fog',       label: '안개' }
  if ([51, 53, 55].includes(code)) return { iconType: 'cloud-drizzle', label: '이슬비' }
  if ([61, 63, 65].includes(code)) return { iconType: 'cloud-rain',   label: '비' }
  if ([71, 73, 75, 77].includes(code)) return { iconType: 'cloud-snow', label: '눈' }
  if ([80, 81, 82].includes(code)) return { iconType: 'cloud-rain',   label: '소나기' }
  if ([85, 86].includes(code))  return { iconType: 'cloud-snow',      label: '눈소나기' }
  if ([95, 96, 99].includes(code)) return { iconType: 'cloud-lightning', label: '뇌우' }
  return { iconType: 'cloud', label: '' }
}

export default defineEventHandler(async (event) => {
  const { city, date } = getQuery(event) as { city?: string; date?: string }
  if (!date) return null

  // 오늘 기준 10일 초과면 날씨 없음
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const target = new Date(date); target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000)
  if (diffDays < -1 || diffDays > 10) return null

  // 도시 → lat/lon (기본: 서울)
  let lat = 37.5665, lon = 126.9780
  const cityName = city || 'Seoul'

  if (cityName !== 'Seoul') {
    try {
      const geo: any = await $fetch(`${GEO_URL}?name=${encodeURIComponent(cityName)}&count=1&language=ko`)
      if (geo?.results?.[0]) {
        lat = geo.results[0].latitude
        lon = geo.results[0].longitude
      }
    } catch {}
  }

  // 날씨 예보 (최대 10일)
  try {
    const days = Math.max(diffDays + 2, 2)
    const weather: any = await $fetch(
      `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FSeoul&forecast_days=${days}`
    )

    const dates: string[] = weather?.daily?.time ?? []
    const idx = dates.indexOf(date)
    if (idx === -1) return null

    const code = weather.daily.weathercode[idx]
    const max = Math.round(weather.daily.temperature_2m_max[idx])
    const min = Math.round(weather.daily.temperature_2m_min[idx])
    const { iconType, label } = weatherInfo(code)

    return { iconType, label, max, min }
  } catch {
    return null
  }
})
