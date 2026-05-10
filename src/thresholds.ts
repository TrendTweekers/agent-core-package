// Anomaly detection thresholds.
// Defaults are tuned for the Polish demo scale. Markets with different
// budget scales should override `highSpend` (and any other) via the
// `thresholds` option to `detect()`.

import type { Thresholds, Currency } from "./types.js";

export const defaultThresholds: Thresholds = {
  cpaSpikePct: 0.30,           // CPA up >30% week-over-week
  roasDropPct: -0.25,          // ROAS down >25%
  conversionsDropPct: -0.30,   // Conversions down >30%
  highSpend: 3000,             // weekly spend in target currency unit
  lowConversionRatePct: 0.005, // <0.5% conversion rate
  fatigueCtrDropPct: -0.20,    // CTR down >20% with similar spend
};

// Per-market overrides. These are rough proxies — tune against real
// account data when you onboard the first paying agency in each market.
export const marketThresholds: Record<Currency, Partial<Thresholds>> = {
  PLN: {},                     // use defaults
  EUR: { highSpend: 750 },     // ~750 EUR ≈ 3000 PLN at recent rates
  SEK: { highSpend: 6000 },    // Swedish budgets typically larger absolute
  USD: { highSpend: 800 },
  GBP: { highSpend: 700 },
};
