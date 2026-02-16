import StatsCard from "@/components/StatsCard";
import PredictionCard from "@/components/PredictionCard";
import { activePredictions, performanceData } from "@/lib/sampleData";

const trackedStartups = [
  { name: "NeuralVault AI", sector: "AI/ML", stage: "Series B", prediction: "SUCCESS", confidence: 78, signals: { founder: 85, retention: 82, traction: 90, funding: 75, timing: 70 } },
  { name: "GreenChain", sector: "CleanTech", stage: "Series A", prediction: "SUCCESS", confidence: 72, signals: { founder: 80, retention: 75, traction: 70, funding: 72, timing: 65 } },
  { name: "QuickMed", sector: "HealthTech", stage: "Seed", prediction: "FAILURE", confidence: 68, signals: { founder: 45, retention: 40, traction: 55, funding: 60, timing: 50 } },
  { name: "PayBridge", sector: "FinTech", stage: "Series C", prediction: "SUCCESS", confidence: 82, signals: { founder: 88, retention: 85, traction: 80, funding: 82, timing: 78 } },
];

export default function StartupPredictions() {
  const startupPredictions = activePredictions.filter((p) => p.type === "STARTUP");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Startup Predictions</h2>
          <p className="text-gray-400 text-sm mt-1">Predict startup success/failure probability over 12-24 months</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Startup Accuracy" value={`${performanceData.startups.accuracy}%`} subtitle={`${performanceData.startups.correct}/${performanceData.startups.predictions} correct`} color="purple" trend={4.0} />
        <StatsCard title="Tracking" value={trackedStartups.length} subtitle="Startups monitored" color="emerald" />
        <StatsCard title="Success Rate" value="68%" subtitle="Predicted successes" color="amber" />
        <StatsCard title="Red Flags" value="3" subtitle="Detected this week" color="red" />
      </div>

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
              {Object.entries(startup.signals).map(([key, value]) => (
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

            <div className="mt-4 pt-3 border-t border-[#242432]">
              <div className="flex items-center gap-2">
                {startup.prediction === "SUCCESS" ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-emerald-400">Green flags: Strong fundamentals</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs text-red-400">Red flags: Weak retention & founder signals</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {startupPredictions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Active Startup Predictions</h3>
          {startupPredictions.map((p) => (
            <PredictionCard key={p.id} prediction={p} />
          ))}
        </div>
      )}
    </div>
  );
}
