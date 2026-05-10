// Locale-agnostic percentage formatters.
// Decimal separator follows the host locale (period for "en-*", comma for
// "pl-*" / "es-*" / "sv-*"). For now we use the JS default (period); if
// localized decimal commas matter for a market, consumers can wrap these
// or reach for Intl.NumberFormat directly.

export const formatPct = (n: number, digits = 1): string =>
  `${(n * 100).toFixed(digits)}%`;

export const formatSignedPct = (n: number, digits = 1): string => {
  const sign = n > 0 ? "+" : "";
  return `${sign}${(n * 100).toFixed(digits)}%`;
};
