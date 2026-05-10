# @trendtweekers/agent-core

Pure-logic engine for AI weekly reporting + anomaly detection across multiple markets.

Powers the demo sites and (eventually) the operator + workspace tools for:

- **Agent Raportowy** — Polish market (PLN)
- **InformeAI** — Spanish market (EUR)
- **Rapportkollen** — Swedish market (SEK)

## What this package contains

- **Metrics** — `derive`, `delta`, `sum` for ad campaign data (CPA, ROAS, CTR, CPC, conversion rate, week-over-week deltas)
- **Currency formatting** — `formatMoney` with sensible per-locale defaults (PL, ES, SV, EN, GB)
- **Anomaly detection** — `detect` returns `Anomaly[]` for a single campaign vs. its previous-period comparison. Six anomaly types: CPA spike, ROAS drop, high spend with low conversions, creative fatigue, conversion drop, tracking risk.
- **Pre-built strings** — `pl`, `es`, `sv` translations for all anomaly impact / action / risk-label messages

## What this package does NOT contain

- HTTP server (Express, etc.)
- HTML rendering / templates
- PDF export
- Database / persistence
- File I/O (CSV parsing, JSON loading)
- Authentication
- API integrations (Google Ads, Meta, etc.)

Those live in the consumer apps. This is the shared brain.

## Install

Add to a consumer repo's `package.json`:

```json
{
  "dependencies": {
    "@trendtweekers/agent-core": "^0.1.0"
  }
}
```

The package is published to GitHub Packages registry. To authenticate, add to `.npmrc` in the consumer repo:

```
@trendtweekers:registry=https://npm.pkg.github.com
```

Then `npm install` (with a GitHub Personal Access Token that has `read:packages` scope set as `NODE_AUTH_TOKEN` env var or via `npm login --registry=https://npm.pkg.github.com`).

## Usage

```typescript
import {
  detect,
  trackingRiskAnomaly,
  defaultThresholds,
  marketThresholds,
  pl,
  es,
  sv,
} from "@trendtweekers/agent-core";

// Polish market
const polishAnomalies = detect(
  {
    campaignLabel: "Meta Ads / Remarketing — koszyk 7 dni",
    current: { spend: 4200, impressions: 95000, clicks: 1900, conversions: 38, revenue: 17000 },
    previous: { spend: 3900, impressions: 92000, clicks: 2100, conversions: 52, revenue: 19500 },
  },
  {
    currency: "PLN",
    locale: "pl-PL",
    strings: pl,
  }
);

// Spanish market — same engine, different strings + currency
const spanishAnomalies = detect(
  campaignInput,
  {
    currency: "EUR",
    locale: "es-ES",
    strings: es,
    thresholds: marketThresholds.EUR, // higher-spend threshold scaled to EUR
  }
);
```

## Architecture

The engine is **stateless** and **pure**. Same inputs always produce same outputs. No side effects, no I/O.

Translations are passed in via the `strings` option — the engine never imports a locale file directly. This keeps the package framework-free and makes it trivial to add a new market: just write a new `AnomalyStrings` object.

Money-at-risk amounts are returned both as a **localized string** (`estimatedMoneyAtRisk`) and a **raw number** (`moneyAtRisk`) in the target currency unit. Use the string for display, the number for sums and charts.

## Versioning

Semver. Breaking changes to public types or function signatures bump the major. Adding a new anomaly type or a new locale bumps the minor. Threshold tuning bumps the patch.

The three demo repos pin to a minor version range so threshold tweaks reach them automatically but breaking changes don't.

## License

UNLICENSED — proprietary, internal to TrendTweekers.
