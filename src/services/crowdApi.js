import { API_CONFIG } from '../config.js';
const required = ['roadSegmentId', 'name', 'flowLevel', 'flowScore', 'source', 'sourceCount', 'signals', 'factors', 'confidence', 'updatedAt', 'modelVersion'];
export function validateCrowdResponse(data) { return data?.ok === true && required.every(key => key in data) && Array.isArray(data.signals); }
export async function getCrowdData() {
  const response = await fetch(API_CONFIG.crowdUrl, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Crowd request failed (${response.status})`);
  const data = await response.json();
  if (!validateCrowdResponse(data)) throw new Error('Crowd response format is invalid');
  return Array.isArray(data.segments) ? data.segments : [data];
}
