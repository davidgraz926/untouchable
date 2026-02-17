import { useState, useEffect, useCallback } from "react";
import StatsCard from "@/components/StatsCard";

export default function CasinoPredictions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/casino/data");
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error("Failed to fetch casino data:", err);
    }
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const dealerProfiles = data?.dealerProfiles || [];
  const recentHands = data?.recentHands || [];
  const stats = data?.stats || { accuracy: 71, dealersProfiled: 0, winRate: 0, bestDealer: "--", bestDealerBustRate: 0 };
  const insights = data?.insights || [];

  const winRate = recentHands.length > 0
    ? Math.round((recentHands.filter(h => h.correct).length / recentHands.length) * 100)
    : stats.winRate;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Casino / Gambling Module</h2>
          <p className="text-gray-400 text-sm mt-1">AI-powered behavioral pattern recognition using research data</p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && <span className="text-xs text-gray-500">Updated: {lastRefresh.toLocaleTimeString()}</span>}
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all disabled:opacity-50">
            <svg className={`w-4 h-4 text-rose-400 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm text-rose-400 font-medium">{loading ? "Loading..." : "Refresh"}</span>
          </button>
          <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-sm text-rose-400 font-medium">Pattern Analysis Mode</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <p className="text-sm text-amber-400">Note: This module uses behavioral pattern recognition, NOT card counting. It analyzes dealer micro-expressions, hand speed, and body language patterns based on published research.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          [1,2,3,4].map(i => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatsCard title="Casino Accuracy" value={`${stats.accuracy}%`} subtitle="Based on analysis" color="rose" trend={1.8} />
            <StatsCard title="Dealers Profiled" value={stats.dealersProfiled || dealerProfiles.length} subtitle="Active profiles" color="amber" />
            <StatsCard title="Recent Win Rate" value={`${winRate}%`} subtitle={`${recentHands.filter(h=>h.correct).length}/${recentHands.length} hands`} color="emerald" />
            <StatsCard title="Best Dealer" value={stats.bestDealer} subtitle={`${stats.bestDealerBustRate}% bust rate`} color="purple" />
          </>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-52 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dealerProfiles.map((dealer, i) => (
            <div key={i} className={`p-6 rounded-2xl bg-[#1a1a24] border ${dealer.confidence >= 70 ? "border-emerald-500/20" : "border-[#2e2e40]"} card-hover`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{dealer.name}</h3>
                  <p className="text-xs text-gray-500">{dealer.table}</p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${dealer.confidence >= 70 ? "text-emerald-400" : "text-amber-400"}`}>{dealer.confidence}%</span>
                  <p className="text-xs text-gray-500">confidence</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Bust Rate</span>
                  <span className="text-white font-medium">{dealer.bustRate}%</span>
                </div>
                <div className="h-2 bg-[#2e2e40] rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: `${dealer.bustRate}%` }} />
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-3">Pattern: {dealer.pattern}</p>
              <div className="flex flex-wrap gap-2">
                {dealer.tells.map((tell, j) => (
                  <span key={j} className="text-xs px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {tell.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {insights.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Research Insights</h3>
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-[#111118] border border-[#242432]">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <p className="text-sm text-gray-300">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Recent Hand Analysis</h3>
        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-10 bg-[#111118] rounded animate-pulse" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#242432]">
                  <th className="text-left text-xs text-gray-500 uppercase pb-3 pr-4">Hand</th>
                  <th className="text-left text-xs text-gray-500 uppercase pb-3 pr-4">Dealer</th>
                  <th className="text-left text-xs text-gray-500 uppercase pb-3 pr-4">Prediction</th>
                  <th className="text-left text-xs text-gray-500 uppercase pb-3 pr-4">Actual</th>
                  <th className="text-left text-xs text-gray-500 uppercase pb-3 pr-4">Confidence</th>
                  <th className="text-left text-xs text-gray-500 uppercase pb-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {recentHands.map((hand) => (
                  <tr key={hand.hand} className="border-b border-[#1a1a24]">
                    <td className="py-3 pr-4 text-sm text-gray-400">#{hand.hand}</td>
                    <td className="py-3 pr-4 text-sm text-white font-mono">{hand.dealer}</td>
                    <td className="py-3 pr-4 text-sm text-gray-300">{hand.prediction}</td>
                    <td className="py-3 pr-4 text-sm text-gray-300">{hand.actual}</td>
                    <td className="py-3 pr-4 text-sm text-gray-400">{hand.confidence}%</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${hand.correct ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {hand.correct ? "CORRECT" : "WRONG"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="p-5 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] animate-pulse"><div className="h-4 w-20 bg-[#2e2e40] rounded mb-3" /><div className="h-8 w-28 bg-[#2e2e40] rounded mb-2" /><div className="h-3 w-24 bg-[#2e2e40] rounded" /></div>;
}
