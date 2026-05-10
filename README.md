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

## Install (git-direct, no registry)

This package is installed **directly from the GitHub repo** — no npm registry, no GitHub Packages, no auth tokens to manage (beyond your normal git credentials).

In a consumer repo's `package.json`:

```json
{
  "dependencies": {
    "@trendtweekers/agent-core": "github:TrendTweekers/agent-core-package"
  }
}
```

Or pin to a specific commit / tag for reproducible builds:

```json
{
  "dependencies": {
    "@trendtweekers/agent-core": "github:TrendTweekers/agent-core-package#v0.1.0"
  }
}
```

Then `npm install`. npm clones the repo, runs the `prepare` script (which compiles TypeScript → `dist/`), and the package is ready.

### How releases work

There is no `npm publish` step. Every push to `main` is effectively a release.

- **Consumers** pin to a commit SHA, branch, or git tag for predictable behavior
- Run `npm update @trendtweekers/agent-core` to pull the latest

For a "stable" release: tag the commit (`git tag v0.2.0 && git push --tags`), and have consumers reference `#v0.2.0`.

### Auth for private repos

If `TrendTweekers/agent-core-package` is **private**, the machine running `npm install` needs git access to the repo:

- **Local development** — your normal GitHub auth (gh CLI, GitHub Desktop, or Windows Credential Manager) handles it
- **Railway / CI** — Railway's GitHub integration handles same-account repos automatically. For other CI: configure a deploy key or PAT with `repo` scope as `GITHUB_TOKEN` env var

If you want to avoid the auth complexity entirely, make this repo **public**. The package contains no customer IP — only metric formulas and translation strings.

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

The three demo repos pin to a minor version range (or specific tag) so threshold tweaks reach them automatically but breaking changes don't.

## License

UNLICENSED — proprietary, internal to TrendTweekers.
