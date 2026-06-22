# ModelMatch

> **Find the right AI model for your task.** Compare any two LLMs side-by-side with AI-powered analysis across technical specs, task-specific performance, and cost efficiency.

![ModelMatch Screenshot](./public/screenshot.png)

---

## Overview

With 30+ AI models available today — GPT-4o, Claude 4 Sonnet, Gemini 2.5 Pro, Grok 3, DeepSeek R1, and more — choosing the right one for a specific task has become a guessing game. Each model has unique strengths, different context windows, varying parameter counts, and different pricing structures.

ModelMatch eliminates the guesswork by letting you pick any two models, select your task, and get an instant AI-generated comparison with scored metrics and a clear winner.

---

## Features

- **30+ models** — Compare models from OpenAI, Anthropic, Google, Meta, xAI, DeepSeek, Mistral, Cohere, Microsoft, Amazon, Alibaba, and more
- **Full technical specs** — View parameters, context window, embedding dimensions, latest version, and pricing per 1M tokens in a clean comparison table
- **8 task categories** — Compare for Coding, Writing, Research, Math/Logic, Chat, Data Analysis, Image Generation, or Video Generation
- **AI benchmark scoring** — Each model is scored 0–100 on purpose fit, speed, accuracy, and cost efficiency for your selected task
- **AI verdict** — Get a clear winner with an explanation and detailed verdict
- **Live open-source stats** — For open-weight models, parameter counts are fetched live from Hugging Face
- **24-hour cache** — Results are cached to reduce API calls and improve response times
- **No sign-ups** — Completely free, no account required

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 4 (SSR) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Engine | Groq API (Llama 3.3 70B) |
| Live Stats | Hugging Face Hub API |
| Deployment | Vercel (Node.js 20) |
| Cache | In-memory (24hr TTL) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- [Groq API key](https://console.groq.com) (free)
- [Hugging Face token](https://huggingface.co/settings/tokens) (free, for open-source model stats)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/modelmatch.git
cd modelmatch

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `.env` with your API keys:

```env
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_token
```

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── pages/
│   ├── index.astro           # Main UI — model selection, dropdowns, results
│   └── api/
│       └── compare.ts        # POST /api/compare — orchestrates comparison
├── lib/
│   ├── groq-compare.ts       # AI prompt construction & JSON parsing
│   ├── model-fetcher.ts      # Model stats lookup + Hugging Face enrichment
│   ├── cache.ts              # 24-hour in-memory cache
│   └── models-data.json      # Static specs for all 30+ models
└── types/
    └── index.ts              # TypeScript interfaces
```

---

## How It Works

1. **Select models** — Choose two models from the dropdown (30+ options grouped by provider)
2. **Choose a task** — Pick from 8 purpose categories (Coding, Writing, Research, etc.)
3. **AI comparison** — The server sends both models' specs + your task to Groq's Llama 3.3 70B, which scores each model on purpose fit, speed, accuracy, and cost efficiency
4. **Results** — A winner is declared with scores, a technical spec table, and an AI verdict explaining the recommendation

---

## Adding New Models

1. Add an entry to `src/lib/models-data.json`
2. Optionally add a provider color in `src/pages/index.astro` (the `PROVIDER_COLORS` map)
3. If the model is open-weight, include a `hf_id` for automatic parameter count fetching

---

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

Add `GROQ_API_KEY` and `HUGGINGFACE_API_KEY` in Vercel → Settings → Environment Variables.

---

## License

[MIT](./LICENSE)
