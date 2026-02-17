import { askWithWebSearch } from "@/lib/openaiClient";
import { getCachedData, setCachedData } from "@/lib/firebaseCache";

const COLLECTION = "casino_cache";
const DOC_ID = "data";

export default async function handler(req, res) {
  try {
    const cached = await getCachedData(COLLECTION, DOC_ID);
    if (cached) {
      return res.status(200).json({ source: "cache", data: cached });
    }

    const prompt = `You are UNTOUCHABLE, an AI casino/gambling behavioral analysis engine. Search the web for the latest research and data on:

1. Blackjack dealer behavior patterns and statistical analysis
2. Casino game theory and optimal play strategies
3. Behavioral psychology in gambling (dealer tells, micro-expressions)
4. Recent gambling industry statistics and trends

Based on real behavioral science research, generate realistic dealer profiles and hand analysis data.

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "dealerProfiles": [
    {
      "name": "<e.g. Dealer #A-117>",
      "table": "<e.g. Blackjack T3>",
      "bustRate": <number 25-45>,
      "pattern": "<behavioral pattern description>",
      "confidence": <number 50-85>,
      "tells": ["<tell_1>", "<tell_2>", "<tell_3>"]
    }
  ],
  "recentHands": [
    {"hand": <number>, "dealer": "<dealer id>", "prediction": "<BUST or WIN>", "actual": "<BUST or WIN or 21>", "correct": <bool>, "confidence": <number>}
  ],
  "stats": {
    "accuracy": 71,
    "dealersProfiled": <number>,
    "winRate": <number>,
    "bestDealer": "<dealer id>",
    "bestDealerBustRate": <number>
  },
  "insights": [
    "<1 sentence research-backed insight about dealer behavior>",
    "<another insight>",
    "<another insight>"
  ],
  "lastUpdated": "<ISO timestamp>"
}

Include 4 dealer profiles, 8 recent hands, and 3 insights. Base patterns on real gambling research.`;

    const raw = await askWithWebSearch(prompt);
    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse casino data", raw });
    }

    await setCachedData(COLLECTION, DOC_ID, data);
    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("Casino API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
