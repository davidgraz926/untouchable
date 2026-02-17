import { askWithWebSearch } from "@/lib/openaiClient";
import { getCachedData, setCachedData } from "@/lib/firebaseCache";

const COLLECTION = "crypto_cache";
const DOC_ID = "whales";

export default async function handler(req, res) {
  try {
    // Check Firebase cache first
    const cached = await getCachedData(COLLECTION, DOC_ID);
    if (cached) {
      return res.status(200).json({ source: "cache", data: cached });
    }

    // Fetch whale data via OpenAI web search
    const prompt = `Search the web for the latest Bitcoin and Ethereum whale activity from today. Look for:
- Large BTC/ETH wallet transfers (whale alert, whale tracker sites)
- Big exchange deposits/withdrawals
- Notable wallet accumulations or dumps

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "whaleActivity": [
    {
      "wallet": "<abbreviated wallet like 0x1a2b...3c4d>",
      "action": "<BUY or SELL>",
      "amount": "<e.g. 850 BTC>",
      "value": "<e.g. $57.8M>",
      "time": "<e.g. 2h ago>",
      "source": "<where this data was found>"
    }
  ],
  "summary": "<1-2 sentence summary of whale sentiment>",
  "netFlow": "<NET BUY or NET SELL>",
  "lastUpdated": "<ISO timestamp>"
}

Include 4-6 recent whale transactions. Use real data found from web searches. If exact wallet addresses aren't available, generate realistic abbreviated addresses.`;

    const raw = await askWithWebSearch(prompt);

    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse whale data", raw });
    }

    // Cache to Firebase
    await setCachedData(COLLECTION, DOC_ID, data);

    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("Whales API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
