import type { ModelStats } from '../types/index.js'
import modelsData from './models-data.json' with { type: 'json' }

const MODELS = modelsData as Record<string, ModelStats>

export function getModelList() {
  return Object.entries(MODELS).map(([id, m]) => ({
    id,
    name: m.name,
    provider: m.provider,
    type: m.type,
  }))
}

export async function fetchModelStats(modelId: string): Promise<ModelStats> {
  const local = MODELS[modelId]
  if (!local) throw new Error(`Model "${modelId}" not found`)

  if (local.type === 'open' && local.hf_id) {
    try {
      const hfStats = await fetchFromHuggingFace(local.hf_id)
      return { ...local, ...hfStats }
    } catch {
      console.warn(`HuggingFace fetch failed for ${local.hf_id}, using local data`)
    }
  }

  return local
}

async function fetchFromHuggingFace(hfId: string): Promise<Partial<ModelStats>> {
  const token = import.meta.env.HUGGINGFACE_API_KEY
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token && token !== 'your_huggingface_token_here') {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`https://huggingface.co/api/models/${hfId}`, { headers })
  if (!res.ok) throw new Error(`HF API error: ${res.status}`)

  const data = await res.json()
  const safetensors = data.safetensors
  let params = 'N/A'
  if (safetensors?.total) {
    params = `${(safetensors.total / 1e9).toFixed(1)}B`
  }

  return { params, latest_version: data.id ?? undefined }
}
