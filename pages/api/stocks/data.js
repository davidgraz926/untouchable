import { askWithWebSearch } from "@/lib/openaiClient";
import { getCachedData, setCachedData } from "@/lib/firebaseCache";

const COLLECTION = "stocks_cache";
const DOC_ID = "data";

export default async function handler(req, res) {
  try {
    const cached = await getCachedData(COLLECTION, DOC_ID);
    if (cached) {
      return res.status(200).json({ source: "cache", data: cached });
    }

    const prompt = `You are UNTOUCHABLE, an AI stock prediction engine. Search the web for the latest US stock market data from TODAY. Find:

1. Unusual options activity (high call/put ratios) for top tech stocks (NVDA, AAPL, TSLA, META, AMZN, MSFT, GOOGL)
2. Recent insider buying/selling activity (SEC filings)
3. AI-generated stock predictions based on current market signals
4. Market sentiment signals (analyst upgrades, volume anomalies, news sentiment)

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "optionsFlow": [
    {"ticker": "<symbol>", "calls": <number>, "puts": <number>, "ratio": <float call/put ratio>, "note": "<brief context>"}
  ],
  "insiderTrading": [
    {"name": "<exec name>", "company": "<ticker>", "action": "<BUY or SELL>", "shares": "<formatted number>", "value": "<e.g. $26M>", "date": "<e.g. Feb 15>"}
  ],
  "predictions": [
    {
      "id": "pred_stock_001",
      "type": "STOCK",
      "asset": "<ticker>",
      "prediction": "<EARNINGS_BEAT or EARNINGS_MISS or BULLISH or BEARISH>",
      "confidence": <number 60-95>,
      "timeframe": "<e.g. 3 days>",
      "targetMove": "<e.g. +8% to +15%>",
      "entryPrice": "<current price with $>",
      "targetPrice": "<target range with $>",
      "reasoning": "<1-2 sentences based on real data>",
      "signals": [
        {"name": "options_surge", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "insider_buying", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "analyst_upgrade", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "sentiment_shift", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real data>"},
        {"name": "volume_anomaly", "active": <bool>, "strength": <0.0-1.0>, "detail": "<real data>"}
      ],
      "timestamp": "<ISO timestamp>",
      "status": "active"
    }
  ],
  "signals": [
    {"name": "Options Activity", "strength": <0-100>, "status": "<bullish/bearish/neutral>"},
    {"name": "Insider Buying", "strength": <0-100>, "status": "<bullish/bearish/neutral>"},
    {"name": "Analyst Ratings", "strength": <0-100>, "status": "<bullish/bearish/neutral>"},
    {"name": "News Sentiment", "strength": <0-100>, "status": "<bullish/bearish/neutral>"},
    {"name": "Volume Anomalies", "strength": <0-100>, "status": "<bullish/bearish/neutral>"}
  ],
  "accuracy": {"overall": <number>, "correct": <number>, "total": <number>},
  "lastUpdated": "<ISO timestamp>"
}

Include 5 options flow entries, 4 insider trades, and 2 stock predictions. Use real current data.`;

    const raw = await askWithWebSearch(prompt);
    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse stock data", raw });
    }

    await setCachedData(COLLECTION, DOC_ID, data);
    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("Stocks API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
