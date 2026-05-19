// server/api/summary-representative.get.ts
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const subject = String(q.subject ?? '정치')
  const date = String(q.date ?? '')
  const limit = String(q.limit ?? '10')

  const url = new URL('https://newsdailysummary.k8s.dlab.kr/summary/articles/representative')
  url.searchParams.set('subject', subject)
  url.searchParams.set('date', date)
  url.searchParams.set('limit', limit)

  return await ($fetch as any)(url.toString())
})