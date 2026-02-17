import { askWithWebSearch } from "@/lib/openaiClient";
import { getCachedData, setCachedData } from "@/lib/firebaseCache";

const COLLECTION = "dashboard_cache";
const DOC_ID = "data";

export default async function handler(req, res) {
  try {
    const cached = await getCachedData(COLLECTION, DOC_ID);
    if (cached) {
      return res.status(200).json({ source: "cache", data: cached });
    }

    const prompt = `You are UNTOUCHABLE, an AI-powered multi-module prediction system. Search the web for the latest data across ALL these domains today:

1. Crypto: BTC/ETH prices and trends
2. Stocks: Major US stock market activity, top movers
3. Political: Key political events, Fed signals
4. Startups: Latest funding rounds and startup news
5. General market sentiment

Generate a dashboard overview with predictions from each module.

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "activePredictions": [
    {
      "id": "pred_001",
      "type": "<CRYPTO/STOCK/POLITICAL/STARTUP>",
      "asset": "<name>",
      "prediction": "<PUMP/DUMP/BULLISH/BEARISH/EARNINGS_BEAT/RATE_CUT/SUCCESS/FAILURE>",
      "confidence": <60-95>,
      "timeframe": "<e.g. 24-48 hours>",
      "targetMove": "<e.g. +8% to +12%>",
      "entryPrice": "<price or null>",
      "targetPrice": "<target or null>",
      "signals": [
        {"name": "<signal_name>", "active": <bool>, "strength": <0.0-1.0>, "detail": "<brief real data>"}
      ],
      "timestamp": "<ISO timestamp>",
      "status": "active"
    }
  ],
  "performanceData": {
    "overall": {"accuracy": <number>, "predictions": <number>, "correct": <number>},
    "crypto": {"accuracy": <number>, "predictions": <number>, "correct": <number>},
    "stocks": {"accuracy": <number>, "predictions": <number>, "correct": <number>},
    "startups": {"accuracy": <number>, "predictions": <number>, "correct": <number>},
    "political": {"accuracy": <number>, "predictions": <number>, "correct": <number>},
    "casino": {"accuracy": <number>, "predictions": <number>, "correct": <number>}
  },
  "recentAlerts": [
    {"id": "a001", "message": "<real alert based on current data>", "type": "<high/medium/info>", "time": "<e.g. 2 hours ago>", "module": "<CRYPTO/STOCK/POLITICAL/STARTUP>"}
  ],
  "accuracyOverTime": [
    {"date": "Week 1", "overall": <number>, "crypto": <number>, "stocks": <number>, "political": <number>},
    {"date": "Week 2", "overall": <number>, "crypto": <number>, "stocks": <number>, "political": <number>},
    {"date": "Week 3", "overall": <number>, "crypto": <number>, "stocks": <number>, "political": <number>},
    {"date": "Week 4", "overall": <number>, "crypto": <number>, "stocks": <number>, "political": <number>},
    {"date": "Week 5", "overall": <number>, "crypto": <number>, "stocks": <number>, "political": <number>},
    {"date": "Week 6", "overall": <number>, "crypto": <number>, "stocks": <number>, "political": <number>},
    {"date": "Week 7", "overall": <number>, "crypto": <number>, "stocks": <number>, "political": <number>},
    {"date": "Week 8", "overall": <number>, "crypto": <number>, "stocks": <number>, "political": <number>}
  ],
  "highestConfidence": {"value": <number>, "asset": "<name>", "type": "<module>"},
  "signalsToday": <number>,
  "convergedSignals": <number>,
  "lastUpdated": "<ISO timestamp>"
}

Include 5 active predictions (1 crypto, 1 stock, 1 political, 1 startup, 1 more of any type), 5 recent alerts, and realistic accuracy trends. Base predictions on REAL current web data.`;

    const raw = await askWithWebSearch(prompt);
    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse dashboard data", raw });
    }

    await setCachedData(COLLECTION, DOC_ID, data);
    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
