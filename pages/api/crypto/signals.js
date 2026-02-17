import { askWithWebSearch } from "@/lib/openaiClient";
import { getCachedData, setCachedData } from "@/lib/firebaseCache";

const COLLECTION = "crypto_cache";
const DOC_ID = "signals";

export default async function handler(req, res) {
  try {
    // Check Firebase cache first
    const cached = await getCachedData(COLLECTION, DOC_ID);
    if (cached) {
      return res.status(200).json({ source: "cache", data: cached });
    }

    // Fetch signal data via OpenAI web search
    const prompt = `Search the web for the latest crypto market signals and indicators for Bitcoin and Ethereum today. Analyze:

1. **Whale Accumulation**: Are large wallets buying or selling? Check whale alert data.
2. **Social Sentiment**: What's the sentiment on crypto Twitter/X, Reddit r/cryptocurrency? Is it bullish or bearish?
3. **Exchange Flow**: Are BTC/ETH flowing into exchanges (bearish) or out (bullish)?
4. **Volume Analysis**: Is trading volume above or below average?
5. **Correlation**: Are altcoins and BTC moving together or diverging?

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "signals": [
    {
      "name": "Whale Accumulation",
      "key": "whale_accumulation",
      "strength": <number 0-100>,
      "status": "<bullish/bearish/neutral>",
      "detail": "<brief real data point>"
    },
    {
      "name": "Social Sentiment",
      "key": "social_surge",
      "strength": <number 0-100>,
      "status": "<bullish/bearish/neutral>",
      "detail": "<brief real data point>"
    },
    {
      "name": "Exchange Flow",
      "key": "exchange_outflow",
      "strength": <number 0-100>,
      "status": "<bullish/bearish/neutral>",
      "detail": "<brief real data point>"
    },
    {
      "name": "Volume Analysis",
      "key": "volume_spike",
      "strength": <number 0-100>,
      "status": "<bullish/bearish/neutral>",
      "detail": "<brief real data point>"
    },
    {
      "name": "Correlation",
      "key": "correlation_break",
      "strength": <number 0-100>,
      "status": "<bullish/bearish/neutral>",
      "detail": "<brief real data point>"
    }
  ],
  "overallSentiment": "<BULLISH/BEARISH/NEUTRAL>",
  "lastUpdated": "<ISO timestamp>"
}

Be honest. Base all signals on actual web data you find.`;

    const raw = await askWithWebSearch(prompt);

    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse signals", raw });
    }

    // Cache to Firebase
    await setCachedData(COLLECTION, DOC_ID, data);

    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("Signals API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
