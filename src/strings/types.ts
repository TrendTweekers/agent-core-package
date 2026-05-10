// Each market provides one of these — a translated set of strings used
// by the detector to build localized clientImpact / suggestedAction /
// estimatedMoneyAtRisk messages.
//
// Functions take vars (already-formatted strings or raw numbers).
// Static strings have no vars.

export type AnomalyStrings = {
  // CPA spike
  cpaSpikeImpact: (vars: {
    deltaPct: string;
    prevCpa: string;
    currCpa: string;
  }) => string;
  cpaSpikeAction: string;
  cpaSpikeRiskLabel: (vars: { amount: string }) => string;

  // ROAS drop
  roasDropImpact: (vars: {
    deltaPct: string;
    prevRoas: string;
    currRoas: string;
  }) => string;
  roasDropAction: string;
  roasDropRiskLabel: (vars: { amount: string }) => string;

  // High spend, low conversions
  highSpendLowConvImpact: (vars: {
    spend: string;
    convRatePct: string;
  }) => string;
  highSpendLowConvAction: string;
  highSpendLowConvRiskLabel: (vars: { spend: string }) => string;

  // Creative fatigue
  creativeFatigueImpact: (vars: { deltaPct: string }) => string;
  creativeFatigueAction: string;
  creativeFatigueRiskLabel: (vars: { spend: string }) => string;

  // Conversion drop
  conversionDropImpact: (vars: {
    deltaPct: string;
    prevConv: number;
    currConv: number;
  }) => string;
  conversionDropAction: string;
  conversionDropRiskLabel: (vars: { lostConvs: number }) => string;

  // Tracking risk
  trackingRiskImpact: (vars: { note: string }) => string;
  trackingRiskAction: string;
  trackingRiskLabel: string;

  // Generic risk-estimate fallbacks
  lowScaleLabel: string;       // shown when amount-at-risk is too small to estimate
  unestimableLabel: string;    // generic fallback
};
