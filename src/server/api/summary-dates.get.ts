// server/api/summary-dates.get.ts
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const limit = String(q.limit ?? '30')

  const url = new URL('https://newsdailysummary.k8s.dlab.kr/summary/dates')
  url.searchParams.set('limit', limit)

  return await ($fetch as any)(url.toString())
})