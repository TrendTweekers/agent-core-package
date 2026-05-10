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
} from "./types";

export { derive, delta, sum } from "./metrics";
export { formatMoney } from "./currency";
export { formatPct, formatSignedPct } from "./format";
export { defaultThresholds, marketThresholds } from "./thresholds";
export {
  detect,
  trackingRiskAnomaly,
  audienceOverlapAnomaly,
  dayPartingDropAnomaly,
} from "./detector";
export type { DetectOptions } from "./detector";

// Pre-built locale strings — consumers pick the one for their market.
export type { AnomalyStrings } from "./strings/types";
export { pl } from "./strings/pl";
export { es } from "./strings/es";
export { sv } from "./strings/sv";

// ROI calculator — pure savings math for the "what would this save us"
// widget on demo sites and sales conversations.
export type { RoiInput, RoiOutput } from "./roi";
export { computeRoi, ROI_ASSUMPTIONS, ROI_DEFAULTS } from "./roi";
