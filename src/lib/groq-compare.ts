import Groq from 'groq-sdk'
import type { ModelStats, CompareResult, CompareScores } from '../types/index.js'

export async function compareWithAI(
  model1Stats: ModelStats,
  model2Stats: ModelStats,
  purpose: string
): Promise<CompareResult> {
  const groq = new Groq({ apiKey: import.meta.env.GROQ_API_KEY })

  const prompt = `You are an AI model comparison expert. Compare these two AI models for a specific purpose and return ONLY a valid JSON object — no markdown, no backticks, no explanation.

MODEL 1:
Name: ${model1Stats.name}
Provider: ${model1Stats.provider}
Parameters: ${model1Stats.params}
Context Window: ${model1Stats.context_window}
Embedding Dimensions: ${model1Stats.embedding_dims}
Latest Version: ${model1Stats.latest_version}
Pricing: ${model1Stats.pricing}

MODEL 2:
Name: ${model2Stats.name}
Provider: ${model2Stats.provider}
Parameters: ${model2Stats.params}
Context Window: ${model2Stats.context_window}
Embedding Dimensions: ${model2Stats.embedding_dims}
Latest Version: ${model2Stats.latest_version}
Pricing: ${model2Stats.pricing}

PURPOSE: ${purpose}

Score both models 0–100 for this purpose on:
- purpose_fit: How suited for "${purpose}"
- speed: Response generation speed
- accuracy: Reliability and correctness for this purpose
- cost_efficiency: Value for money for this purpose

Return ONLY this JSON, nothing else:
{
  "winner": "exact model name",
  "reason": "one short sentence why it wins",
  "model1": { "scores": { "purpose_fit": 0, "speed": 0, "accuracy": 0, "cost_efficiency": 0 } },
  "model2": { "scores": { "purpose_fit": 0, "speed": 0, "accuracy": 0, "cost_efficiency": 0 } },
  "verdict": "2-3 sentences comparing both for ${purpose}"
}`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 600,
  })

  const raw = response.choices[0]?.message?.content ?? ''
  
  // Robust JSON extraction: find the first '{' and last '}'
  let cleaned = raw
  const firstBrace = raw.indexOf('{')
  const lastBrace = raw.lastIndexOf('}')
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = raw.substring(firstBrace, lastBrace + 1)
  }

  let parsed: {
    winner: string
    reason: string
    model1: { scores: CompareScores }
    model2: { scores: CompareScores }
    verdict: string
  }

  try {
    parsed = JSON.parse(cleaned)
  } catch (e) {
    console.error('[groq-compare] Parse Error. Raw content:', raw)
    throw new Error('AI returned an invalid response format. Please try again.')
  }

  return {
    winner: parsed.winner,
    reason: parsed.reason,
    verdict: parsed.verdict,
    model1: { ...model1Stats, scores: parsed.model1.scores },
    model2: { ...model2Stats, scores: parsed.model2.scores },
    timestamp: Date.now(),
  }
}
