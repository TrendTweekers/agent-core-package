// Pure metric calculations. No I/O, no side effects.
// All ratios returned as decimal numbers (0.0234 = 2.34%).

import type { Metrics, DerivedMetrics, MetricsDelta } from "./types";

const safeDiv = (numerator: number, denominator: number): number => {
  if (!denominator || denominator === 0) return 0;
  return numerator / denominator;
};

const pctChange = (curr: number, prev: number): number => {
  if (!prev || prev === 0) return 0;
  return (curr - prev) / prev;
};

export const derive = (m: Metrics): DerivedMetrics => ({
  ctr: safeDiv(m.clicks, m.impressions),
  cpc: safeDiv(m.spend, m.clicks),
  cpa: safeDiv(m.spend, m.conversions),
  roas: safeDiv(m.revenue, m.spend),
  conversionRate: safeDiv(m.conversions, m.clicks),
});

export const delta = (curr: Metrics, prev: Metrics): MetricsDelta => {
  const c = derive(curr);
  const p = derive(prev);
  return {
    spendChange: pctChange(curr.spend, prev.spend),
    revenueChange: pctChange(curr.revenue, prev.revenue),
    cpaChange: pctChange(c.cpa, p.cpa),
    roasChange: pctChange(c.roas, p.roas),
    ctrChange: pctChange(c.ctr, p.ctr),
    conversionsChange: pctChange(curr.conversions, prev.conversions),
  };
};

// Sum a list of metric snapshots into one aggregate snapshot.
export const sum = (snapshots: Metrics[]): Metrics =>
  snapshots.reduce(
    (acc, s) => ({
      spend: acc.spend + s.spend,
      impressions: acc.impressions + s.impressions,
      clicks: acc.clicks + s.clicks,
      conversions: acc.conversions + s.conversions,
      revenue: acc.revenue + s.revenue,
    }),
    { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );
