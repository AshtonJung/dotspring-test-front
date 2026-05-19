// server/api/summary-subjects.get.ts
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const date = String(q.date ?? '')

  if (!date) {
    throw createError({ statusCode: 400, statusMessage: 'date is required' })
  }

  const url = new URL('https://newsdailysummary.k8s.dlab.kr/summary/subjects')
  url.searchParams.set('date', date)

  return await ($fetch as any)(url.toString())
})