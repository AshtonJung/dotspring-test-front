export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const subject = String(q.subject ?? '')
  const date = String(q.date ?? '')

  if (!subject || !date) {
    throw createError({ statusCode: 400, statusMessage: 'subject and date are required' })
  }

  const url = new URL('https://newsdailysummary.k8s.dlab.kr/summary/daily')
  url.searchParams.set('subject', subject)
  url.searchParams.set('date', date)

  return await ($fetch as any)(url.toString())
})