# WhichAI 🤖 — Astro

> Pick two AI models, choose your task, instantly see which one wins with real stats.

## Stack
- **Astro 4** + TypeScript + Tailwind CSS
- **Groq API** (free) — Llama 3.3 70B for AI comparison
- **HuggingFace Hub API** (free) — live stats for open-source models
- **In-memory cache** — 24hr caching to save API quota

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create your `.env` file
```bash
cp .env.example .env
```

Fill in your keys:
```env
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_token_here
```

### 3. Get API keys (both FREE)

**Groq:** https://console.groq.com → API Keys → Create API Key

**HuggingFace:** https://huggingface.co/settings/tokens → New token (Read)

### 4. Run
```bash
npm run dev
```
Open http://localhost:4321

---

## Project Structure

```
src/
├── pages/
│   ├── index.astro          ← Main UI page
│   └── api/
│       └── compare.ts       ← POST /api/compare endpoint
├── lib/
│   ├── groq-compare.ts      ← Groq AI comparison logic
│   ├── model-fetcher.ts     ← HuggingFace + local JSON fetcher
│   ├── cache.ts             ← 24hr in-memory cache
│   └── models-data.json     ← Stats for 12 models
└── types/
    └── index.ts             ← TypeScript types
```

## Adding New Models

1. Add entry to `src/lib/models-data.json`
2. Add to the `MODELS` array in `src/pages/index.astro`

## Deploy to Vercel
```bash
npm i -g vercel
vercel
```
Add env vars in Vercel → Settings → Environment Variables.
