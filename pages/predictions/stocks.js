import { useState } from "react";
import StatsCard from "@/components/StatsCard";
import PredictionCard from "@/components/PredictionCard";
import { activePredictions, performanceData } from "@/lib/sampleData";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const optionsFlowData = [
  { ticker: "NVDA", calls: 15000, puts: 3200, ratio: 4.7 },
  { ticker: "AAPL", calls: 8500, puts: 6200, ratio: 1.4 },
  { ticker: "TSLA", calls: 12000, puts: 4500, ratio: 2.7 },
  { ticker: "META", calls: 6800, puts: 5100, ratio: 1.3 },
  { ticker: "AMZN", calls: 9200, puts: 3800, ratio: 2.4 },
];

const insiderTrading = [
  { name: "Jensen Huang", company: "NVDA", action: "BUY", shares: "50,000", value: "$26M", date: "Feb 12" },
  { name: "Tim Cook", company: "AAPL", action: "SELL", shares: "100,000", value: "$18.5M", date: "Feb 10" },
  { name: "Satya Nadella", company: "MSFT", action: "BUY", shares: "25,000", value: "$10.5M", date: "Feb 8" },
  { name: "Mark Zuckerberg", company: "META", action: "SELL", shares: "200,000", value: "$120M", date: "Feb 5" },
];

export default function StockPredictions() {
  const stockPredictions = activePredictions.filter((p) => p.type === "STOCK");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Stock Predictions</h2>
          <p className="text-gray-400 text-sm mt-1">Predict earnings surprises, M&A, and major momentum shifts</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-sm text-blue-400 font-medium">Market Open</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Stock Accuracy" value={`${performanceData.stocks.accuracy}%`} subtitle={`${performanceData.stocks.correct}/${performanceData.stocks.predictions} correct`} color="blue" trend={1.5} />
        <StatsCard title="Active Signals" value={stockPredictions.length} subtitle="Stock predictions active" color="emerald" />
        <StatsCard title="Unusual Options" value="8" subtitle="Detected today" color="amber" />
        <StatsCard title="Insider Buys" value="12" subtitle="Past 7 days" color="purple" />
      </div>

      {/* Options Flow Chart */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Options Flow Analysis</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={optionsFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242432" />
              <XAxis dataKey="ticker" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2e2e40", borderRadius: "12px", color: "#e2e8f0" }} />
              <Bar dataKey="calls" fill="#10b981" name="Calls" radius={[4, 4, 0, 0]} />
              <Bar dataKey="puts" fill="#ef4444" name="Puts" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white">Active Stock Predictions</h3>
          {stockPredictions.length > 0 ? (
            stockPredictions.map((p) => <PredictionCard key={p.id} prediction={p} />)
          ) : (
            <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] text-center">
              <p className="text-gray-500">No active stock predictions. Waiting for signal convergence...</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Insider Trading */}
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Insider Activity</h3>
            <div className="space-y-3">
              {insiderTrading.map((trade, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#111118] border border-[#242432]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white font-medium">{trade.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${trade.action === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {trade.action}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{trade.company} | {trade.shares} shares</span>
                    <span className="text-xs text-gray-400">{trade.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signal Detection */}
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Signal Detection</h3>
            <div className="space-y-3">
              {["Options Activity", "Insider Buying", "Analyst Ratings", "News Sentiment", "Volume Anomalies"].map((signal, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{signal}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#2e2e40] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${60 + Math.random() * 40}%` }} />
                    </div>
                    <div className={`w-2 h-2 rounded-full ${i < 3 ? "bg-emerald-400" : "bg-gray-500"}`} />
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
