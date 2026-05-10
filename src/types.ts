// Shared type definitions — no runtime code, no imports.
// Consumers can import these for type-only annotations.

export type Currency = "PLN" | "EUR" | "SEK" | "USD" | "GBP";

export type Severity = "low" | "medium" | "high";
export type Confidence = "low" | "medium" | "high";

export type AnomalyType =
  | "CPA_SPIKE"
  | "ROAS_DROP"
  | "HIGH_SPEND_LOW_CONVERSIONS"
  | "CREATIVE_FATIGUE"
  | "TRACKING_RISK"
  | "CONVERSION_DROP";

export type Metrics = {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
};

export type DerivedMetrics = {
  ctr: number;            // clicks / impressions
  cpc: number;            // spend / clicks
  cpa: number;            // spend / conversions
  roas: number;           // revenue / spend
  conversionRate: number; // conversions / clicks
};

export type MetricsDelta = {
  spendChange: number;       // (curr - prev) / prev
  revenueChange: number;
  cpaChange: number;
  roasChange: number;
  ctrChange: number;
  conversionsChange: number;
};

export type Anomaly = {
  type: AnomalyType;
  severity: Severity;
  clientImpact: string;          // localized — what changed, in client-facing language
  suggestedAction: string;       // localized — what to check first; NEVER "we changed it"
  estimatedMoneyAtRisk: string;  // localized, qualified estimate (e.g. "~8 400 zł tygodniowo")
  moneyAtRisk: number;           // numeric companion in target currency unit; 0 if N/A
  affectedCampaign: string;      // human label, e.g. "Meta Ads / Remarketing — koszyk 7 dni"
  confidence: Confidence;
};

export type CampaignInput = {
  campaignLabel: string;
  current: Metrics;
  previous: Metrics;
  knownTrackingIssue?: boolean;  // raises CPA-related anomaly confidence concern
};

export type Thresholds = {
  cpaSpikePct: number;          // CPA up >X week-over-week
  roasDropPct: number;          // ROAS down >X (negative number)
  conversionsDropPct: number;   // Conversions down >X (negative number)
  highSpend: number;            // weekly spend threshold in target currency unit
  lowConversionRatePct: number; // <X% conversion rate
  fatigueCtrDropPct: number;    // CTR down >X with similar spend (negative number)
};
