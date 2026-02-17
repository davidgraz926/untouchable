import { useState, useEffect, useCallback } from "react";
import StatsCard from "@/components/StatsCard";
import PredictionCard from "@/components/PredictionCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState("all");
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/data");
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const activePredictions = data?.activePredictions || [];
  const performanceData = data?.performanceData || {
    overall: { accuracy: 0, predictions: 0, correct: 0 },
    crypto: { accuracy: 0, predictions: 0, correct: 0 },
    stocks: { accuracy: 0, predictions: 0, correct: 0 },
    startups: { accuracy: 0, predictions: 0, correct: 0 },
    political: { accuracy: 0, predictions: 0, correct: 0 },
    casino: { accuracy: 0, predictions: 0, correct: 0 },
  };
  const recentAlerts = data?.recentAlerts || [];
  const accuracyOverTime = data?.accuracyOverTime || [];
  const highestConfidence = data?.highestConfidence || { value: 0, asset: "--" };

  const filteredPredictions = selectedModule === "all"
    ? activePredictions
    : activePredictions.filter((p) => p.type === selectedModule.toUpperCase());

  return (
    <div className="space-y-8">
      {/* Header with refresh */}
      <div className="flex items-center justify-end gap-3">
        {lastRefresh && <span className="text-xs text-gray-500">Updated: {lastRefresh.toLocaleTimeString()}</span>}
        <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50">
          <svg className={`w-4 h-4 text-emerald-400 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm text-emerald-400 font-medium">{loading ? "Loading..." : "Refresh"}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [1,2,3,4].map(i => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatsCard title="Overall Accuracy" value={`${performanceData.overall.accuracy}%`} subtitle={`${performanceData.overall.correct}/${performanceData.overall.predictions} predictions`} color="emerald" trend={2.1} />
            <StatsCard title="Active Predictions" value={activePredictions.length} subtitle="Across all modules" color="blue" />
            <StatsCard title="Highest Confidence" value={`${highestConfidence.value}%`} subtitle={`${highestConfidence.asset} signal`} color="amber" />
            <StatsCard title="Signals Today" value={data?.signalsToday || 0} subtitle={`${data?.convergedSignals || 0} converged into predictions`} color="purple" />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Active Predictions ({filteredPredictions.length})</h3>
            <div className="flex gap-2">
              {["all", "crypto", "stock", "political", "startup"].map((mod) => (
                <button key={mod} onClick={() => setSelectedModule(mod)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${selectedModule === mod ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-dark-700 text-gray-400 hover:text-gray-200 border border-dark-500"}`}>
                  {mod.charAt(0).toUpperCase() + mod.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <PredictionSkeleton key={i} />)}</div>
          ) : (
            <div className="space-y-4">
              {filteredPredictions.map((prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} />
              ))}
              {filteredPredictions.length === 0 && (
                <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] text-center">
                  <p className="text-gray-500">No predictions in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-dark-700 border border-dark-500">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Performance by Module</h3>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-6 bg-[#2e2e40] rounded animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {[
                  { name: "Crypto", accuracy: performanceData.crypto.accuracy, color: "bg-amber-400" },
                  { name: "Stocks", accuracy: performanceData.stocks.accuracy, color: "bg-blue-400" },
                  { name: "Startups", accuracy: performanceData.startups.accuracy, color: "bg-purple-400" },
                  { name: "Political", accuracy: performanceData.political.accuracy, color: "bg-cyan-400" },
                  { name: "Casino", accuracy: performanceData.casino.accuracy, color: "bg-rose-400" },
                ].map((mod) => (
                  <div key={mod.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{mod.name}</span>
                      <span className="text-white font-medium">{mod.accuracy}%</span>
                    </div>
                    <div className="h-2 bg-dark-500 rounded-full overflow-hidden">
                      <div className={`h-full ${mod.color} rounded-full transition-all duration-1000`} style={{ width: `${mod.accuracy}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-dark-700 border border-dark-500">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Recent Alerts</h3>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-[#1a1a24] rounded-xl animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-xl border ${alert.type === "high" ? "bg-emerald-500/5 border-emerald-500/20" : alert.type === "medium" ? "bg-amber-500/5 border-amber-500/20" : "bg-dark-600 border-dark-500"}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${alert.type === "high" ? "bg-emerald-400" : alert.type === "medium" ? "bg-amber-400" : "bg-gray-500"}`} />
                      <div>
                        <p className="text-sm text-gray-300">{alert.message}</p>
                        <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accuracy Chart */}
      <div className="p-6 rounded-2xl bg-dark-700 border border-dark-500">
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Accuracy Over Time</h3>
        <div className="h-72">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-400 text-sm">Fetching accuracy data...</span>
              </div>
            </div>
          ) : accuracyOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accuracyOverTime}>
                <defs>
                  <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCrypto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#242432" />
                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[50, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2e2e40", borderRadius: "12px", color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="overall" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOverall)" name="Overall" />
                <Area type="monotone" dataKey="crypto" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCrypto)" name="Crypto" />
                <Line type="monotone" dataKey="stocks" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Stocks" />
                <Line type="monotone" dataKey="political" stroke="#06b6d4" strokeWidth={1.5} dot={false} name="Political" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">No accuracy data available</div>
          )}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          {[{ name: "Overall", color: "bg-emerald-400" }, { name: "Crypto", color: "bg-amber-400" }, { name: "Stocks", color: "bg-blue-400" }, { name: "Political", color: "bg-cyan-400" }].map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className={`w-3 h-1 rounded-full ${item.color}`} />
              <span className="text-xs text-gray-400">{item.name}</span>
            </div>
          ))}
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
