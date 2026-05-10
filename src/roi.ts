// ROI calculator — pure logic for "what would this pilot/retainer save you".
//
// Used by the demo sites (server-side render of default values) and by
// the operator CLI (eventual --roi flag for sales conversations).
//
// The math is deliberately conservative:
// - 75% time reduction on weekly reporting (from manual to AI-assisted-with-review)
// - 5% of ad spend assumed catchable as anomalies (industry baseline; many
//   agencies see higher recoveries, but 5% is a defensible floor)
// - 4.33 weeks/month average

import type { Currency } from "./types";

export type RoiInput = {
  numClients: number;                    // 1-50
  monthlyAdSpendPerClient: number;       // in target currency, total ad spend per client per month
  hoursPerWeekReportingPerClient: number;// 0.25-10
  hourlyRate: number;                    // senior specialist cost per hour, in target currency
  pilotPrice: number;                    // one-time pilot fee, in target currency
  monthlyRetainerPrice: number;          // recurring retainer fee per month, in target currency
};

export type RoiOutput = {
  hoursSavedPerWeek: number;
  hoursSavedPerMonth: number;
  costSavedPerMonth: number;             // hours saved × hourly rate
  estimatedAnomalyCatchPerMonth: number; // 5% of total ad spend recovered
  totalSavingsPerMonth: number;          // cost saved + anomaly catch
  pilotPaybackWeeks: number;             // weeks until savings = pilot fee
  retainerRoiMultiple: number;           // monthly savings / monthly retainer
};

// Tunable assumptions. Exported so consumers can override or display.
export const ROI_ASSUMPTIONS = {
  TIME_REDUCTION_FACTOR: 0.75,  // AI handles 75%, human reviews 25%
  ANOMALY_CATCH_RATE: 0.05,     // 5% of ad spend conservatively recoverable
  WEEKS_PER_MONTH: 4.33,        // calendar average
} as const;

export function computeRoi(input: RoiInput): RoiOutput {
  const { numClients, monthlyAdSpendPerClient, hoursPerWeekReportingPerClient, hourlyRate, pilotPrice, monthlyRetainerPrice } = input;
  const a = ROI_ASSUMPTIONS;

  const hoursSavedPerWeek = numClients * hoursPerWeekReportingPerClient * a.TIME_REDUCTION_FACTOR;
  const hoursSavedPerMonth = hoursSavedPerWeek * a.WEEKS_PER_MONTH;
  const costSavedPerMonth = hoursSavedPerMonth * hourlyRate;

  const totalMonthlyAdSpend = numClients * monthlyAdSpendPerClient;
  const estimatedAnomalyCatchPerMonth = totalMonthlyAdSpend * a.ANOMALY_CATCH_RATE;

  const totalSavingsPerMonth = costSavedPerMonth + estimatedAnomalyCatchPerMonth;

  const weeklySavings = totalSavingsPerMonth / a.WEEKS_PER_MONTH;
  const pilotPaybackWeeks = weeklySavings > 0 ? pilotPrice / weeklySavings : Infinity;

  const retainerRoiMultiple = monthlyRetainerPrice > 0 ? totalSavingsPerMonth / monthlyRetainerPrice : 0;

  return {
    hoursSavedPerWeek,
    hoursSavedPerMonth,
    costSavedPerMonth,
    estimatedAnomalyCatchPerMonth,
    totalSavingsPerMonth,
    pilotPaybackWeeks,
    retainerRoiMultiple,
  };
}

// Sensible defaults per market for the calculator's initial state.
// Numbers tuned to feel "this is a typical mid-sized agency" — the
// prospect adjusts to their reality and watches the math update live.
export const ROI_DEFAULTS: Record<Currency, Pick<RoiInput, "monthlyAdSpendPerClient" | "hoursPerWeekReportingPerClient" | "hourlyRate" | "numClients">> = {
  PLN: {
    numClients: 5,
    monthlyAdSpendPerClient: 25000,
    hoursPerWeekReportingPerClient: 1.5,
    hourlyRate: 250,
  },
  EUR: {
    numClients: 5,
    monthlyAdSpendPerClient: 6000,
    hoursPerWeekReportingPerClient: 1.5,
    hourlyRate: 50,
  },
  SEK: {
    numClients: 5,
    monthlyAdSpendPerClient: 60000,
    hoursPerWeekReportingPerClient: 1.5,
    hourlyRate: 700,
  },
  USD: {
    numClients: 5,
    monthlyAdSpendPerClient: 7000,
    hoursPerWeekReportingPerClient: 1.5,
    hourlyRate: 60,
  },
  GBP: {
    numClients: 5,
    monthlyAdSpendPerClient: 5500,
    hoursPerWeekReportingPerClient: 1.5,
    hourlyRate: 55,
  },
};
