import { useState } from "react";
import StatsCard from "@/components/StatsCard";
import PredictionCard from "@/components/PredictionCard";
import { activePredictions, performanceData } from "@/lib/sampleData";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const cryptoPriceData = [
  { time: "00:00", btc: 67200, eth: 3180 },
  { time: "04:00", btc: 67500, eth: 3195 },
  { time: "08:00", btc: 68100, eth: 3210 },
  { time: "12:00", btc: 67800, eth: 3200 },
  { time: "16:00", btc: 68500, eth: 3225 },
  { time: "20:00", btc: 69200, eth: 3250 },
  { time: "Now", btc: 69800, eth: 3270 },
];

const whaleActivity = [
  { wallet: "0x1a2b...3c4d", action: "BUY", amount: "850 BTC", value: "$57.8M", time: "2h ago" },
  { wallet: "0x5e6f...7g8h", action: "BUY", amount: "1,200 BTC", value: "$81.6M", time: "4h ago" },
  { wallet: "0x9i0j...1k2l", action: "SELL", amount: "320 BTC", value: "$21.8M", time: "6h ago" },
  { wallet: "0x3m4n...5o6p", action: "BUY", amount: "450 BTC", value: "$30.6M", time: "8h ago" },
];

export default function CryptoPredictions() {
  const cryptoPredictions = activePredictions.filter((p) => p.type === "CRYPTO");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Crypto Predictions</h2>
          <p className="text-gray-400 text-sm mt-1">Detect 10%+ price moves in 24-72 hour timeframe</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">Live Scanning</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Crypto Accuracy" value={`${performanceData.crypto.accuracy}%`} subtitle={`${performanceData.crypto.correct}/${performanceData.crypto.predictions} correct`} color="amber" trend={3.2} />
        <StatsCard title="Active Signals" value={cryptoPredictions.length} subtitle="Predictions active" color="emerald" />
        <StatsCard title="BTC Price" value="$69,800" subtitle="+3.4% today" color="amber" trend={3.4} />
        <StatsCard title="ETH Price" value="$3,270" subtitle="+2.8% today" color="blue" trend={2.8} />
      </div>

      {/* Price Chart */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">BTC Price (24h)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cryptoPriceData}>
              <defs>
                <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#242432" />
              <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2e2e40", borderRadius: "12px", color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="btc" stroke="#f59e0b" strokeWidth={2} fill="url(#btcGrad)" name="BTC" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white">Active Crypto Predictions</h3>
          {cryptoPredictions.map((p) => (
            <PredictionCard key={p.id} prediction={p} />
          ))}
        </div>

        <div className="space-y-6">
          {/* Whale Tracker */}
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Whale Activity</h3>
            <div className="space-y-3">
              {whaleActivity.map((whale, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#111118] border border-[#242432]">
                  <div>
                    <p className="text-xs text-gray-500 font-mono">{whale.wallet}</p>
                    <p className="text-sm text-white font-medium mt-1">{whale.amount}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${whale.action === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {whale.action}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{whale.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signal Detection */}
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Signal Detection</h3>
            <div className="space-y-3">
              {["Whale Accumulation", "Social Sentiment", "Exchange Flow", "Volume Analysis", "Correlation"].map((signal, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{signal}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#2e2e40] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${75 + Math.random() * 25}%` }} />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
