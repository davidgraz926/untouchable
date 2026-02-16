import { useState } from "react";
import StatsCard from "@/components/StatsCard";
import { paperTradingData } from "@/lib/sampleData";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

const backtestResults = [
  { event: "Bitcoin 2024 Pump ($25K→$73K)", period: "Jan-Mar 2024", predicted: true, accuracy: 82, signals: "5/5 converged", profit: "+192%" },
  { event: "NVIDIA AI Boom (+300%)", period: "Q2-Q4 2023", predicted: true, accuracy: 78, signals: "4/5 converged", profit: "+285%" },
  { event: "Trump 2024 Election", period: "Nov 2024", predicted: true, accuracy: 85, signals: "5/5 converged", profit: "N/A" },
  { event: "DeFi Summer 2020", period: "Jun-Sep 2020", predicted: true, accuracy: 74, signals: "4/5 converged", profit: "+340%" },
  { event: "NFT Boom 2021", period: "Jan-Apr 2021", predicted: true, accuracy: 71, signals: "4/5 converged", profit: "+180%" },
  { event: "NFT Bust 2022", period: "May-Dec 2022", predicted: false, accuracy: 62, signals: "3/5 converged", profit: "-15%" },
  { event: "Luna/Terra Crash", period: "May 2022", predicted: true, accuracy: 79, signals: "4/5 converged", profit: "Avoided" },
];

const backtestAccuracy = [
  { category: "Crypto Moves", target: 70, actual: 76 },
  { category: "Stock Earnings", target: 65, actual: 68 },
  { category: "Startups", target: 75, actual: 75 },
  { category: "Political", target: 80, actual: 82 },
  { category: "Casino", target: 65, actual: 71 },
];

export default function Backtesting() {
  const [mode, setMode] = useState("backtest");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Testing & Validation</h2>
          <p className="text-gray-400 text-sm mt-1">Historical backtesting & paper trading mode</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode("backtest")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === "backtest" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-[#1a1a24] text-gray-400 border border-[#2e2e40]"}`}>
            Backtesting
          </button>
          <button onClick={() => setMode("paper")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === "paper" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-[#1a1a24] text-gray-400 border border-[#2e2e40]"}`}>
            Paper Trading
          </button>
        </div>
      </div>

      {mode === "backtest" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard title="Backtest Events" value={backtestResults.length} subtitle="Historical events tested" color="emerald" />
            <StatsCard title="Events Predicted" value={`${backtestResults.filter(r=>r.predicted).length}/${backtestResults.length}`} subtitle="Correctly flagged" color="blue" />
            <StatsCard title="Avg Accuracy" value="76%" subtitle="Across all backtests" color="amber" />
            <StatsCard title="Meets Target" value="4/5" subtitle="Categories hit accuracy goals" color="purple" />
          </div>

          {/* Accuracy vs Target */}
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Accuracy vs Target by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={backtestAccuracy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242432" />
                  <XAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2e2e40", borderRadius: "12px", color: "#e2e8f0" }} />
                  <Bar dataKey="target" fill="#3b82f6" name="Target" radius={[4, 4, 0, 0]} opacity={0.5} />
                  <Bar dataKey="actual" fill="#10b981" name="Actual" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Historical Backtest Results */}
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Historical Backtest Results</h3>
            <div className="space-y-3">
              {backtestResults.map((result, i) => (
                <div key={i} className={`p-4 rounded-xl border ${result.predicted ? "bg-emerald-500/5 border-emerald-500/10" : "bg-red-500/5 border-red-500/10"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">{result.event}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{result.period} | {result.signals}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${result.predicted ? "text-emerald-400" : "text-red-400"}`}>{result.accuracy}%</span>
                      <p className={`text-xs ${result.profit.startsWith("+") || result.profit === "Avoided" ? "text-emerald-400" : "text-red-400"}`}>{result.profit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard title="Starting Capital" value={`$${(paperTradingData.startingCapital / 1000).toFixed(0)}K`} subtitle="Paper trading" color="blue" />
            <StatsCard title="Current Value" value={`$${(paperTradingData.currentValue / 1000).toFixed(1)}K`} subtitle="Portfolio value" color="emerald" trend={paperTradingData.pnlPercent} />
            <StatsCard title="Total P&L" value={`+$${(paperTradingData.pnl / 1000).toFixed(1)}K`} subtitle={`+${paperTradingData.pnlPercent}% return`} color="emerald" />
            <StatsCard title="Win Rate" value={`${paperTradingData.winRate}%`} subtitle={`${paperTradingData.trades} trades`} color="amber" />
          </div>

          {/* P&L Chart */}
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Paper Trading P&L</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={paperTradingData.dailyPnl}>
                  <defs>
                    <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242432" />
                  <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={["auto", "auto"]} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2e2e40", borderRadius: "12px", color: "#e2e8f0" }} formatter={(v) => [`$${v.toLocaleString()}`, "Value"]} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#pnlGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#1a1a24] border border-emerald-500/20">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Best Trade</h3>
              <p className="text-2xl font-bold text-emerald-400">+${paperTradingData.bestTrade.pnl.toLocaleString()}</p>
              <p className="text-sm text-gray-400">{paperTradingData.bestTrade.asset} | +{paperTradingData.bestTrade.percent}%</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#1a1a24] border border-red-500/20">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Worst Trade</h3>
              <p className="text-2xl font-bold text-red-400">-${Math.abs(paperTradingData.worstTrade.pnl).toLocaleString()}</p>
              <p className="text-sm text-gray-400">{paperTradingData.worstTrade.asset} | {paperTradingData.worstTrade.percent}%</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-sm text-amber-400">Paper trading mode active. All predictions are tracked with simulated capital. No real money at risk. Run for minimum 30 days before deploying real capital.</p>
          </div>
        </>
      )}
    </div>
  );
}
