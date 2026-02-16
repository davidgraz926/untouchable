import StatsCard from "@/components/StatsCard";
import PredictionCard from "@/components/PredictionCard";
import { activePredictions, performanceData } from "@/lib/sampleData";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const bettingMarketData = [
  { date: "Feb 1", rateCut: 55, rateHold: 35, rateHike: 10 },
  { date: "Feb 4", rateCut: 60, rateHold: 30, rateHike: 10 },
  { date: "Feb 7", rateCut: 65, rateHold: 28, rateHike: 7 },
  { date: "Feb 10", rateCut: 70, rateHold: 24, rateHike: 6 },
  { date: "Feb 13", rateCut: 75, rateHold: 20, rateHike: 5 },
  { date: "Feb 16", rateCut: 78, rateHold: 18, rateHike: 4 },
];

const cabinetTracking = [
  { name: "Treasury Secretary", status: "dovish", change: "Shifted dovish", confidence: 85, detail: "3 speeches mentioning rate relief" },
  { name: "Fed Chair", status: "neutral", change: "No change", confidence: 60, detail: "Measured language in last statement" },
  { name: "Commerce Secretary", status: "dovish", change: "Shifted dovish", confidence: 72, detail: "Economic concerns expressed" },
  { name: "Labor Secretary", status: "hawkish", change: "No change", confidence: 45, detail: "Strong employment focus" },
];

const upcomingEvents = [
  { event: "FOMC Meeting", date: "Mar 18-19", impact: "High", prediction: "Rate Cut (-25bps)" },
  { event: "CPI Release", date: "Mar 12", impact: "High", prediction: "2.8% (below consensus)" },
  { event: "Jobs Report", date: "Mar 7", impact: "Medium", prediction: "185K (below est.)" },
  { event: "Senate Vote - AI Bill", date: "Mar 5", impact: "Medium", prediction: "PASS (62-38)" },
];

export default function PoliticalPredictions() {
  const politicalPredictions = activePredictions.filter((p) => p.type === "POLITICAL");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Political Predictions</h2>
          <p className="text-gray-400 text-sm mt-1">Predict policy changes, elections, and regulatory outcomes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Political Accuracy" value={`${performanceData.political.accuracy}%`} subtitle={`${performanceData.political.correct}/${performanceData.political.predictions} correct`} color="cyan" trend={2.5} />
        <StatsCard title="Active Predictions" value={politicalPredictions.length} subtitle="Being tracked" color="emerald" />
        <StatsCard title="Upcoming Events" value="4" subtitle="In next 30 days" color="amber" />
        <StatsCard title="Cabinet Shifts" value="2" subtitle="Detected this week" color="purple" />
      </div>

      {/* Betting Market Trends */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Betting Market Trends - Fed Rate Decision</h3>
        <div className="h-64">
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white">Active Political Predictions</h3>
          {politicalPredictions.map((p) => (
            <PredictionCard key={p.id} prediction={p} />
          ))}

          {/* Upcoming Events */}
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Upcoming Events</h3>
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
          </div>
        </div>

        <div className="space-y-6">
          {/* Cabinet Tracking */}
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Cabinet Tracking</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
}
