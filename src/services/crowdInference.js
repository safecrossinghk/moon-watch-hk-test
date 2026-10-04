import { DISTANCE_WEIGHTS, PLACE_TYPE_WEIGHTS, FLOW_THRESHOLDS } from '../config/crowdModel.js';
export function distanceWeight(distanceMeters) { return DISTANCE_WEIGHTS.find(rule => distanceMeters <= rule.maxMeters)?.weight ?? 0; }
export function typeWeight(placeType) { return PLACE_TYPE_WEIGHTS[placeType] ?? PLACE_TYPE_WEIGHTS.other; }
export function levelForScore(score) { if (score === null) return 'unknown'; return score <= FLOW_THRESHOLDS.low ? 'low' : score <= FLOW_THRESHOLDS.medium ? 'medium' : 'high'; }
export function inferCrowd(signals = []) {
  const diagnostics = signals.map(signal => ({ ...signal, distanceWeight: distanceWeight(signal.distanceMeters), typeWeight: typeWeight(signal.placeType) }))
    .filter(signal => Number.isFinite(signal.livePercentage) && signal.distanceWeight > 0)
    .map(signal => ({ ...signal, finalWeight: signal.distanceWeight * signal.typeWeight }));
  const weightTotal = diagnostics.reduce((sum, signal) => sum + signal.finalWeight, 0);
  if (!weightTotal) return { flowLevel: 'unknown', flowScore: null, confidence: 0, signals: [], diagnostics, excludedCount: signals.length };
  const flowScore = Math.max(0, Math.min(100, Math.round(diagnostics.reduce((sum, signal) => sum + signal.livePercentage * signal.finalWeight, 0) / weightTotal)));
  const proximity = diagnostics.reduce((sum, signal) => sum + signal.distanceWeight, 0) / diagnostics.length;
  const confidence = Math.min(0.85, Math.round((Math.min(diagnostics.length, 4) / 4 * 0.65 + proximity * 0.2) * 100) / 100);
  return { flowLevel: levelForScore(flowScore), flowScore, confidence, signals: diagnostics, diagnostics, excludedCount: signals.length - diagnostics.length };
}
