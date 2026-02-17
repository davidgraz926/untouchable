import { useState, useEffect, useCallback } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const DEFAULT_SETTINGS = {
  general: {
    systemMode: "Production",
    dataRefreshRate: "15 min",
    confidenceThreshold: "70%",
    signalConvergence: "4 signals",
  },
  modules: {
    crypto: true,
    stocks: true,
    startups: true,
    political: true,
    casino: true,
  },
  alerts: {
    inApp: true,
    email: true,
    sms: false,
    sound: true,
  },
};

export default function Settings({ user }) {
  const router = useRouter();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load settings from Firebase on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, "user_settings", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setSettings({
            general: { ...DEFAULT_SETTINGS.general, ...data.general },
            modules: { ...DEFAULT_SETTINGS.modules, ...data.modules },
            alerts: { ...DEFAULT_SETTINGS.alerts, ...data.alerts },
          });
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
      setLoading(false);
    };
    loadSettings();
  }, [user]);

  // Save settings to Firebase
  const saveSettings = useCallback(async (newSettings) => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const ref = doc(db, "user_settings", user.uid);
      await setDoc(ref, {
        ...newSettings,
        updatedAt: Date.now(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
    setSaving(false);
  }, [user]);

  // Update a general setting
  const updateGeneral = (key, value) => {
    const updated = { ...settings, general: { ...settings.general, [key]: value } };
    setSettings(updated);
    saveSettings(updated);
  };

  // Toggle a module
  const toggleModule = (key) => {
    const updated = { ...settings, modules: { ...settings.modules, [key]: !settings.modules[key] } };
    setSettings(updated);
    saveSettings(updated);
  };

  // Toggle an alert
  const toggleAlert = (key) => {
    const updated = { ...settings, alerts: { ...settings.alerts, [key]: !settings.alerts[key] } };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const generalOptions = [
    { key: "systemMode", label: "System Mode", options: ["Production", "Paper Trading", "Backtest"] },
    { key: "dataRefreshRate", label: "Data Refresh Rate", options: ["Real-time", "1 min", "5 min", "15 min"] },
    { key: "confidenceThreshold", label: "Default Confidence Threshold", options: ["60%", "70%", "75%", "80%"] },
    { key: "signalConvergence", label: "Signal Convergence Minimum", options: ["3 signals", "4 signals", "5 signals"] },
  ];

  const moduleList = [
    { key: "crypto", label: "Crypto Module", description: "BTC, ETH, altcoin predictions", color: "amber" },
    { key: "stocks", label: "Stock Module", description: "Earnings, options flow, insider activity", color: "blue" },
    { key: "startups", label: "Startup Module", description: "Success/failure predictions", color: "purple" },
    { key: "political", label: "Political Module", description: "Policy, elections, rate decisions", color: "cyan" },
    { key: "casino", label: "Casino Module", description: "Dealer behavior pattern analysis", color: "rose" },
  ];

  const alertList = [
    { key: "inApp", label: "In-App Notifications", detail: "All predictions > 70% confidence" },
    { key: "email", label: "Email Alerts", detail: "Critical predictions > 80% confidence" },
    { key: "sms", label: "SMS Alerts", detail: "Time-sensitive predictions < 24h window" },
    { key: "sound", label: "Sound Alerts", detail: "Audio notification on high confidence convergence" },
  ];

  const dataSources = [
    { name: "OpenAI GPT-4.1", status: "connected", type: "AI Engine", detail: "Responses API + Web Search" },
    { name: "Firebase Firestore", status: "connected", type: "Cache & Storage", detail: "15 min TTL caching" },
    { name: "Web Search (via OpenAI)", status: "connected", type: "Real-time Data", detail: "Crypto, stocks, political, startups" },
    { name: "CoinGecko (via search)", status: "connected", type: "Crypto Prices", detail: "BTC, ETH real-time pricing" },
    { name: "Whale Alert (via search)", status: "connected", type: "Whale Tracking", detail: "Large wallet movements" },
    { name: "Polymarket (via search)", status: "connected", type: "Political", detail: "Betting market odds" },
    { name: "SEC Filings (via search)", status: "connected", type: "Insider Trading", detail: "Corporate insider activity" },
    { name: "Twitter/X (via search)", status: "connected", type: "Social Sentiment", detail: "Crypto/stock social signals" },
  ];

  if (loading) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <p className="text-gray-400 text-sm mt-1">Loading configuration...</p>
          </div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] animate-pulse">
            <div className="h-4 w-32 bg-[#2e2e40] rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-12 bg-[#111118] rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-gray-400 text-sm mt-1">Configure prediction engine parameters</p>
        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-amber-400">Saving...</span>
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs text-emerald-400">Saved to Firebase</span>
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">User Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-white font-medium">{user?.email || "user@untouchable.app"}</p>
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
          {generalOptions.map((opt) => (
            <div key={opt.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{opt.label}</span>
              <select
                className="px-3 py-1.5 rounded-lg bg-[#111118] border border-[#2e2e40] text-white text-sm focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                value={settings.general[opt.key]}
                onChange={(e) => updateGeneral(opt.key, e.target.value)}
              >
                {opt.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
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
          {moduleList.map((mod) => {
            const enabled = settings.modules[mod.key];
            return (
              <div key={mod.key} className={`flex items-center justify-between p-3 rounded-xl bg-[#111118] border transition-all ${enabled ? "border-emerald-500/20" : "border-[#242432] opacity-60"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${enabled ? "bg-emerald-400" : "bg-gray-600"}`} />
                  <div>
                    <span className="text-sm text-gray-300">{mod.label}</span>
                    <p className="text-xs text-gray-600">{mod.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleModule(mod.key)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${enabled ? "bg-emerald-500" : "bg-gray-600"}`}
                  role="switch"
                  aria-checked={enabled}
                  aria-label={`Toggle ${mod.label}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${enabled ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert Settings */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Alert Settings</h3>
        <div className="space-y-3">
          {alertList.map((alert) => {
            const enabled = settings.alerts[alert.key];
            return (
              <div key={alert.key} className={`flex items-center justify-between p-3 rounded-xl bg-[#111118] border transition-all ${enabled ? "border-emerald-500/20" : "border-[#242432] opacity-60"}`}>
                <div>
                  <span className="text-sm text-gray-300">{alert.label}</span>
                  <p className="text-xs text-gray-600">{alert.detail}</p>
                </div>
                <button
                  onClick={() => toggleAlert(alert.key)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${enabled ? "bg-emerald-500" : "bg-gray-600"}`}
                  role="switch"
                  aria-checked={enabled}
                  aria-label={`Toggle ${alert.label}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${enabled ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Sources */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Data Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dataSources.map((source, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#111118] border border-[#242432]">
              <div>
                <span className="text-sm text-white">{source.name}</span>
                <p className="text-xs text-gray-600">{source.type}</p>
                <p className="text-xs text-gray-700 mt-0.5">{source.detail}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${source.status === "connected" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
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

      {/* API Status */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">API Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#111118] border border-[#242432]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">OpenAI API</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-gray-500">Model: GPT-4.1</p>
            <p className="text-xs text-gray-600">Tool: web_search_preview</p>
          </div>
          <div className="p-3 rounded-xl bg-[#111118] border border-[#242432]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">Firebase</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-gray-500">Cache TTL: 15 minutes</p>
            <p className="text-xs text-gray-600">Collections: 8 active</p>
          </div>
          <div className="p-3 rounded-xl bg-[#111118] border border-[#242432]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">API Routes</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-gray-500">11 endpoints active</p>
            <p className="text-xs text-gray-600">All parallel-capable</p>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="p-4 rounded-xl bg-[#111118] border border-[#242432] text-center">
        <p className="text-xs text-gray-600">UNTOUCHABLE Prediction Engine v1.0 | MATTIEGARZ LLC | Built by Hussein & Cesar</p>
        <p className="text-xs text-gray-700 mt-1">Powered by OpenAI GPT-4.1 Responses API | Firebase Firestore | Next.js</p>
      </div>
    </div>
  );
}
