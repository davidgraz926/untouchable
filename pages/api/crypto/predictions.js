import { askWithWebSearch } from "@/lib/openaiClient";
import { getCachedData, setCachedData } from "@/lib/firebaseCache";

const COLLECTION = "crypto_cache";
const DOC_ID = "predictions";

export default async function handler(req, res) {
  try {
    // Check Firebase cache first
    const cached = await getCachedData(COLLECTION, DOC_ID);
    if (cached) {
      return res.status(200).json({ source: "cache", data: cached });
    }

    // Fetch predictions via OpenAI web search
    const prompt = `You are UNTOUCHABLE, an AI crypto prediction engine. Search the web for the latest Bitcoin and Ethereum news, price action, whale activity, social sentiment, exchange flows, and market data from TODAY.

Based on your real-time web research, generate crypto predictions. Analyze:
1. Whale wallet movements (large BTC/ETH transfers)
2. Social media sentiment (Twitter/X, Reddit crypto communities)
3. Exchange inflows/outflows
4. Trading volume anomalies
5. Cross-asset correlation breaks

Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
{
  "predictions": [
    {
      "id": "pred_btc_001",
      "type": "CRYPTO",
      "asset": "BTC",
      "prediction": "<PUMP or DUMP>",
      "confidence": <number 60-95>,
      "timeframe": "<e.g. 24-48 hours>",
      "targetMove": "<e.g. +8% to +14%>",
      "entryPrice": "<current price as string with $>",
      "targetPrice": "<target range as string with $>",
      "reasoning": "<1-2 sentence explanation based on real data found>",
      "signals": [
        {"name": "whale_accumulation", "active": <true/false>, "strength": <0.0-1.0>, "detail": "<real data found from web>"},
        {"name": "social_surge", "active": <true/false>, "strength": <0.0-1.0>, "detail": "<real data found>"},
        {"name": "exchange_outflow", "active": <true/false>, "strength": <0.0-1.0>, "detail": "<real data found>"},
        {"name": "volume_spike", "active": <true/false>, "strength": <0.0-1.0>, "detail": "<real data found>"},
        {"name": "correlation_break", "active": <true/false>, "strength": <0.0-1.0>, "detail": "<real data found>"}
      ],
      "timestamp": "<current ISO timestamp>",
      "status": "active"
    },
    {
      "id": "pred_eth_001",
      "type": "CRYPTO",
      "asset": "ETH",
      "prediction": "<PUMP or DUMP>",
      "confidence": <number 60-95>,
      "timeframe": "<e.g. 48-72 hours>",
      "targetMove": "<e.g. +5% to +10%>",
      "entryPrice": "<current price>",
      "targetPrice": "<target range>",
      "reasoning": "<explanation>",
      "signals": [
        {"name": "whale_accumulation", "active": <true/false>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "social_surge", "active": <true/false>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "exchange_outflow", "active": <true/false>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "volume_spike", "active": <true/false>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "correlation_break", "active": <true/false>, "strength": <0.0-1.0>, "detail": "<real data>"}
      ],
      "timestamp": "<current ISO timestamp>",
      "status": "active"
    }
  ],
  "accuracy": {
    "overall": <number>,
    "totalPredictions": <number>,
    "correct": <number>
  },
  "lastUpdated": "<ISO timestamp>"
}

Be honest about signal strengths. If you cannot find strong evidence for a signal, set active to false and strength below 0.5. Base everything on real current data you find via web search.`;

    const raw = await askWithWebSearch(prompt);

    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse predictions", raw });
    }

    // Cache to Firebase
    await setCachedData(COLLECTION, DOC_ID, data);

    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("Predictions API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
