import { askWithWebSearch } from "@/lib/openaiClient";
import { getCachedData, setCachedData } from "@/lib/firebaseCache";

const COLLECTION = "backtesting_cache";
const DOC_ID = "data";

export default async function handler(req, res) {
  try {
    const cached = await getCachedData(COLLECTION, DOC_ID);
    if (cached) {
      return res.status(200).json({ source: "cache", data: cached });
    }

    const prompt = `You are UNTOUCHABLE, an AI prediction backtesting engine. Search the web for major financial/political events from the past 2-3 years and evaluate whether AI signal convergence could have predicted them.

Analyze these types of events:
1. Major crypto pumps/dumps (BTC halvings, crashes)
2. Stock earnings surprises (NVDA AI boom, tech earnings)
3. Political events (elections, rate decisions)
4. Market crashes and recoveries

Also generate realistic paper trading simulation data based on current market conditions.

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "backtestResults": [
    {
      "event": "<real historical event name>",
      "period": "<e.g. Jan-Mar 2024>",
      "predicted": <bool - could signals have predicted this>,
      "accuracy": <number 55-90>,
      "signals": "<e.g. 5/5 converged>",
      "profit": "<e.g. +192% or Avoided or -15%>"
    }
  ],
  "backtestAccuracy": [
    {"category": "Crypto Moves", "target": 70, "actual": <number>},
    {"category": "Stock Earnings", "target": 65, "actual": <number>},
    {"category": "Startups", "target": 75, "actual": <number>},
    {"category": "Political", "target": 80, "actual": <number>},
    {"category": "Casino", "target": 65, "actual": <number>}
  ],
  "paperTrading": {
    "startingCapital": 100000,
    "currentValue": <number based on recent market performance>,
    "pnl": <number>,
    "pnlPercent": <number>,
    "trades": <number>,
    "winRate": <number>,
    "bestTrade": {"asset": "<symbol>", "pnl": <number>, "percent": <number>},
    "worstTrade": {"asset": "<symbol>", "pnl": <negative number>, "percent": <negative number>},
    "dailyPnl": [
      {"date": "Feb 1", "value": 100000},
      {"date": "Feb 3", "value": <number>},
      {"date": "Feb 5", "value": <number>},
      {"date": "Feb 7", "value": <number>},
      {"date": "Feb 9", "value": <number>},
      {"date": "Feb 11", "value": <number>},
      {"date": "Feb 13", "value": <number>},
      {"date": "Feb 15", "value": <number>},
      {"date": "Feb 17", "value": <number>}
    ]
  },
  "stats": {
    "totalEvents": <number>,
    "predicted": <number>,
    "avgAccuracy": <number>,
    "meetsTarget": "<e.g. 4/5>"
  },
  "lastUpdated": "<ISO timestamp>"
}

Include 7 real historical backtest events. Make paper trading P&L realistic based on actual recent BTC/stock moves.`;

    const raw = await askWithWebSearch(prompt);
    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse backtest data", raw });
    }

    await setCachedData(COLLECTION, DOC_ID, data);
    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("Backtesting API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
