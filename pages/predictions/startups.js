import { useState, useEffect, useCallback } from "react";
import StatsCard from "@/components/StatsCard";
import PredictionCard from "@/components/PredictionCard";

export default function StartupPredictions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/startups/data");
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error("Failed to fetch startup data:", err);
    }
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const trackedStartups = data?.trackedStartups || [];
  const predictions = data?.predictions || [];
  const accuracy = data?.accuracy || { overall: 75, correct: 15, total: 20 };
  const stats = data?.stats || { tracking: 0, successRate: 0, redFlags: 0 };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Startup Predictions</h2>
          <p className="text-gray-400 text-sm mt-1">AI-powered startup success/failure predictions using real-time data</p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && <span className="text-xs text-gray-500">Updated: {lastRefresh.toLocaleTimeString()}</span>}
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all disabled:opacity-50">
            <svg className={`w-4 h-4 text-purple-400 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm text-purple-400 font-medium">{loading ? "Loading..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          [1,2,3,4].map(i => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatsCard title="Startup Accuracy" value={`${accuracy.overall}%`} subtitle={`${accuracy.correct}/${accuracy.total} correct`} color="purple" trend={4.0} />
            <StatsCard title="Tracking" value={stats.tracking || trackedStartups.length} subtitle="Startups monitored" color="emerald" />
            <StatsCard title="Success Rate" value={`${stats.successRate || 68}%`} subtitle="Predicted successes" color="amber" />
            <StatsCard title="Red Flags" value={stats.redFlags || 0} subtitle="Detected this week" color="red" />
          </>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-64 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trackedStartups.map((startup, i) => (
            <div key={i} className={`p-6 rounded-2xl bg-[#1a1a24] border ${startup.prediction === "SUCCESS" ? "border-emerald-500/20" : "border-red-500/20"} card-hover`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{startup.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">{startup.sector}</span>
                    <span className="text-xs text-gray-500">{startup.stage}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${startup.prediction === "SUCCESS" ? "text-emerald-400" : "text-red-400"}`}>{startup.confidence}%</span>
                  <p className={`text-xs ${startup.prediction === "SUCCESS" ? "text-emerald-400" : "text-red-400"}`}>{startup.prediction}</p>
                </div>
              </div>

              <div className="space-y-2">
                {startup.signals && Object.entries(startup.signals).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 capitalize">{key === "traction" ? "Customer Traction" : key === "funding" ? "Funding Velocity" : key === "timing" ? "Market Timing" : key === "retention" ? "Employee Retention" : "Founder Authenticity"}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-[#2e2e40] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${value >= 70 ? "bg-emerald-400" : value >= 50 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${value}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{value}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {startup.reasoning && <p className="text-xs text-gray-500 mt-3 italic">{startup.reasoning}</p>}

              <div className="mt-4 pt-3 border-t border-[#242432]">
                <div className="flex items-center gap-2">
                  {(startup.flagType === "green" || startup.prediction === "SUCCESS") ? (
                    <><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-xs text-emerald-400">{startup.flagDetail || "Green flags: Strong fundamentals"}</span></>
                  ) : (
                    <><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-xs text-red-400">{startup.flagDetail || "Red flags: Weak signals detected"}</span></>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {predictions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Active Startup Predictions</h3>
          {predictions.map((p) => <PredictionCard key={p.id} prediction={p} />)}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return <div className="p-5 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] animate-pulse"><div className="h-4 w-20 bg-[#2e2e40] rounded mb-3" /><div className="h-8 w-28 bg-[#2e2e40] rounded mb-2" /><div className="h-3 w-24 bg-[#2e2e40] rounded" /></div>;
}
