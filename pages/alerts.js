import { useState } from "react";
import { recentAlerts } from "@/lib/sampleData";

const allAlerts = [
  { id: "a001", message: "BTC PUMP predicted - 87% confidence", detail: "5/5 signals converged. Target: $75,600-$79,650 in 24-48h.", type: "high", time: "2 hours ago", module: "CRYPTO", read: false },
  { id: "a002", message: "NVDA earnings beat signal - 78% confidence", detail: "4/5 signals active. Earnings in 3 days. Options surge detected.", type: "medium", time: "5 hours ago", module: "STOCK", read: false },
  { id: "a003", message: "Fed rate cut signals converging - 81%", detail: "Cabinet signals + betting markets aligning for 25bps cut.", type: "high", time: "1 day ago", module: "POLITICAL", read: true },
  { id: "a004", message: "ETH accumulation pattern detected", detail: "Large wallets accumulating. 4/5 signals active at 73% confidence.", type: "info", time: "1 day ago", module: "CRYPTO", read: true },
  { id: "a005", message: "Unusual TSLA options activity", detail: "Call volume 3x normal. Monitoring for convergence.", type: "medium", time: "2 days ago", module: "STOCK", read: true },
  { id: "a006", message: "Startup QuickMed - FAILURE signals", detail: "Founder authenticity score dropped to 45%. Employee retention declining.", type: "warning", time: "3 days ago", module: "STARTUP", read: true },
  { id: "a007", message: "Dealer #C-089 high bust rate confirmed", detail: "42% bust rate on soft 17. Pattern confidence at 78%.", type: "info", time: "3 days ago", module: "CASINO", read: true },
  { id: "a008", message: "System accuracy update: 74% overall", detail: "Weekly performance report generated. Crypto improved +3.2%.", type: "system", time: "4 days ago", module: "SYSTEM", read: true },
];

export default function Alerts() {
  const [filter, setFilter] = useState("all");
  const [alerts, setAlerts] = useState(allAlerts);

  const filteredAlerts = filter === "all" ? alerts : filter === "unread" ? alerts.filter(a => !a.read) : alerts.filter(a => a.type === filter);

  const typeStyles = {
    high: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", dot: "bg-emerald-400", label: "HIGH CONFIDENCE" },
    medium: { bg: "bg-amber-500/5", border: "border-amber-500/20", dot: "bg-amber-400", label: "MEDIUM" },
    warning: { bg: "bg-red-500/5", border: "border-red-500/20", dot: "bg-red-400", label: "WARNING" },
    info: { bg: "bg-blue-500/5", border: "border-blue-500/20", dot: "bg-blue-400", label: "INFO" },
    system: { bg: "bg-gray-500/5", border: "border-gray-500/20", dot: "bg-gray-400", label: "SYSTEM" },
  };

  const markAllRead = () => setAlerts(alerts.map(a => ({ ...a, read: true })));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Alert Center</h2>
          <p className="text-gray-400 text-sm mt-1">{alerts.filter(a => !a.read).length} unread alerts</p>
        </div>
        <button onClick={markAllRead} className="px-4 py-2 rounded-xl bg-[#1a1a24] text-gray-400 border border-[#2e2e40] text-sm hover:text-white transition-colors">
          Mark All Read
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "unread", "high", "medium", "warning", "info", "system"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-[#1a1a24] text-gray-400 border border-[#2e2e40] hover:text-white"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "unread" && ` (${alerts.filter(a => !a.read).length})`}
          </button>
        ))}
      </div>

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
                      <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} border ${style.border} font-medium`} style={{ color: style.dot.replace("bg-", "").includes("emerald") ? "#34d399" : style.dot.replace("bg-", "").includes("amber") ? "#fbbf24" : style.dot.replace("bg-", "").includes("red") ? "#f87171" : style.dot.replace("bg-", "").includes("blue") ? "#60a5fa" : "#9ca3af" }}>
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
      </div>

      {/* Alert Settings Summary */}
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
