import { askWithWebSearch } from "@/lib/openaiClient";
import { getCachedData, setCachedData } from "@/lib/firebaseCache";

const COLLECTION = "startups_cache";
const DOC_ID = "data";

export default async function handler(req, res) {
  try {
    const cached = await getCachedData(COLLECTION, DOC_ID);
    if (cached) {
      return res.status(200).json({ source: "cache", data: cached });
    }

    const prompt = `You are UNTOUCHABLE, an AI startup prediction engine. Search the web for the latest startup and venture capital news from TODAY. Find:

1. Recently funded startups (Series A/B/C rounds)
2. Startup layoffs, pivots, or failures
3. Hot sectors and emerging trends
4. Founder and company signals

Based on real web data, generate startup success/failure predictions.

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "trackedStartups": [
    {
      "name": "<real startup name>",
      "sector": "<e.g. AI/ML, FinTech, HealthTech, CleanTech>",
      "stage": "<e.g. Series A, Series B, Seed>",
      "prediction": "<SUCCESS or FAILURE>",
      "confidence": <number 55-90>,
      "reasoning": "<1-2 sentences with real data>",
      "signals": {
        "founder": <0-100>,
        "retention": <0-100>,
        "traction": <0-100>,
        "funding": <0-100>,
        "timing": <0-100>
      },
      "flagType": "<green or red>",
      "flagDetail": "<brief explanation>"
    }
  ],
  "predictions": [
    {
      "id": "pred_startup_001",
      "type": "STARTUP",
      "asset": "<startup name>",
      "prediction": "<SUCCESS or FAILURE>",
      "confidence": <number 55-90>,
      "timeframe": "12-24 months",
      "signals": [
        {"name": "authentic_founder", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "strong_retention", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "customer_traction", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "funding_velocity", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "market_timing", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real data>"}
      ],
      "timestamp": "<ISO timestamp>",
      "status": "active"
    }
  ],
  "accuracy": {"overall": 75, "correct": 15, "total": 20},
  "stats": {"tracking": <number of startups>, "successRate": <percent>, "redFlags": <number>},
  "lastUpdated": "<ISO timestamp>"
}

Include 4 tracked startups and 1-2 predictions. Use real startup names and data found via web search.`;

    const raw = await askWithWebSearch(prompt);
    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse startup data", raw });
    }

    await setCachedData(COLLECTION, DOC_ID, data);
    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("Startups API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
