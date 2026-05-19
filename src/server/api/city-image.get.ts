export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const key = config.unsplashAccessKey
  if (!key) return { url: null }

  const { city, country } = getQuery(event) as { city?: string; country?: string }
  if (!city) return { url: null }

  const query = country ? `${city} ${country} landmark cityscape` : `${city} landmark cityscape`

  try {
    const res: any = await $fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` } }
    )
    const photo = res?.results?.[0]
    if (!photo) return { url: null }
    return {
      url: `${photo.urls.raw}&w=800&h=500&fit=crop&q=80`,
      credit: photo.user?.name ?? '',
      creditLink: photo.links?.html ?? '',
    }
  } catch {
    return { url: null }
  }
})
