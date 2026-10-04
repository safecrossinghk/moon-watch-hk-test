export const DISTANCE_WEIGHTS = [
  { maxMeters: 100, weight: 1 }, { maxMeters: 200, weight: 0.75 },
  { maxMeters: 300, weight: 0.5 }, { maxMeters: 500, weight: 0.25 }
];
export const PLACE_TYPE_WEIGHTS = { transport: 1.2, station: 1.2, shopping: 1.1, mall: 1.1, restaurant: 1, cafe: 0.9, office: 0.8, other: 0.7 };
export const FLOW_THRESHOLDS = { low: 30, medium: 60 };
