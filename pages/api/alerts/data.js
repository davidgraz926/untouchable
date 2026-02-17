import { askWithWebSearch } from "@/lib/openaiClient";
import { getCachedData, setCachedData } from "@/lib/firebaseCache";

const COLLECTION = "alerts_cache";
const DOC_ID = "data";

export default async function handler(req, res) {
  try {
    const cached = await getCachedData(COLLECTION, DOC_ID);
    if (cached) {
      return res.status(200).json({ source: "cache", data: cached });
    }

    const prompt = `You are UNTOUCHABLE, an AI-powered prediction alert system. Search the web for the latest breaking news across crypto, stocks, politics, and startups from TODAY.

Generate alerts based on real events happening right now.

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "alerts": [
    {
      "id": "a001",
      "message": "<alert headline based on real current news>",
      "detail": "<1-2 sentences with specifics from real data>",
      "type": "<high/medium/warning/info/system>",
      "time": "<e.g. 1 hour ago>",
      "module": "<CRYPTO/STOCK/POLITICAL/STARTUP/CASINO/SYSTEM>",
      "read": false
    },
    {
      "id": "a002",
      "message": "<another real alert>",
      "detail": "<specifics>",
      "type": "<type>",
      "time": "<e.g. 3 hours ago>",
      "module": "<module>",
      "read": false
    },
    {
      "id": "a003",
      "message": "<alert>",
      "detail": "<detail>",
      "type": "<type>",
      "time": "<e.g. 5 hours ago>",
      "module": "<module>",
      "read": true
    },
    {
      "id": "a004",
      "message": "<alert>",
      "detail": "<detail>",
      "type": "<type>",
      "time": "<e.g. 1 day ago>",
      "module": "<module>",
      "read": true
    },
    {
      "id": "a005",
      "message": "<alert>",
      "detail": "<detail>",
      "type": "<type>",
      "time": "<e.g. 1 day ago>",
      "module": "<module>",
      "read": true
    },
    {
      "id": "a006",
      "message": "<alert>",
      "detail": "<detail>",
      "type": "<type>",
      "time": "<e.g. 2 days ago>",
      "module": "<module>",
      "read": true
    },
    {
      "id": "a007",
      "message": "<alert>",
      "detail": "<detail>",
      "type": "<type>",
      "time": "<e.g. 3 days ago>",
      "module": "<module>",
      "read": true
    },
    {
      "id": "a008",
      "message": "System accuracy update based on latest data",
      "detail": "<real summary of current system state>",
      "type": "system",
      "time": "<e.g. 4 days ago>",
      "module": "SYSTEM",
      "read": true
    }
  ],
  "lastUpdated": "<ISO timestamp>"
}

Generate 8 alerts. First 2 should be unread (recent). Mix of high, medium, warning, info, and system types. Each alert should reference REAL current events you found via web search.`;

    const raw = await askWithWebSearch(prompt);
    let data;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse alerts data", raw });
    }

    await setCachedData(COLLECTION, DOC_ID, data);
    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("Alerts API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
