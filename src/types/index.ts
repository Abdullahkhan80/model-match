export interface ModelStats {
  name: string
  provider: string
  params: string
  context_window: string
  embedding_dims: string
  latest_version: string
  pricing: string
  type: 'open' | 'closed'
  hf_id?: string
}

export interface CompareScores {
  purpose_fit: number
  speed: number
  accuracy: number
  cost_efficiency: number
}

export interface CompareResult {
  winner: string
  reason: string
  model1: ModelStats & { scores: CompareScores }
  model2: ModelStats & { scores: CompareScores }
  verdict: string
  cached?: boolean
  timestamp?: number
}

export interface CompareRequest {
  model1: string
  model2: string
  purpose: string
}
