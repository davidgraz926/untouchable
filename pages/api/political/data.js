import { askWithWebSearch } from "@/lib/openaiClient";
import { getCachedData, setCachedData } from "@/lib/firebaseCache";

const COLLECTION = "political_cache";
const DOC_ID = "data";

export default async function handler(req, res) {
  try {
    const cached = await getCachedData(COLLECTION, DOC_ID);
    if (cached) {
      return res.status(200).json({ source: "cache", data: cached });
    }

    const prompt = `You are UNTOUCHABLE, an AI political prediction engine. Search the web for the latest US political and economic news from TODAY. Find:

1. Federal Reserve signals (speeches, data, rate expectations)
2. Betting market odds for key political events (Polymarket, PredictIt, Kalshi)
3. Upcoming major political/economic events
4. Key government official statements and tone shifts
5. Legislative activity

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "bettingMarketData": [
    {"date": "<e.g. Feb 1>", "rateCut": <0-100>, "rateHold": <0-100>, "rateHike": <0-100>},
    {"date": "<Feb 4>", "rateCut": <number>, "rateHold": <number>, "rateHike": <number>},
    {"date": "<Feb 7>", "rateCut": <number>, "rateHold": <number>, "rateHike": <number>},
    {"date": "<Feb 10>", "rateCut": <number>, "rateHold": <number>, "rateHike": <number>},
    {"date": "<Feb 13>", "rateCut": <number>, "rateHold": <number>, "rateHike": <number>},
    {"date": "<Feb 17>", "rateCut": <number>, "rateHold": <number>, "rateHike": <number>}
  ],
  "cabinetTracking": [
    {"name": "<official title>", "status": "<dovish/hawkish/neutral>", "change": "<e.g. Shifted dovish>", "confidence": <0-100>, "detail": "<real data from web>"}
  ],
  "upcomingEvents": [
    {"event": "<event name>", "date": "<date>", "impact": "<High/Medium/Low>", "prediction": "<predicted outcome>"}
  ],
  "predictions": [
    {
      "id": "pred_pol_001",
      "type": "POLITICAL",
      "asset": "<e.g. Fed Rate Decision>",
      "prediction": "<RATE_CUT or RATE_HIKE or RATE_HOLD>",
      "confidence": <60-95>,
      "timeframe": "<e.g. 30 days>",
      "targetMove": "<e.g. -25 bps>",
      "reasoning": "<real data>",
      "signals": [
        {"name": "cabinet_signals", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real>"},
        {"name": "betting_markets", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real>"},
        {"name": "fed_speech", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real>"},
        {"name": "economic_data", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real>"},
        {"name": "media_narrative", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real>"}
      ],
      "timestamp": "<ISO timestamp>",
      "status": "active"
    }
  ],
  "accuracy": {"overall": 82, "correct": 18, "total": 22},
  "lastUpdated": "<ISO timestamp>"
}

Include 4 cabinet members, 4 upcoming events, and 1-2 predictions. Use real current data.`;

    const raw = await askWithWebSearch(prompt);
    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse political data", raw });
    }

    await setCachedData(COLLECTION, DOC_ID, data);
    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("Political API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
