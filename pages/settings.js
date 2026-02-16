import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function Settings({ user }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const settings = {
    general: [
      { label: "System Mode", value: "Production", options: ["Production", "Paper Trading", "Backtest"] },
      { label: "Data Refresh Rate", value: "Real-time", options: ["Real-time", "1 min", "5 min", "15 min"] },
      { label: "Default Confidence Threshold", value: "70%", options: ["60%", "70%", "75%", "80%"] },
      { label: "Signal Convergence Minimum", value: "4 signals", options: ["3 signals", "4 signals", "5 signals"] },
    ],
    modules: [
      { label: "Crypto Module", enabled: true },
      { label: "Stock Module", enabled: true },
      { label: "Startup Module", enabled: true },
      { label: "Political Module", enabled: true },
      { label: "Casino Module", enabled: true },
    ],
    alerts: [
      { label: "In-App Notifications", enabled: true, detail: "All predictions > 70%" },
      { label: "Email Alerts", enabled: true, detail: "Critical > 80% confidence" },
      { label: "SMS Alerts", enabled: false, detail: "Time-sensitive < 24h" },
      { label: "Sound Alerts", enabled: true, detail: "High confidence convergence" },
    ],
    dataSources: [
      { name: "CoinGecko API", status: "connected", type: "Crypto" },
      { name: "Binance API", status: "connected", type: "Crypto" },
      { name: "Yahoo Finance", status: "connected", type: "Stocks" },
      { name: "Alpha Vantage", status: "connected", type: "Stocks" },
      { name: "NewsAPI", status: "connected", type: "Sentiment" },
      { name: "Twitter API", status: "pending", type: "Social" },
      { name: "Reddit API", status: "connected", type: "Social" },
      { name: "Polymarket", status: "connected", type: "Political" },
    ],
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-gray-400 text-sm mt-1">Configure prediction engine parameters</p>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">User Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
            {user?.email?.charAt(0).toUpperCase() || "D"}
          </div>
          <div>
            <p className="text-white font-medium">{user?.email || "david@mattiegarz.com"}</p>
            <p className="text-xs text-gray-500 mt-1">Admin | MATTIEGARZ LLC</p>
            <p className="text-xs text-gray-600 mt-0.5">Last login: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="mt-4 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm hover:bg-red-500/20 transition-colors">
          Sign Out
        </button>
      </div>

      {/* General Settings */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">General Settings</h3>
        <div className="space-y-4">
          {settings.general.map((setting, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{setting.label}</span>
              <select className="px-3 py-1.5 rounded-lg bg-[#111118] border border-[#2e2e40] text-white text-sm focus:outline-none focus:border-emerald-500/50" defaultValue={setting.value}>
                {setting.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Module Toggles */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Prediction Modules</h3>
        <div className="space-y-3">
          {settings.modules.map((mod, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#111118] border border-[#242432]">
              <span className="text-sm text-gray-300">{mod.label}</span>
              <div className={`w-10 h-5 rounded-full ${mod.enabled ? "bg-emerald-500" : "bg-gray-600"} relative cursor-pointer transition-colors`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${mod.enabled ? "right-0.5" : "left-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Settings */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Alert Settings</h3>
        <div className="space-y-3">
          {settings.alerts.map((alert, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#111118] border border-[#242432]">
              <div>
                <span className="text-sm text-gray-300">{alert.label}</span>
                <p className="text-xs text-gray-600">{alert.detail}</p>
              </div>
              <div className={`w-10 h-5 rounded-full ${alert.enabled ? "bg-emerald-500" : "bg-gray-600"} relative cursor-pointer transition-colors`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${alert.enabled ? "right-0.5" : "left-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Data Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {settings.dataSources.map((source, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#111118] border border-[#242432]">
              <div>
                <span className="text-sm text-white">{source.name}</span>
                <p className="text-xs text-gray-600">{source.type}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${source.status === "connected" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                {source.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Security</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111118] border border-[#242432]">
            <div>
              <span className="text-sm text-gray-300">Two-Factor Authentication</span>
              <p className="text-xs text-gray-600">Required for login</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Enabled</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111118] border border-[#242432]">
            <div>
              <span className="text-sm text-gray-300">Session Timeout</span>
              <p className="text-xs text-gray-600">Auto-logout after inactivity</p>
            </div>
            <span className="text-sm text-white">1 hour</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111118] border border-[#242432]">
            <div>
              <span className="text-sm text-gray-300">Data Encryption</span>
              <p className="text-xs text-gray-600">AES-256 at rest, TLS 1.3 in transit</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Active</span>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="p-4 rounded-xl bg-[#111118] border border-[#242432] text-center">
        <p className="text-xs text-gray-600">UNTOUCHABLE Prediction Engine v1.0 | MATTIEGARZ LLC | Built by Hussein & Cesar</p>
      </div>
    </div>
  );
}
