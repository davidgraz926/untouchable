import { useState, useEffect, useCallback } from "react";
import StatsCard from "@/components/StatsCard";
import PredictionCard from "@/components/PredictionCard";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function CryptoPredictions() {
  const [prices, setPrices] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [whales, setWhales] = useState(null);
  const [signals, setSignals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({
    prices: true,
    predictions: true,
    whales: true,
    signals: true,
  });
  const [errors, setErrors] = useState({});
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadingStates({
      prices: true,
      predictions: true,
      whales: true,
      signals: true,
    });

    // Parallel API calls - all fire at once
    const endpoints = [
      { key: "prices", url: "/api/crypto/prices", setter: setPrices },
      {
        key: "predictions",
        url: "/api/crypto/predictions",
        setter: setPredictions,
      },
      { key: "whales", url: "/api/crypto/whales", setter: setWhales },
      { key: "signals", url: "/api/crypto/signals", setter: setSignals },
    ];

    const results = await Promise.allSettled(
      endpoints.map(async ({ key, url, setter }) => {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          setter(json.data);
          setLoadingStates((prev) => ({ ...prev, [key]: false }));
          return { key, data: json.data, source: json.source };
        } catch (err) {
          setErrors((prev) => ({ ...prev, [key]: err.message }));
          setLoadingStates((prev) => ({ ...prev, [key]: false }));
          throw err;
        }
      })
    );

    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Format price with commas
  const formatPrice = (num) => {
    if (!num) return "$0";
    return "$" + Number(num).toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  const cryptoPredictions = predictions?.predictions || [];
  const chartData = prices?.chartData || [];
  const whaleActivity = whales?.whaleActivity || [];
  const signalData = signals?.signals || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Crypto Predictions</h2>
          <p className="text-gray-400 text-sm mt-1">
            AI-powered predictions using real-time web data via OpenAI
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs text-gray-500">
              Updated: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 text-amber-400 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-sm text-amber-400 font-medium">
              {loading ? "Loading..." : "Refresh"}
            </span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">
              Live Scanning
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loadingStates.prices ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Crypto Accuracy"
              value={`${predictions?.accuracy?.overall || 76}%`}
              subtitle={`${predictions?.accuracy?.correct || 0}/${predictions?.accuracy?.totalPredictions || 0} correct`}
              color="amber"
              trend={3.2}
            />
            <StatsCard
              title="Active Signals"
              value={cryptoPredictions.length}
              subtitle="Predictions active"
              color="emerald"
            />
            <StatsCard
              title="BTC Price"
              value={prices?.btc ? formatPrice(prices.btc.price) : "--"}
              subtitle={
                prices?.btc
                  ? `${prices.btc.change24h > 0 ? "+" : ""}${prices.btc.change24h}% today`
                  : "Loading..."
              }
              color="amber"
              trend={prices?.btc?.change24h || 0}
            />
            <StatsCard
              title="ETH Price"
              value={prices?.eth ? formatPrice(prices.eth.price) : "--"}
              subtitle={
                prices?.eth
                  ? `${prices.eth.change24h > 0 ? "+" : ""}${prices.eth.change24h}% today`
                  : "Loading..."
              }
              color="blue"
              trend={prices?.eth?.change24h || 0}
            />
          </>
        )}
      </div>

      {/* Price Chart */}
      <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            BTC Price (24h)
          </h3>
          {prices?.btc?.marketCap && (
            <span className="text-xs text-gray-500">
              MCap: {prices.btc.marketCap} | Vol: {prices.btc.volume24h}
            </span>
          )}
        </div>
        <div className="h-64">
          {loadingStates.prices ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-400 text-sm">
                  Fetching real-time chart data...
                </span>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#242432" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a24",
                    border: "1px solid #2e2e40",
                    borderRadius: "12px",
                    color: "#e2e8f0",
                  }}
                  formatter={(value) => [formatPrice(value), "BTC"]}
                />
                <Area
                  type="monotone"
                  dataKey="btc"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#btcGrad)"
                  name="BTC"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              No chart data available
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Predictions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white">
            Active Crypto Predictions
          </h3>
          {loadingStates.predictions ? (
            <div className="space-y-4">
              <PredictionSkeleton />
              <PredictionSkeleton />
            </div>
          ) : cryptoPredictions.length > 0 ? (
            cryptoPredictions.map((p) => (
              <PredictionCard key={p.id} prediction={p} />
            ))
          ) : (
            <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] text-center">
              <p className="text-gray-400">
                No active predictions. Refresh to scan.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Whale Tracker */}
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Whale Activity
              </h3>
              {whales?.netFlow && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    whales.netFlow === "NET BUY"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {whales.netFlow}
                </span>
              )}
            </div>
            {loadingStates.whales ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl bg-[#111118] animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {whaleActivity.map((whale, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#111118] border border-[#242432]"
                  >
                    <div>
                      <p className="text-xs text-gray-500 font-mono">
                        {whale.wallet}
                      </p>
                      <p className="text-sm text-white font-medium mt-1">
                        {whale.amount}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          whale.action === "BUY"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {whale.action}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{whale.time}</p>
                    </div>
                  </div>
                ))}
                {whales?.summary && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    {whales.summary}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Signal Detection */}
          <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Signal Detection
              </h3>
              {signals?.overallSentiment && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    signals.overallSentiment === "BULLISH"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : signals.overallSentiment === "BEARISH"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {signals.overallSentiment}
                </span>
              )}
            </div>
            {loadingStates.signals ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-3 w-24 bg-[#2e2e40] rounded animate-pulse" />
                    <div className="h-3 w-20 bg-[#2e2e40] rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {signalData.map((signal, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">
                        {signal.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#2e2e40] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              signal.status === "bullish"
                                ? "bg-emerald-400"
                                : signal.status === "bearish"
                                ? "bg-red-400"
                                : "bg-amber-400"
                            }`}
                            style={{ width: `${signal.strength}%` }}
                          />
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            signal.status === "bullish"
                              ? "bg-emerald-400"
                              : signal.status === "bearish"
                              ? "bg-red-400"
                              : "bg-amber-400"
                          }`}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 ml-0">{signal.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="flex items-center justify-center gap-4 py-4 border-t border-[#2e2e40]">
        <span className="text-xs text-gray-600">
          Powered by OpenAI GPT-4.1 Responses API with Web Search
        </span>
        <span className="text-xs text-gray-700">|</span>
        <span className="text-xs text-gray-600">
          Cached in Firebase (15 min TTL)
        </span>
        {lastRefresh && (
          <>
            <span className="text-xs text-gray-700">|</span>
            <span className="text-xs text-gray-600">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// Loading skeleton for stats cards
function LoadingSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] animate-pulse">
      <div className="h-4 w-20 bg-[#2e2e40] rounded mb-3" />
      <div className="h-8 w-28 bg-[#2e2e40] rounded mb-2" />
      <div className="h-3 w-24 bg-[#2e2e40] rounded" />
    </div>
  );
}

// Loading skeleton for prediction cards
function PredictionSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2e2e40] animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-16 bg-[#2e2e40] rounded-full" />
          <div className="h-6 w-12 bg-[#2e2e40] rounded" />
        </div>
        <div className="h-10 w-16 bg-[#2e2e40] rounded-lg" />
      </div>
      <div className="h-4 w-48 bg-[#2e2e40] rounded mb-3" />
      <div className="h-3 w-36 bg-[#2e2e40] rounded mb-4" />
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-2 flex-1 bg-[#2e2e40] rounded-full" />
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-3 w-full bg-[#2e2e40] rounded" />
        ))}
      </div>
    </div>
  );
}
