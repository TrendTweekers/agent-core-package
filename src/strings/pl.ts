// Polish strings — the canonical reference market.
// Native-speaker reviewed by Peter's wife + multiple polish-pass audits.

import type { AnomalyStrings } from "./types";

export const pl: AnomalyStrings = {
  cpaSpikeImpact: ({ deltaPct, prevCpa, currCpa }) =>
    `Koszt pozyskania wzrósł o ${deltaPct} w ostatnim tygodniu (z ${prevCpa} do ${currCpa} za konwersję).`,
  cpaSpikeAction:
    "Sprawdź zmęczenie kreacji, nakładanie się grup odbiorców i ostatnie zmiany w budżecie. Zweryfikuj też jakość ruchu (bot traffic, nowe placementy).",
  cpaSpikeRiskLabel: ({ amount }) =>
    `~${amount} tygodniowo, jeśli trend się utrzyma`,

  roasDropImpact: ({ deltaPct, prevRoas, currRoas }) =>
    `ROAS spadł o ${deltaPct} (z ${prevRoas}x do ${currRoas}x).`,
  roasDropAction:
    "Porównaj mix produktów w koszyku, ceny vs konkurencja i strukturę grup odbiorców. Sprawdź, czy do feedu nie weszły nowe produkty o niższej marży.",
  roasDropRiskLabel: ({ amount }) =>
    `~${amount} przychodu tygodniowo`,

  highSpendLowConvImpact: ({ spend, convRatePct }) =>
    `Wydatek ${spend} przy współczynniku konwersji ${convRatePct} — kampania nie dowozi rezultatów.`,
  highSpendLowConvAction:
    "Sprawdź dopasowanie oferty do intencji wyszukiwania/odbiorców, jakość strony docelowej i czy konwersja jest poprawnie liczona.",
  highSpendLowConvRiskLabel: ({ spend }) =>
    `~${spend} wydane w tygodniu przy bardzo niskiej konwersji`,

  creativeFatigueImpact: ({ deltaPct }) =>
    `CTR spadł o ${deltaPct} przy podobnym budżecie — sygnał zmęczenia kreacji lub odbiorców.`,
  creativeFatigueAction:
    "Wprowadź 2-3 nowe warianty kreacji, sprawdź częstotliwość (frequency) i rozważ rozszerzenie grup odbiorców o lookalike.",
  creativeFatigueRiskLabel: ({ spend }) =>
    `~${spend} tygodniowo na kreacjach z malejącym CTR`,

  conversionDropImpact: ({ deltaPct, prevConv, currConv }) =>
    `Konwersje spadły o ${deltaPct} (z ${prevConv} do ${currConv}) bez odpowiadającego spadku budżetu.`,
  conversionDropAction:
    "Zweryfikuj poprawność trackingu (piksel, GA4, Conversions API), dostępność strony i ostatnie deploye sklepu.",
  conversionDropRiskLabel: ({ lostConvs }) =>
    `${lostConvs} konwersji mniej tygodniowo vs poprzedni okres`,

  trackingRiskImpact: ({ note }) =>
    `Ryzyko trackingu: ${note}`,
  trackingRiskAction:
    "Zweryfikuj konfigurację Conversions API / GA4 / offline conversions zanim podejmiesz większe decyzje o budżecie.",
  trackingRiskLabel:
    "Realne wyniki mogą być wyższe lub niższe niż w panelu — wymaga weryfikacji.",

  lowScaleLabel: "Trudne do oszacowania (mała skala)",
  unestimableLabel: "Trudne do oszacowania",
};
