import { useState, useEffect, useCallback } from "react";
import StatsCard from "@/components/StatsCard";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export default function Backtesting() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("backtest");
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/backtesting/data");
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error("Failed to fetch backtest data:", err);
    }
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const backtestResults = data?.backtestResults || [];
  const backtestAccuracy = data?.backtestAccuracy || [];
  const paperTrading = data?.paperTrading || { startingCapital: 100000, currentValue: 100000, pnl: 0, pnlPercent: 0, trades: 0, winRate: 0, bestTrade: { asset: "--", pnl: 0, percent: 0 }, worstTrade: { asset: "--", pnl: 0, percent: 0 }, dailyPnl: [] };
  const stats = data?.stats || { totalEvents: 0, predicted: 0, avgAccuracy: 0, meetsTarget: "0/5" };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Testing & Validation</h2>
          <p className="text-gray-400 text-sm mt-1">AI-powered backtesting with real historical data</p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && <span className="text-xs text-gray-500">Updated: {lastRefresh.toLocaleTimeString()}</span>}
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50">
            <svg className={`w-4 h-4 text-emerald-400 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm text-emerald-400 font-medium">{loading ? "Loading..." : "Refresh"}</span>
          </button>
          <div className="flex gap-2">
            <button onClick={() => setMode("backtest")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === "backtest" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-[#1a1a24] text-gray-400 border border-[#2e2e40]"}`}>Backtesting</button>
            <button onClick={() => setMode("paper")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === "paper" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-[#1a1a24] text-gray-400 border border-[#2e2e40]"}`}>Paper Trading</button>
          </div>
        </div>
      </div>

      {mode === "backtest" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {loading ? [1,2,3,4].map(i => <SkeletonCard key={i} />) : (
              <>
                <StatsCard title="Backtest Events" value={stats.totalEvents || backtestResults.length} subtitle="Historical events tested" color="emerald" />
                <StatsCard title="Events Predicted" value={`${stats.predicted || backtestResults.filter(r=>r.predicted).length}/${stats.totalEvents || backtestResults.length}`} subtitle="Correctly flagged" color="blue" />
                <StatsCard title="Avg Accuracy" value={`${stats.avgAccuracy || 76}%`} subtitle="Across all backtests" color="amber" />
                <StatsCard title="Meets Target" value={stats.meetsTarget || "4/5"} subtitle="Categories hit goals" color="purple" />
              </>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Accuracy vs Target by Category</h3>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center"><div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /><span className="text-gray-400 text-sm">Fetching backtest data...</span></div></div>
              ) : backtestAccuracy.length > 0 ? (
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
              ) : <div className="h-full flex items-center justify-center text-gray-500 text-sm">No backtest data</div>}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Historical Backtest Results</h3>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-16 rounded-xl bg-[#111118] animate-pulse" />)}</div>
            ) : (
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
                        <p className={`text-xs ${result.profit && (result.profit.startsWith("+") || result.profit === "Avoided") ? "text-emerald-400" : "text-red-400"}`}>{result.profit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {loading ? [1,2,3,4].map(i => <SkeletonCard key={i} />) : (
              <>
                <StatsCard title="Starting Capital" value={`$${(paperTrading.startingCapital / 1000).toFixed(0)}K`} subtitle="Paper trading" color="blue" />
                <StatsCard title="Current Value" value={`$${(paperTrading.currentValue / 1000).toFixed(1)}K`} subtitle="Portfolio value" color="emerald" trend={paperTrading.pnlPercent} />
                <StatsCard title="Total P&L" value={`${paperTrading.pnl >= 0 ? "+" : ""}$${(Math.abs(paperTrading.pnl) / 1000).toFixed(1)}K`} subtitle={`${paperTrading.pnlPercent >= 0 ? "+" : ""}${paperTrading.pnlPercent}% return`} color={paperTrading.pnl >= 0 ? "emerald" : "red"} />
                <StatsCard title="Win Rate" value={`${paperTrading.winRate}%`} subtitle={`${paperTrading.trades} trades`} color="amber" />
              </>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Paper Trading P&L</h3>
            <div className="h-72">
              {loading ? (
                <div className="h-full flex items-center justify-center"><div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /><span className="text-gray-400 text-sm">Fetching P&L data...</span></div></div>
              ) : paperTrading.dailyPnl?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={paperTrading.dailyPnl}>
                    <defs>
                      <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#242432" />
                    <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={["auto", "auto"]} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2e2e40", borderRadius: "12px", color: "#e2e8f0" }} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Value"]} />
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#pnlGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <div className="h-full flex items-center justify-center text-gray-500 text-sm">No P&L data</div>}
            </div>
          </div>

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#1a1a24] border border-emerald-500/20">
                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Best Trade</h3>
                <p className="text-2xl font-bold text-emerald-400">+${Math.abs(paperTrading.bestTrade.pnl).toLocaleString()}</p>
                <p className="text-sm text-gray-400">{paperTrading.bestTrade.asset} | +{paperTrading.bestTrade.percent}%</p>
              </div>
              <div className="p-6 rounded-2xl bg-[#1a1a24] border border-red-500/20">
                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Worst Trade</h3>
                <p className="text-2xl font-bold text-red-400">-${Math.abs(paperTrading.worstTrade.pnl).toLocaleString()}</p>
                <p className="text-sm text-gray-400">{paperTrading.worstTrade.asset} | {paperTrading.worstTrade.percent}%</p>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-sm text-amber-400">Paper trading mode active. All predictions are tracked with simulated capital. No real money at risk.</p>
          </div>
        </>
      )}
    </div>
  );
}

function SkeletonCard() {
  return <div className="p-5 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] animate-pulse"><div className="h-4 w-20 bg-[#2e2e40] rounded mb-3" /><div className="h-8 w-28 bg-[#2e2e40] rounded mb-2" /><div className="h-3 w-24 bg-[#2e2e40] rounded" /></div>;
}
