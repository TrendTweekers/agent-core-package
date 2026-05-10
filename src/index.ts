// Public API for @trendtweekers/agent-core.
//
// Type-only re-exports for consumers that want to annotate their own code:
//   import type { Anomaly, Metrics } from "@trendtweekers/agent-core";
//
// Runtime exports for the engine:
//   import { detect, formatMoney, pl } from "@trendtweekers/agent-core";

export type {
  Currency,
  Severity,
  Confidence,
  AnomalyType,
  Metrics,
  DerivedMetrics,
  MetricsDelta,
  Anomaly,
  CampaignInput,
  Thresholds,
} from "./types.js";

export { derive, delta, sum } from "./metrics.js";
export { formatMoney } from "./currency.js";
export { formatPct, formatSignedPct } from "./format.js";
export { defaultThresholds, marketThresholds } from "./thresholds.js";
export { detect, trackingRiskAnomaly } from "./detector.js";
export type { DetectOptions } from "./detector.js";

// Pre-built locale strings — consumers pick the one for their market.
export type { AnomalyStrings } from "./strings/types.js";
export { pl } from "./strings/pl.js";
export { es } from "./strings/es.js";
export { sv } from "./strings/sv.js";
