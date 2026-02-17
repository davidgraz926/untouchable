import { useState, useEffect, useCallback } from "react";
import StatsCard from "@/components/StatsCard";
import PredictionCard from "@/components/PredictionCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function StockPredictions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stocks/data");
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error("Failed to fetch stock data:", err);
    }
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const optionsFlow = data?.optionsFlow || [];
  const insiderTrading = data?.insiderTrading || [];
  const predictions = data?.predictions || [];
  const signals = data?.signals || [];
  const accuracy = data?.accuracy || { overall: 68, correct: 28, total: 41 };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Stock Predictions</h2>
          <p className="text-gray-400 text-sm mt-1">AI-powered predictions using real-time market data via OpenAI</p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && <span className="text-xs text-gray-500">Updated: {lastRefresh.toLocaleTimeString()}</span>}
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all disabled:opacity-50">
            <svg className={`w-4 h-4 text-blue-400 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm text-blue-400 font-medium">{loading ? "Loading..." : "Refresh"}</span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm text-blue-400 font-medium">Market Open</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          [1,2,3,4].map(i => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatsCard title="Stock Accuracy" value={`${accuracy.overall}%`} subtitle={`${accuracy.correct}/${accuracy.total} correct`} color="blue" trend={1.5} />
            <StatsCard title="Active Signals" value={predictions.length} subtitle="Stock predictions active" color="emerald" />
            <StatsCard title="Unusual Options" value={optionsFlow.length} subtitle="Detected today" color="amber" />
            <StatsCard title="Insider Trades" value={insiderTrading.length} subtitle="Recent activity" color="purple" />
          </>
        )}
      </div>

      {/* Options Flow Chart */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Options Flow Analysis</h3>
        <div className="h-64">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-400 text-sm">Fetching options flow data...</span>
              </div>
            </div>
          ) : optionsFlow.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={optionsFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242432" />
                <XAxis dataKey="ticker" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2e2e40", borderRadius: "12px", color: "#e2e8f0" }} />
                <Bar dataKey="calls" fill="#10b981" name="Calls" radius={[4, 4, 0, 0]} />
                <Bar dataKey="puts" fill="#ef4444" name="Puts" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">No options data available</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white">Active Stock Predictions</h3>
          {loading ? (
            <div className="space-y-4">{[1,2].map(i => <PredictionSkeleton key={i} />)}</div>
          ) : predictions.length > 0 ? (
            predictions.map((p) => <PredictionCard key={p.id} prediction={p} />)
          ) : (
            <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] text-center">
              <p className="text-gray-500">No active stock predictions. Waiting for signal convergence...</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Insider Activity</h3>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl bg-[#111118] animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {insiderTrading.map((trade, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#111118] border border-[#242432]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white font-medium">{trade.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${trade.action === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{trade.action}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{trade.company} | {trade.shares} shares</span>
                      <span className="text-xs text-gray-400">{trade.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Signal Detection</h3>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-[#2e2e40] rounded animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {signals.map((signal, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{signal.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#2e2e40] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${signal.status === "bullish" ? "bg-emerald-400" : signal.status === "bearish" ? "bg-red-400" : "bg-amber-400"}`} style={{ width: `${signal.strength}%` }} />
                      </div>
                      <div className={`w-2 h-2 rounded-full ${signal.status === "bullish" ? "bg-emerald-400" : signal.status === "bearish" ? "bg-red-400" : "bg-amber-400"}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="p-5 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] animate-pulse"><div className="h-4 w-20 bg-[#2e2e40] rounded mb-3" /><div className="h-8 w-28 bg-[#2e2e40] rounded mb-2" /><div className="h-3 w-24 bg-[#2e2e40] rounded" /></div>;
}

function PredictionSkeleton() {
  return <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] animate-pulse"><div className="h-6 w-32 bg-[#2e2e40] rounded mb-4" /><div className="h-4 w-48 bg-[#2e2e40] rounded mb-2" /><div className="flex gap-1 mb-4">{[1,2,3,4,5].map(i => <div key={i} className="h-2 flex-1 bg-[#2e2e40] rounded-full" />)}</div></div>;
}
