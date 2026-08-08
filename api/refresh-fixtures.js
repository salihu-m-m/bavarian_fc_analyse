import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TEAM_ID = 157;
const BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY;

export default async function handler(req, res) {
  try {
    const response = await fetch(`${BASE_URL}/fixtures?team=${TEAM_ID}&next=1`, {
      headers: { 'x-apisports-key': API_KEY },
    });
    const json = await response.json();
    const next = json.response?.[0];

    if (!next) {
      return res.status(200).json({ status: 'no_upcoming_fixture' });
    }

    const kickoff = new Date(next.fixture.date).getTime();
    const windowEnd = kickoff + 2.5 * 60 * 60 * 1000; // kickoff + 2.5h

    await redis.set('fixtures:next', { kickoff, windowEnd }, { ex: 60 * 60 * 24 });

    return res.status(200).json({ status: 'ok', kickoff, windowEnd });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Refresh failed', detail: err.message });
  }
}