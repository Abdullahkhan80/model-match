import type { APIRoute } from 'astro'
import { fetchModelStats } from '../../lib/model-fetcher.js'
import { compareWithAI } from '../../lib/groq-compare.js'
import { getCacheKey, getCache, setCache } from '../../lib/cache.js'
import type { CompareRequest } from '../../types/index.js'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as CompareRequest
    const { model1, model2, purpose } = body

    if (!model1 || !model2 || !purpose) {
      return new Response(
        JSON.stringify({ error: 'model1, model2, and purpose are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (model1 === model2) {
      return new Response(
        JSON.stringify({ error: 'Please select two different models' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const cacheKey = getCacheKey(model1, model2, purpose)
    const cached = getCache(cacheKey)
    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const [stats1, stats2] = await Promise.all([
      fetchModelStats(model1),
      fetchModelStats(model2),
    ])

    const result = await compareWithAI(stats1, stats2, purpose)
    setCache(cacheKey, result)

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong'
    console.error('[compare]', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
