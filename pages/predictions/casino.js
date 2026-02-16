import StatsCard from "@/components/StatsCard";
import { performanceData } from "@/lib/sampleData";

const dealerProfiles = [
  { name: "Dealer #A-117", table: "Blackjack T3", bustRate: 38, pattern: "Slow on soft 17", confidence: 73, tells: ["hand_speed_slow", "posture_shift", "eye_contact_drop"] },
  { name: "Dealer #B-204", table: "Blackjack T7", bustRate: 31, pattern: "Fast dealer, few tells", confidence: 58, tells: ["consistent_speed", "minimal_tells"] },
  { name: "Dealer #C-089", table: "Blackjack T1", bustRate: 42, pattern: "Nervous on high cards", confidence: 78, tells: ["micro_expression", "hand_hesitation", "breathing_change", "posture_lean"] },
  { name: "Dealer #D-331", table: "Blackjack T5", bustRate: 35, pattern: "Relaxed, consistent", confidence: 62, tells: ["slight_smile", "rhythm_break"] },
];

const recentHands = [
  { hand: 1, dealer: "#C-089", prediction: "BUST", actual: "BUST", correct: true, confidence: 78 },
  { hand: 2, dealer: "#C-089", prediction: "WIN", actual: "WIN", correct: true, confidence: 65 },
  { hand: 3, dealer: "#A-117", prediction: "BUST", actual: "21", correct: false, confidence: 71 },
  { hand: 4, dealer: "#C-089", prediction: "BUST", actual: "BUST", correct: true, confidence: 82 },
  { hand: 5, dealer: "#A-117", prediction: "BUST", actual: "BUST", correct: true, confidence: 74 },
  { hand: 6, dealer: "#B-204", prediction: "WIN", actual: "BUST", correct: false, confidence: 58 },
  { hand: 7, dealer: "#C-089", prediction: "BUST", actual: "BUST", correct: true, confidence: 80 },
  { hand: 8, dealer: "#D-331", prediction: "WIN", actual: "WIN", correct: true, confidence: 62 },
];

export default function CasinoPredictions() {
  const winRate = Math.round((recentHands.filter(h => h.correct).length / recentHands.length) * 100);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Casino / Gambling Module</h2>
          <p className="text-gray-400 text-sm mt-1">Behavioral pattern recognition - dealer tells & table dynamics</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-sm text-rose-400 font-medium">Pattern Analysis Mode</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <p className="text-sm text-amber-400">Note: This module uses behavioral pattern recognition, NOT card counting. It analyzes dealer micro-expressions, hand speed, and body language patterns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Casino Accuracy" value={`${performanceData.casino.accuracy}%`} subtitle={`${performanceData.casino.correct}/${performanceData.casino.predictions} correct`} color="rose" trend={1.8} />
        <StatsCard title="Dealers Profiled" value={dealerProfiles.length} subtitle="Active profiles" color="amber" />
        <StatsCard title="Recent Win Rate" value={`${winRate}%`} subtitle={`${recentHands.filter(h=>h.correct).length}/${recentHands.length} hands`} color="emerald" />
        <StatsCard title="Best Dealer" value="#C-089" subtitle="42% bust rate detected" color="purple" />
      </div>

      {/* Dealer Profiles */}
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

      {/* Recent Hands */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Recent Hand Analysis</h3>
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
            <tbody className="space-y-2">
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
      </div>
    </div>
  );
}
