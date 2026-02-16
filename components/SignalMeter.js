export default function SignalMeter({ signals, size = "md" }) {
  const active = signals.filter((s) => s.active).length;
  const total = signals.length;

  const sizeMap = {
    sm: { bar: "h-1.5", gap: "gap-0.5", text: "text-xs" },
    md: { bar: "h-2", gap: "gap-1", text: "text-sm" },
    lg: { bar: "h-3", gap: "gap-1.5", text: "text-base" },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`${s.text} text-gray-400`}>Signal Convergence</span>
        <span className={`${s.text} font-bold ${active >= 4 ? "text-emerald-400" : "text-amber-400"}`}>
          {active}/{total}
        </span>
      </div>
      <div className={`flex ${s.gap}`}>
        {signals.map((signal, i) => (
          <div key={i} className="flex-1 group relative">
            <div
              className={`${s.bar} rounded-full transition-all duration-500 ${
                signal.active ? "bg-emerald-400" : "bg-dark-500"
              }`}
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-600 rounded text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {signal.name.replace(/_/g, " ")} - {Math.round(signal.strength * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
