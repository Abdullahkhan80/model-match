import type { CompareResult } from '../types/index.js'

interface CacheEntry {
  result: CompareResult
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
const TTL = parseInt(import.meta.env.CACHE_TTL_SECONDS ?? '86400') * 1000

export function getCacheKey(model1: string, model2: string, purpose: string) {
  const sorted = [model1, model2].sort().join('__')
  return `${sorted}__${purpose.toLowerCase().replace(/\s+/g, '_')}`
}

export function getCache(key: string): CompareResult | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > TTL) {
    cache.delete(key)
    return null
  }
  return { ...entry.result, cached: true }
}

export function setCache(key: string, result: CompareResult) {
  cache.set(key, { result, timestamp: Date.now() })
}
