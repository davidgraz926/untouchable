import { useState } from "react";
import StatsCard from "@/components/StatsCard";
import PredictionCard from "@/components/PredictionCard";
import {
  activePredictions,
  performanceData,
  recentAlerts,
  accuracyOverTime,
} from "@/lib/sampleData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function Dashboard() {
  const [selectedModule, setSelectedModule] = useState("all");

  const filteredPredictions =
    selectedModule === "all"
      ? activePredictions
      : activePredictions.filter(
          (p) => p.type === selectedModule.toUpperCase()
        );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Overall Accuracy"
          value={`${performanceData.overall.accuracy}%`}
          subtitle={`${performanceData.overall.correct}/${performanceData.overall.predictions} predictions`}
          color="emerald"
          trend={2.1}
        />
        <StatsCard
          title="Active Predictions"
          value={activePredictions.length}
          subtitle="Across all modules"
          color="blue"
        />
        <StatsCard
          title="Highest Confidence"
          value={`${Math.max(...activePredictions.map((p) => p.confidence))}%`}
          subtitle="BTC PUMP signal"
          color="amber"
        />
        <StatsCard
          title="Signals Today"
          value="23"
          subtitle="12 converged into predictions"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Predictions - Left 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              Active Predictions ({filteredPredictions.length})
            </h3>
            <div className="flex gap-2">
              {["all", "crypto", "stock", "political", "startup"].map((mod) => (
                <button
                  key={mod}
                  onClick={() => setSelectedModule(mod)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedModule === mod
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-dark-700 text-gray-400 hover:text-gray-200 border border-dark-500"
                  }`}
                >
                  {mod.charAt(0).toUpperCase() + mod.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredPredictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        </div>

        {/* Right Column - Performance & Alerts */}
        <div className="space-y-6">
          {/* Performance by Module */}
          <div className="p-6 rounded-2xl bg-dark-700 border border-dark-500">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Performance by Module
            </h3>
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
                    <div
                      className={`h-full ${mod.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${mod.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="p-6 rounded-2xl bg-dark-700 border border-dark-500">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Recent Alerts
            </h3>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border ${
                    alert.type === "high"
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : alert.type === "medium"
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "bg-dark-600 border-dark-500"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        alert.type === "high"
                          ? "bg-emerald-400"
                          : alert.type === "medium"
                          ? "bg-amber-400"
                          : "bg-gray-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm text-gray-300">{alert.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Chart */}
      <div className="p-6 rounded-2xl bg-dark-700 border border-dark-500">
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">
          Accuracy Over Time
        </h3>
        <div className="h-72">
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
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a24",
                  border: "1px solid #2e2e40",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                }}
              />
              <Area
                type="monotone"
                dataKey="overall"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOverall)"
                name="Overall"
              />
              <Area
                type="monotone"
                dataKey="crypto"
                stroke="#f59e0b"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorCrypto)"
                name="Crypto"
              />
              <Line
                type="monotone"
                dataKey="stocks"
                stroke="#3b82f6"
                strokeWidth={1.5}
                dot={false}
                name="Stocks"
              />
              <Line
                type="monotone"
                dataKey="political"
                stroke="#06b6d4"
                strokeWidth={1.5}
                dot={false}
                name="Political"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          {[
            { name: "Overall", color: "bg-emerald-400" },
            { name: "Crypto", color: "bg-amber-400" },
            { name: "Stocks", color: "bg-blue-400" },
            { name: "Political", color: "bg-cyan-400" },
          ].map((item) => (
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
