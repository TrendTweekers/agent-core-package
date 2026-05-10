// Currency formatting via Intl.NumberFormat.
// Polish convention: "4 623 zł" (NBSP between groups, symbol after).
// Spanish: "1.200 €" (period thousands separator).
// Swedish: "15 000 kr" (space thousands separator).
//
// useGrouping: "always" forces a thousands separator even on 4-digit
// values like 4623, which keeps Polish/Swedish formatting consistent.

import type { Currency } from "./types.js";

// Sensible default locale per currency.
const DEFAULT_LOCALE: Record<Currency, string> = {
  PLN: "pl-PL",
  EUR: "es-ES",   // Spanish locale: "1.200 €"
  SEK: "sv-SE",   // Swedish locale: "15 000 kr"
  USD: "en-US",
  GBP: "en-GB",
};

export const formatMoney = (
  amount: number,
  currency: Currency,
  locale?: string
): string =>
  new Intl.NumberFormat(locale ?? DEFAULT_LOCALE[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    useGrouping: "always",
  }).format(amount);
