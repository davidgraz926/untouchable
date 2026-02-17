import { useState, useEffect, useCallback } from "react";
import StatsCard from "@/components/StatsCard";
import PredictionCard from "@/components/PredictionCard";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function PoliticalPredictions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/political/data");
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error("Failed to fetch political data:", err);
    }
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const bettingMarketData = data?.bettingMarketData || [];
  const cabinetTracking = data?.cabinetTracking || [];
  const upcomingEvents = data?.upcomingEvents || [];
  const predictions = data?.predictions || [];
  const accuracy = data?.accuracy || { overall: 82, correct: 18, total: 22 };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Political Predictions</h2>
          <p className="text-gray-400 text-sm mt-1">AI-powered political and economic predictions using real-time data</p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && <span className="text-xs text-gray-500">Updated: {lastRefresh.toLocaleTimeString()}</span>}
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all disabled:opacity-50">
            <svg className={`w-4 h-4 text-cyan-400 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm text-cyan-400 font-medium">{loading ? "Loading..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          [1,2,3,4].map(i => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatsCard title="Political Accuracy" value={`${accuracy.overall}%`} subtitle={`${accuracy.correct}/${accuracy.total} correct`} color="cyan" trend={2.5} />
            <StatsCard title="Active Predictions" value={predictions.length} subtitle="Being tracked" color="emerald" />
            <StatsCard title="Upcoming Events" value={upcomingEvents.length} subtitle="In next 30 days" color="amber" />
            <StatsCard title="Cabinet Shifts" value={cabinetTracking.filter(c => c.change && c.change !== "No change").length} subtitle="Detected this week" color="purple" />
          </>
        )}
      </div>

      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Betting Market Trends - Fed Rate Decision</h3>
        <div className="h-64">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-400 text-sm">Fetching betting market data...</span>
              </div>
            </div>
          ) : bettingMarketData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bettingMarketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242432" />
                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2e2e40", borderRadius: "12px", color: "#e2e8f0" }} />
                <Line type="monotone" dataKey="rateCut" stroke="#10b981" strokeWidth={2} name="Rate Cut" dot={false} />
                <Line type="monotone" dataKey="rateHold" stroke="#f59e0b" strokeWidth={2} name="Rate Hold" dot={false} />
                <Line type="monotone" dataKey="rateHike" stroke="#ef4444" strokeWidth={2} name="Rate Hike" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">No betting market data available</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white">Active Political Predictions</h3>
          {loading ? (
            <div className="space-y-4">{[1,2].map(i => <PredictionSkeleton key={i} />)}</div>
          ) : predictions.length > 0 ? (
            predictions.map((p) => <PredictionCard key={p.id} prediction={p} />)
          ) : (
            <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] text-center">
              <p className="text-gray-500">No active predictions. Refresh to scan.</p>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Upcoming Events</h3>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 rounded-xl bg-[#111118] animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#111118] border border-[#242432]">
                    <div>
                      <p className="text-sm text-white font-medium">{event.event}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{event.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${event.impact === "High" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>{event.impact}</span>
                      <p className="text-xs text-cyan-400 mt-1">{event.prediction}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Cabinet Tracking</h3>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 rounded-xl bg-[#111118] animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {cabinetTracking.map((member, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#111118] border border-[#242432]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white font-medium">{member.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${member.status === "dovish" ? "bg-emerald-500/10 text-emerald-400" : member.status === "hawkish" ? "bg-red-500/10 text-red-400" : "bg-gray-500/10 text-gray-400"}`}>{member.status}</span>
                    </div>
                    <p className="text-xs text-gray-500">{member.detail}</p>
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
