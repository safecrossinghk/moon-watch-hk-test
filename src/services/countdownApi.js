import { API_CONFIG } from '../config.js';
let demoEndTime = Date.now() + 18_000;
let demoState = 'red';
function demoCountdown() { const now = Date.now(); if (now >= demoEndTime) { demoState = demoState === 'red' ? 'green' : 'red'; demoEndTime = now + (demoState === 'red' ? 18_000 : 25_000); } return { state: demoState, endTime: demoEndTime, status: 'development-mock', source: 'DEVELOPMENT MOCK' }; }
function normalize(data) { const state = data.state || data.signal || data.current_state; const endTime = Date.parse(data.endTime || data.end_time || data.endsAt || ''); if (!['red', 'green'].includes(state) || !Number.isFinite(endTime)) throw new Error('Countdown response format is invalid'); return { state, endTime, status: 'live', source: 'LSK001 Countdown API' }; }
export async function getCountdown() { try { const response = await fetch(API_CONFIG.countdownUrl, { cache: 'no-store' }); if (!response.ok) throw new Error(`Countdown request failed (${response.status})`); return normalize(await response.json()); } catch { return demoCountdown(); } }
export function secondsRemaining(endTime) { return Math.max(1, Math.ceil((endTime - Date.now()) / 1000)); }
