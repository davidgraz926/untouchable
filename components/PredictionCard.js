import { getConfidenceColor, getPredictionLabel } from "../lib/predictionEngine";

export default function PredictionCard({ prediction, compact = false }) {
  const colors = getConfidenceColor(prediction.confidence);

  const typeColors = {
    CRYPTO: "text-amber-400 bg-amber-500/10",
    STOCK: "text-blue-400 bg-blue-500/10",
    STARTUP: "text-purple-400 bg-purple-500/10",
    POLITICAL: "text-cyan-400 bg-cyan-500/10",
    CASINO: "text-rose-400 bg-rose-500/10",
  };

  const activeSignals = prediction.signals?.filter((s) => s.active) || [];
  const totalSignals = prediction.signals?.length || 5;

  if (compact) {
    return (
      <div className={`p-4 rounded-xl bg-dark-700 border ${colors.border} card-hover`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[prediction.type] || "text-gray-400 bg-dark-600"}`}>
              {prediction.type}
            </span>
            <span className="text-white font-semibold text-sm">{prediction.asset}</span>
          </div>
          <span className={`text-lg font-bold ${colors.text}`}>{prediction.confidence}%</span>
        </div>
        <p className="text-xs text-gray-400">
          {getPredictionLabel(prediction.prediction)} | {prediction.timeframe}
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl bg-dark-700 border ${colors.border} card-hover ${prediction.confidence >= 80 ? "glow-green" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${typeColors[prediction.type] || "text-gray-400 bg-dark-600"}`}>
            {prediction.type}
          </span>
          <h3 className="text-white font-bold text-lg">{prediction.asset}</h3>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${colors.bg} ${colors.border} border`}>
          <span className={`text-2xl font-bold ${colors.text}`}>{prediction.confidence}%</span>
        </div>
      </div>

      {/* Prediction Info */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-sm font-bold ${colors.text}`}>
            {getPredictionLabel(prediction.prediction)}
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-sm text-gray-400">{prediction.timeframe}</span>
        </div>
        {prediction.targetMove && (
          <p className="text-sm text-gray-300">
            Target: <span className="text-emerald-400 font-medium">{prediction.targetMove}</span>
          </p>
        )}
        {prediction.entryPrice && (
          <p className="text-xs text-gray-500 mt-1">
            Entry: {prediction.entryPrice} → Target: {prediction.targetPrice}
          </p>
        )}
      </div>

      {/* Signal Convergence Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Signal Convergence</span>
          <span className={`text-xs font-bold ${colors.text}`}>
            {activeSignals.length}/{totalSignals} signals
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSignals }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                i < activeSignals.length
                  ? prediction.confidence >= 80
                    ? "bg-emerald-400"
                    : prediction.confidence >= 70
                    ? "bg-amber-400"
                    : "bg-red-400"
                  : "bg-dark-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Individual Signals */}
      <div className="space-y-2">
        {prediction.signals?.map((signal, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${signal.active ? "bg-emerald-400" : "bg-dark-500"}`} />
              <span className="text-xs text-gray-400 capitalize">
                {signal.name.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-dark-500 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${signal.active ? "bg-emerald-400" : "bg-dark-400"}`}
                  style={{ width: `${signal.strength * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">
                {Math.round(signal.strength * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Timestamp */}
      <div className="mt-4 pt-3 border-t border-dark-600 flex items-center justify-between">
        <span className="text-xs text-gray-600">
          {new Date(prediction.timestamp).toLocaleString()}
        </span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-live" />
          <span className="text-xs text-emerald-400">ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
