// Swedish strings. First-cut translation pending native auditor review
// before launch (Swedish partner TBD).
//
// Conventions: "exkl. moms" framing handled at the offer/site level.
// "månadsavtal" preferred over "retainer" in customer copy, but anomaly
// strings don't reference it.

import type { AnomalyStrings } from "./types.js";

export const sv: AnomalyStrings = {
  cpaSpikeImpact: ({ deltaPct, prevCpa, currCpa }) =>
    `Kostnaden per förvärv har ökat med ${deltaPct} senaste veckan (från ${prevCpa} till ${currCpa} per konvertering).`,
  cpaSpikeAction:
    "Kontrollera kreativ trötthet, överlappande målgrupper och senaste budgetändringar. Verifiera också trafikkvaliteten (bot-trafik, nya placeringar).",
  cpaSpikeRiskLabel: ({ amount }) =>
    `~${amount} per vecka om trenden håller i sig`,

  roasDropImpact: ({ deltaPct, prevRoas, currRoas }) =>
    `ROAS har sjunkit med ${deltaPct} (från ${prevRoas}x till ${currRoas}x).`,
  roasDropAction:
    "Jämför produktmix i varukorgen, priser vs. konkurrens och målgruppsstruktur. Kontrollera om nya produkter med lägre marginal har lagts till i feeden.",
  roasDropRiskLabel: ({ amount }) =>
    `~${amount} i intäkter per vecka`,

  highSpendLowConvImpact: ({ spend, convRatePct }) =>
    `Kostnad ${spend} med konverteringsgrad ${convRatePct} — kampanjen levererar inte resultat.`,
  highSpendLowConvAction:
    "Kontrollera matchningen mellan erbjudande och sökintention/målgrupp, landningssidans kvalitet och om konverteringen mäts korrekt.",
  highSpendLowConvRiskLabel: ({ spend }) =>
    `~${spend} spenderade i veckan med mycket låg konvertering`,

  creativeFatigueImpact: ({ deltaPct }) =>
    `CTR har sjunkit med ${deltaPct} vid liknande budget — signal om kreativ trötthet eller målgruppströtthet.`,
  creativeFatigueAction:
    "Inför 2-3 nya kreativa varianter, kontrollera frekvens och överväg att utöka målgrupper med lookalike.",
  creativeFatigueRiskLabel: ({ spend }) =>
    `~${spend} per vecka på kreativ med sjunkande CTR`,

  conversionDropImpact: ({ deltaPct, prevConv, currConv }) =>
    `Konverteringar har sjunkit med ${deltaPct} (från ${prevConv} till ${currConv}) utan motsvarande budgetminskning.`,
  conversionDropAction:
    "Verifiera trackingen (pixel, GA4, Conversions API), webbplatsens tillgänglighet och senaste deployer av butiken.",
  conversionDropRiskLabel: ({ lostConvs }) =>
    `${lostConvs} färre konverteringar per vecka vs. föregående period`,

  trackingRiskImpact: ({ note }) =>
    `Trackingrisk: ${note}`,
  trackingRiskAction:
    "Verifiera konfigurationen av Conversions API / GA4 / offline conversions innan du fattar större budgetbeslut.",
  trackingRiskLabel:
    "Verkliga resultat kan vara högre eller lägre än i panelen — kräver verifiering.",

  lowScaleLabel: "Svårt att uppskatta (liten skala)",
  unestimableLabel: "Svårt att uppskatta",
};
