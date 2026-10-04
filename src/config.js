export const LSK001 = {
  id: 'LSK001',
  name: 'LSK001｜荔枝角道東行／長荔街一帶',
  // TODO_LSK001_COORDINATES: verify before treating this display point as surveyed.
  lat: 22.337,
  lng: 114.145,
  coordinateStatus: 'TODO_LSK001_COORDINATES'
};

export const API_CONFIG = {
  crowdUrl: globalThis.VITE_CROWD_API_URL || './api/crowd',
  countdownUrl: 'https://lsk001-api.ctakwah.workers.dev/api/signal-countdown?road_id=LSK001',
  crowdRefreshMs: 60_000,
  staleAfterSeconds: 15 * 60
};

export const CROWD_SEARCH_QUERIES = [
  'restaurants near LSK001 Lai Chi Kok Hong Kong',
  'cafes near LSK001 Lai Chi Kok Hong Kong',
  'shopping near LSK001 Lai Chi Kok Hong Kong',
  'MTR near LSK001 Lai Chi Kok Hong Kong'
];
