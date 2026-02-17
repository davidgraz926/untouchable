import { useState, useEffect, useCallback } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/alerts/data");
      const json = await res.json();
      setAlerts(json.data?.alerts || []);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    }
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredAlerts = filter === "all" ? alerts : filter === "unread" ? alerts.filter(a => !a.read) : alerts.filter(a => a.type === filter);

  const typeStyles = {
    high: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", dot: "bg-emerald-400", label: "HIGH CONFIDENCE", color: "#34d399" },
    medium: { bg: "bg-amber-500/5", border: "border-amber-500/20", dot: "bg-amber-400", label: "MEDIUM", color: "#fbbf24" },
    warning: { bg: "bg-red-500/5", border: "border-red-500/20", dot: "bg-red-400", label: "WARNING", color: "#f87171" },
    info: { bg: "bg-blue-500/5", border: "border-blue-500/20", dot: "bg-blue-400", label: "INFO", color: "#60a5fa" },
    system: { bg: "bg-gray-500/5", border: "border-gray-500/20", dot: "bg-gray-400", label: "SYSTEM", color: "#9ca3af" },
  };

  const markAllRead = () => setAlerts(alerts.map(a => ({ ...a, read: true })));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Alert Center</h2>
          <p className="text-gray-400 text-sm mt-1">{alerts.filter(a => !a.read).length} unread alerts</p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && <span className="text-xs text-gray-500">Updated: {lastRefresh.toLocaleTimeString()}</span>}
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50">
            <svg className={`w-4 h-4 text-emerald-400 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm text-emerald-400 font-medium">{loading ? "Loading..." : "Refresh"}</span>
          </button>
          <button onClick={markAllRead} className="px-4 py-2 rounded-xl bg-[#1a1a24] text-gray-400 border border-[#2e2e40] text-sm hover:text-white transition-colors">
            Mark All Read
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "unread", "high", "medium", "warning", "info", "system"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-[#1a1a24] text-gray-400 border border-[#2e2e40] hover:text-white"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "unread" && ` (${alerts.filter(a => !a.read).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5,6].map(i => <div key={i} className="h-24 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const style = typeStyles[alert.type] || typeStyles.info;
            return (
              <div key={alert.id} className={`p-5 rounded-2xl border transition-all ${style.bg} ${style.border} ${!alert.read ? "ring-1 ring-emerald-500/20" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${style.dot} ${!alert.read ? "animate-pulse" : ""}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} border ${style.border} font-medium`} style={{ color: style.color }}>
                          {style.label}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#242432] text-gray-400">{alert.module}</span>
                        {!alert.read && <span className="text-xs text-emerald-400 font-medium">NEW</span>}
                      </div>
                      <p className="text-sm text-white font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.detail}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap ml-4">{alert.time}</span>
                </div>
              </div>
            );
          })}
          {filteredAlerts.length === 0 && (
            <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] text-center">
              <p className="text-gray-500">No alerts matching this filter.</p>
            </div>
          )}
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Alert Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#111118] border border-[#242432]">
            <p className="text-sm text-white font-medium mb-1">In-App Notifications</p>
            <p className="text-xs text-gray-500">All predictions &gt; 70% confidence</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-8 h-4 rounded-full bg-emerald-500 relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" /></div>
              <span className="text-xs text-emerald-400">Enabled</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#111118] border border-[#242432]">
            <p className="text-sm text-white font-medium mb-1">Email Alerts</p>
            <p className="text-xs text-gray-500">Critical predictions &gt; 80% only</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-8 h-4 rounded-full bg-emerald-500 relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" /></div>
              <span className="text-xs text-emerald-400">Enabled</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#111118] border border-[#242432]">
            <p className="text-sm text-white font-medium mb-1">SMS Alerts</p>
            <p className="text-xs text-gray-500">Time-sensitive &lt; 24h window</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-8 h-4 rounded-full bg-gray-600 relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-gray-400" /></div>
              <span className="text-xs text-gray-500">Disabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
