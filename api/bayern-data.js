import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TEAM_ID = 157;
const BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY;

async function callApiFootball(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'x-apisports-key': API_KEY },
  });
  if (!res.ok) throw new Error(`API-Football error: ${res.status}`);
  const json = await res.json();
  return json.response;
}

export default async function handler(req, res) {
  const { resource, id, season } = req.query;
  const currentSeason = season || process.env.VITE_SEASON || new Date().getFullYear();

  try {
    if (resource === 'squad') {
      const cacheKey = `squad:${TEAM_ID}:${currentSeason}`;
      const cached = await redis.get(cacheKey);
      if (cached) return res.status(200).json(cached);

      const data = await callApiFootball(`/players?team=${TEAM_ID}&season=${currentSeason}`);
      await redis.set(cacheKey, data, { ex: 60 * 60 * 12 }); // 12h
      return res.status(200).json(data);
    }

    if (resource === 'player') {
      if (!id) return res.status(400).json({ error: 'Missing player id' });
      const cacheKey = `player:${id}:${currentSeason}`;
      const cached = await redis.get(cacheKey);
      if (cached) return res.status(200).json(cached);

      const data = await callApiFootball(`/players?id=${id}&season=${currentSeason}`);
      await redis.set(cacheKey, data, { ex: 60 * 60 * 12 }); // 12h
      return res.status(200).json(data);
    }

    if (resource === 'live') {
      const window = await redis.get('fixtures:next');
      const now = Date.now();
      const inWindow = window && now >= window.kickoff && now <= window.windowEnd;

      const cacheKey = `live:${TEAM_ID}`;
      const cached = await redis.get(cacheKey);

      if (!inWindow) {
        return res.status(200).json(cached || { status: 'no_live_match' });
      }

      if (cached && now - cached.fetchedAt < 60 * 1000) {
        return res.status(200).json(cached);
      }

      const data = await callApiFootball(`/fixtures?live=all&team=${TEAM_ID}`);
      const payload = { ...data, fetchedAt: now };
      await redis.set(cacheKey, payload, { ex: 60 * 5 }); // 5 min safety TTL
      return res.status(200).json(payload);
    }

    return res.status(400).json({ error: 'Unknown resource' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
}