// Anomaly detection — pure logic, no I/O.
// Takes a single campaign's current + previous metrics, returns Anomaly[].
// Localization is injected via the `strings` option; currency formatting
// via `currency` (and optional `locale`); thresholds overridable via
// `thresholds` (partial — defaults fill the rest).

import type {
  AnomalyType,
  Anomaly,
  CampaignInput,
  Currency,
  Metrics,
  Severity,
  Thresholds,
} from "./types";
import { derive, delta } from "./metrics";
import { formatMoney } from "./currency";
import { formatSignedPct, formatPct } from "./format";
import { defaultThresholds } from "./thresholds";
import type { AnomalyStrings } from "./strings/types";

export type DetectOptions = {
  currency: Currency;
  locale?: string;
  strings: AnomalyStrings;
  thresholds?: Partial<Thresholds>;
};

type RiskEstimate = { label: string; amount: number };

const estimateAtRisk = (
  curr: Metrics,
  prev: Metrics,
  type: AnomalyType,
  opts: DetectOptions
): RiskEstimate => {
  const c = derive(curr);
  const p = derive(prev);
  const fmt = (n: number): string => formatMoney(n, opts.currency, opts.locale);
  const s = opts.strings;

  if (type === "CPA_SPIKE" && p.cpa > 0 && curr.conversions > 0) {
    const extraPerConv = c.cpa - p.cpa;
    const wasted = Math.max(0, extraPerConv * curr.conversions);
    if (wasted >= 500)
      return { label: s.cpaSpikeRiskLabel({ amount: fmt(wasted) }), amount: wasted };
    return { label: s.lowScaleLabel, amount: wasted };
  }
  if (type === "ROAS_DROP" && curr.spend > 0) {
    const expectedRevenue = curr.spend * p.roas;
    const lost = Math.max(0, expectedRevenue - curr.revenue);
    if (lost >= 500)
      return { label: s.roasDropRiskLabel({ amount: fmt(lost) }), amount: lost };
    return { label: s.lowScaleLabel, amount: lost };
  }
  if (type === "HIGH_SPEND_LOW_CONVERSIONS") {
    return {
      label: s.highSpendLowConvRiskLabel({ spend: fmt(curr.spend) }),
      amount: curr.spend,
    };
  }
  if (type === "CREATIVE_FATIGUE") {
    return {
      label: s.creativeFatigueRiskLabel({ spend: fmt(curr.spend) }),
      amount: curr.spend,
    };
  }
  if (type === "CONVERSION_DROP") {
    const lostConvs = Math.max(0, prev.conversions - curr.conversions);
    return { label: s.conversionDropRiskLabel({ lostConvs }), amount: 0 };
  }
  if (type === "TRACKING_RISK") {
    return { label: s.trackingRiskLabel, amount: 0 };
  }
  if (type === "BUDGET_PACING_DRIFT") {
    const extraBurn = Math.max(0, curr.spend - prev.spend * 1.1);
    return {
      label: s.budgetPacingRiskLabel({ extraBurn: fmt(extraBurn) }),
      amount: extraBurn,
    };
  }
  if (type === "AUDIENCE_OVERLAP") {
    return { label: s.audienceOverlapLabel, amount: 0 };
  }
  if (type === "DAY_PARTING_DROP") {
    return { label: s.dayPartingDropLabel, amount: 0 };
  }
  return { label: s.unestimableLabel, amount: 0 };
};

const severityFor = (type: AnomalyType, magnitude: number): Severity => {
  const a = Math.abs(magnitude);
  if (type === "TRACKING_RISK") return "medium";
  if (a >= 0.5) return "high";
  if (a >= 0.3) return "medium";
  return "low";
};

