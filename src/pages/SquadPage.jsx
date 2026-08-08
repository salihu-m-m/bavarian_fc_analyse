import { useEffect, useState } from 'react';
import { getSquadWithStats } from '../api/proxyClient';
import PlayerCard from '../components/PlayerCard';

const POSITION_ORDER = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];

function groupByPosition(players) {
  const groups = {};
  for (const p of players) {
    const pos = p.position || 'Unknown';
    if (!groups[pos]) groups[pos] = [];
    groups[pos].push(p);
  }
  return groups;
}

function SquadPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSquadWithStats()
      .then((data) => setPlayers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-text-dim">Loading squad…</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-bayern-red">Error: {error}</div>;
  }

  const grouped = groupByPosition(players);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 font-display text-4xl text-text">FC Bayern Squad</h1>

      {POSITION_ORDER.map((position) =>
        grouped[position]?.length ? (
          <section key={position} className="mb-8">
            <h2 className="mb-3 font-display text-xl uppercase tracking-wide text-bayern-gold">
              {position}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {grouped[position].map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}

export default SquadPage;
