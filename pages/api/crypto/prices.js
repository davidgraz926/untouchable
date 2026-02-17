import { askWithWebSearch } from "@/lib/openaiClient";
import { getCachedData, setCachedData } from "@/lib/firebaseCache";

const COLLECTION = "crypto_cache";
const DOC_ID = "prices";

export default async function handler(req, res) {
  try {
    // Check Firebase cache first
    const cached = await getCachedData(COLLECTION, DOC_ID);
    if (cached) {
      return res.status(200).json({ source: "cache", data: cached });
    }

    // Fetch real-time data via OpenAI web search
    const prompt = `Search the web for the current real-time prices of Bitcoin (BTC) and Ethereum (ETH) right now today.

Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
{
  "btc": {
    "price": <number - current USD price>,
    "change24h": <number - 24h percentage change>,
    "marketCap": "<string - e.g. $1.35T>",
    "volume24h": "<string - e.g. $28.5B>"
  },
  "eth": {
    "price": <number - current USD price>,
    "change24h": <number - 24h percentage change>,
    "marketCap": "<string - e.g. $380B>",
    "volume24h": "<string - e.g. $12.1B>"
  },
  "chartData": [
    {"time": "00:00", "btc": <number>, "eth": <number>},
    {"time": "04:00", "btc": <number>, "eth": <number>},
    {"time": "08:00", "btc": <number>, "eth": <number>},
    {"time": "12:00", "btc": <number>, "eth": <number>},
    {"time": "16:00", "btc": <number>, "eth": <number>},
    {"time": "20:00", "btc": <number>, "eth": <number>},
    {"time": "Now", "btc": <number>, "eth": <number>}
  ],
  "lastUpdated": "<ISO timestamp>"
}

For chartData, simulate realistic 24h price movement based on the current price and 24h change. The last entry "Now" should match the current price exactly.`;

    const raw = await askWithWebSearch(prompt);

    // Parse JSON from response
    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse price data", raw });
    }

    // Cache to Firebase
    await setCachedData(COLLECTION, DOC_ID, data);

    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("Prices API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
