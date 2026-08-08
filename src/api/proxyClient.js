const BASE = '/api/bayern-data';

export async function getSquadWithStats(season) {
  const url = season ? `${BASE}?resource=squad&season=${season}` : `${BASE}?resource=squad`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch squad');
  return res.json();
}

export async function getPlayerById(id, season) {
  const url = season
    ? `${BASE}?resource=player&id=${id}&season=${season}`
    : `${BASE}?resource=player&id=${id}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch player');
  return res.json();
}

export async function getLiveMatch() {
  const res = await fetch(`${BASE}?resource=live`);
  if (!res.ok) throw new Error('Failed to fetch live match');
  return res.json();
}