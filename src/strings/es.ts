// Spanish strings. First-cut translation pending native auditor review
// before launch (Peter's Spanish friend will polish).
//
// Conventions: "+ IVA" framing handled at the offer/site level, not in
// these strings. "fee mensual" preferred over "retainer" in customer
// copy, but anomaly strings don't reference it.

import type { AnomalyStrings } from "./types.js";

export const es: AnomalyStrings = {
  cpaSpikeImpact: ({ deltaPct, prevCpa, currCpa }) =>
    `El coste de adquisición ha subido un ${deltaPct} en la última semana (de ${prevCpa} a ${currCpa} por conversión).`,
  cpaSpikeAction:
    "Revisa la fatiga creativa, el solapamiento de audiencias y los cambios recientes en presupuesto. Verifica también la calidad del tráfico (bots, nuevos placements).",
  cpaSpikeRiskLabel: ({ amount }) =>
    `~${amount} a la semana si la tendencia continúa`,

  roasDropImpact: ({ deltaPct, prevRoas, currRoas }) =>
    `El ROAS ha caído un ${deltaPct} (de ${prevRoas}x a ${currRoas}x).`,
  roasDropAction:
    "Compara el mix de productos en el carrito, precios vs. competencia y estructura de audiencias. Revisa si han entrado productos con menor margen al feed.",
  roasDropRiskLabel: ({ amount }) =>
    `~${amount} de ingresos a la semana`,

  highSpendLowConvImpact: ({ spend, convRatePct }) =>
    `Gasto de ${spend} con tasa de conversión del ${convRatePct} — la campaña no está rindiendo.`,
  highSpendLowConvAction:
    "Revisa el match entre oferta e intención de búsqueda/audiencia, la calidad de la landing page y si la conversión se está midiendo correctamente.",
  highSpendLowConvRiskLabel: ({ spend }) =>
    `~${spend} gastados esta semana con conversión muy baja`,

  creativeFatigueImpact: ({ deltaPct }) =>
    `El CTR ha caído un ${deltaPct} con presupuesto similar — señal de fatiga creativa o de audiencia.`,
  creativeFatigueAction:
    "Introduce 2-3 variantes nuevas de creatividad, revisa la frecuencia y considera ampliar audiencias con lookalike.",
  creativeFatigueRiskLabel: ({ spend }) =>
    `~${spend} a la semana en creatividades con CTR a la baja`,

  conversionDropImpact: ({ deltaPct, prevConv, currConv }) =>
    `Las conversiones han caído un ${deltaPct} (de ${prevConv} a ${currConv}) sin caída de presupuesto correspondiente.`,
  conversionDropAction:
    "Verifica el tracking (píxel, GA4, Conversions API), la disponibilidad de la web y los últimos deploys de la tienda.",
  conversionDropRiskLabel: ({ lostConvs }) =>
    `${lostConvs} conversiones menos a la semana vs. período anterior`,

  trackingRiskImpact: ({ note }) =>
    `Riesgo de tracking: ${note}`,
  trackingRiskAction:
    "Verifica la configuración de Conversions API / GA4 / offline conversions antes de tomar decisiones grandes de presupuesto.",
  trackingRiskLabel:
    "Los resultados reales pueden ser superiores o inferiores a los del panel — requiere verificación.",

  lowScaleLabel: "Difícil de estimar (escala pequeña)",
  unestimableLabel: "Difícil de estimar",
};
