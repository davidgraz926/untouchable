// UNTOUCHABLE - Core Prediction Engine Logic
// Pattern Recognition + Signal Convergence + Confidence Scoring

// Signal types for each prediction module
export const SIGNAL_TYPES = {
  CRYPTO: [
    "whale_accumulation",
    "social_surge",
    "exchange_outflow",
    "volume_spike",
    "correlation_break",
  ],
  STOCK: [
    "options_surge",
    "insider_buying",
    "analyst_upgrade",
    "sentiment_shift",
    "volume_anomaly",
  ],
  STARTUP: [
    "authentic_founder",
    "strong_retention",
    "customer_traction",
    "funding_velocity",
    "market_timing",
  ],
  POLITICAL: [
    "cabinet_signals",
    "legislative_calendar",
    "betting_markets",
    "polling_trends",
    "media_narrative",
  ],
  CASINO: [
    "dealer_expression",
    "hand_speed",
    "body_language",
    "historical_pattern",
    "table_atmosphere",
  ],
};

// Calculate confidence score from signals
export function calculateConfidence(signals, weights = null) {
  if (!signals || signals.length === 0) return 0;

  const defaultWeight = 1 / signals.length;
  let totalWeight = 0;
  let weightedSum = 0;

  signals.forEach((signal, idx) => {
    const weight = weights ? weights[idx] || defaultWeight : defaultWeight;
    weightedSum += signal.strength * weight;
    totalWeight += weight;
  });

  return Math.round((weightedSum / totalWeight) * 100);
}

// Check if enough signals have converged (need 4-5)
export function checkConvergence(signals) {
  const activeSignals = signals.filter((s) => s.active);
  return {
    converged: activeSignals.length >= 4,
    count: activeSignals.length,
    total: signals.length,
    ready: activeSignals.length >= 4,
  };
}

// Generate a prediction based on converged signals
export function generatePrediction(type, asset, signals) {
  const convergence = checkConvergence(signals);
  if (!convergence.ready) return null;

  const confidence = calculateConfidence(signals.filter((s) => s.active));

  if (confidence < 70) return null;

  return {
    id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    asset,
    confidence,
    signals: signals.filter((s) => s.active).map((s) => s.name),
    signalCount: convergence.count,
    totalSignals: convergence.total,
    timestamp: new Date().toISOString(),
    status: "active",
    outcome: null,
  };
}

// Color code confidence levels
export function getConfidenceColor(confidence) {
  if (confidence >= 80) return { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" };
  if (confidence >= 70) return { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30", glow: "shadow-amber-500/20" };
  return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", glow: "shadow-red-500/20" };
}

// Get prediction type label
export function getPredictionLabel(type) {
  const labels = {
    PUMP: "PUMP",
    DUMP: "DUMP",
    EARNINGS_BEAT: "EARNINGS BEAT",
    EARNINGS_MISS: "EARNINGS MISS",
    RATE_CUT: "RATE CUT",
    RATE_HIKE: "RATE HIKE",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    DEALER_BUST: "DEALER BUST",
    DEALER_WIN: "DEALER WIN",
    BULLISH: "BULLISH",
    BEARISH: "BEARISH",
  };
  return labels[type] || type;
}

// Performance metrics calculator
export function calculateMetrics(predictions) {
  if (!predictions || predictions.length === 0) {
    return { accuracy: 0, totalPredictions: 0, correct: 0, falsePositive: 0, falseNegative: 0 };
  }

  const resolved = predictions.filter((p) => p.outcome !== null);
  const correct = resolved.filter((p) => p.outcome === "correct");
  const incorrect = resolved.filter((p) => p.outcome === "incorrect");

  return {
    accuracy: resolved.length > 0 ? Math.round((correct.length / resolved.length) * 100) : 0,
    totalPredictions: predictions.length,
    resolved: resolved.length,
    correct: correct.length,
    incorrect: incorrect.length,
    pending: predictions.filter((p) => p.outcome === null).length,
    falsePositive: incorrect.length,
    falseNegative: 0,
  };
}