export const detect = (c: CampaignInput, opts: DetectOptions): Anomaly[] => {
  const t: Thresholds = { ...defaultThresholds, ...opts.thresholds };
  const out: Anomaly[] = [];
  const d = derive(c.current);
  const dl = delta(c.current, c.previous);
  const fmt = (n: number): string => formatMoney(n, opts.currency, opts.locale);
  const s = opts.strings;

  const push = (
    a: Omit<Anomaly, "estimatedMoneyAtRisk" | "moneyAtRisk">,
    type: AnomalyType
  ): void => {
    const r = estimateAtRisk(c.current, c.previous, type, opts);
    out.push({ ...a, estimatedMoneyAtRisk: r.label, moneyAtRisk: r.amount });
  };

  // 1) CPA spike — only if the campaign actually had conversions in both periods.
  if (
    c.previous.conversions > 0 &&
    c.current.conversions > 0 &&
    dl.cpaChange > t.cpaSpikePct
  ) {
    push(
      {
        type: "CPA_SPIKE",
        severity: severityFor("CPA_SPIKE", dl.cpaChange),
        clientImpact: s.cpaSpikeImpact({
          deltaPct: formatSignedPct(dl.cpaChange),
          prevCpa: fmt(derive(c.previous).cpa),
          currCpa: fmt(d.cpa),
        }),
        suggestedAction: s.cpaSpikeAction,
        affectedCampaign: c.campaignLabel,
        confidence: c.knownTrackingIssue ? "low" : "medium",
      },
      "CPA_SPIKE"
    );
  }

  // 1b) Budget pacing drift — spend up >40% WoW while conversions don't
  // keep up (either nearly flat or negative). Signals the campaign is
  // burning faster than the planned monthly pace without proportional
  // return; usually a bid-strategy change, budget bump, or stale cap.
  if (
    dl.spendChange > 0.4 &&
    (dl.conversionsChange < 0.1 || dl.conversionsChange < 0)
  ) {
    push(
      {
        type: "BUDGET_PACING_DRIFT",
        severity: severityFor("BUDGET_PACING_DRIFT", dl.spendChange),
        clientImpact: s.budgetPacingImpact({
          spendDeltaPct: formatSignedPct(dl.spendChange),
          conversionsDeltaPct: formatSignedPct(dl.conversionsChange),
        }),
        suggestedAction: s.budgetPacingAction,
        affectedCampaign: c.campaignLabel,
        confidence: c.knownTrackingIssue ? "low" : "medium",
      },
      "BUDGET_PACING_DRIFT"
    );
  }

  // 2) ROAS drop — only meaningful when there is revenue (not lead-gen).
  if (c.previous.revenue > 0 && dl.roasChange < t.roasDropPct) {
    push(
      {
        type: "ROAS_DROP",
        severity: severityFor("ROAS_DROP", dl.roasChange),
        clientImpact: s.roasDropImpact({
          deltaPct: formatSignedPct(dl.roasChange),
          prevRoas: derive(c.previous).roas.toFixed(2),
          currRoas: d.roas.toFixed(2),
        }),
        suggestedAction: s.roasDropAction,
        affectedCampaign: c.campaignLabel,
        confidence: "medium",
      },
      "ROAS_DROP"
    );
  }

  // 3) High spend, low conversions
  if (c.current.spend >= t.highSpend && d.conversionRate < t.lowConversionRatePct) {
    push(
      {
        type: "HIGH_SPEND_LOW_CONVERSIONS",
        severity: "high",
        clientImpact: s.highSpendLowConvImpact({
          spend: fmt(c.current.spend),
          convRatePct: formatPct(d.conversionRate, 2),
        }),
        suggestedAction: s.highSpendLowConvAction,
        affectedCampaign: c.campaignLabel,
        confidence: "high",
      },
      "HIGH_SPEND_LOW_CONVERSIONS"
    );
  }

  // 4) Creative fatigue: spend up or stable, CTR down meaningfully.
  if (dl.ctrChange < t.fatigueCtrDropPct && dl.spendChange > -0.1) {
    push(
      {
        type: "CREATIVE_FATIGUE",
        severity: severityFor("CREATIVE_FATIGUE", dl.ctrChange),
        clientImpact: s.creativeFatigueImpact({
          deltaPct: formatSignedPct(dl.ctrChange),
        }),
        suggestedAction: s.creativeFatigueAction,
        affectedCampaign: c.campaignLabel,
        confidence: "medium",
      },
      "CREATIVE_FATIGUE"
    );
  }

  // 5) Conversion drop without obvious spend cut
  if (
    c.previous.conversions >= 10 &&
    dl.conversionsChange < t.conversionsDropPct &&
    dl.spendChange > -0.15
  ) {
    push(
      {
        type: "CONVERSION_DROP",
        severity: severityFor("CONVERSION_DROP", dl.conversionsChange),
        clientImpact: s.conversionDropImpact({
          deltaPct: formatSignedPct(dl.conversionsChange),
          prevConv: c.previous.conversions,
          currConv: c.current.conversions,
        }),
        suggestedAction: s.conversionDropAction,
        affectedCampaign: c.campaignLabel,
        confidence: c.knownTrackingIssue ? "low" : "medium",
      },
      "CONVERSION_DROP"
    );
  }

  return out;
};

// Tracking-risk anomaly — emitted from client-level data flags, not
// from per-campaign metrics. Returned as a standalone Anomaly so the
// caller can mix it into the per-client anomaly list.
export const trackingRiskAnomaly = (
  campaignLabel: string,
  note: string,
  opts: DetectOptions
): Anomaly => {
  const s = opts.strings;
  return {
    type: "TRACKING_RISK",
    severity: "medium",
    clientImpact: s.trackingRiskImpact({ note }),
    suggestedAction: s.trackingRiskAction,
    estimatedMoneyAtRisk: s.trackingRiskLabel,
    moneyAtRisk: 0,
    affectedCampaign: campaignLabel,
    confidence: "medium",
  };
};

// Audience-overlap anomaly — declared by the operator/auditor based on
// platform overlap reports, not derivable from spend/conversions alone.
// Mirrors trackingRiskAnomaly: caller passes a free-text note describing
// the overlapping audiences.
export const audienceOverlapAnomaly = (
  campaignLabel: string,
  note: string,
  opts: DetectOptions
): Anomaly => {
  const s = opts.strings;
  return {
    type: "AUDIENCE_OVERLAP",
    severity: "medium",
    clientImpact: s.audienceOverlapImpact({ note }),
    suggestedAction: s.audienceOverlapAction,
    estimatedMoneyAtRisk: s.audienceOverlapLabel,
    moneyAtRisk: 0,
    affectedCampaign: campaignLabel,
    confidence: "medium",
  };
};

// Day-parting drop anomaly — declared from hourly/day-of-week breakdown
// inspection. Like AUDIENCE_OVERLAP, this isn't derivable from the
// weekly aggregate metrics the detector sees.
export const dayPartingDropAnomaly = (
  campaignLabel: string,
  note: string,
  opts: DetectOptions
): Anomaly => {
  const s = opts.strings;
  return {
    type: "DAY_PARTING_DROP",
    severity: "medium",
    clientImpact: s.dayPartingDropImpact({ note }),
    suggestedAction: s.dayPartingDropAction,
    estimatedMoneyAtRisk: s.dayPartingDropLabel,
    moneyAtRisk: 0,
    affectedCampaign: campaignLabel,
    confidence: "medium",
  };
};
