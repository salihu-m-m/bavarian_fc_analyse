import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { getPlayerById } from '../api/proxyClient';

function StatBox({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-pitch-light p-4 text-center">
      <p className="font-mono text-2xl font-bold text-bayern-gold">{value ?? '-'}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-text-dim">{label}</p>
    </div>
  );
}

function PlayerProfilePage() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPlayerById(id)
      .then((data) => setPlayer(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-text-dim">Loading player…</div>;
  }

  if (error || !player) {
    return (
      <div className="p-8 text-center text-bayern-red">
        Error: {error || 'Player not found'}
      </div>
    );
  }

  const {
    name,
    photo,
    number,
    position,
    appearances,
    goals,
    assists,
    rating,
    minutes,
    yellowCards,
    redCards,
    passAccuracy,
    competitionGoals = [],
  } = player;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-dim hover:text-bayern-gold"
      >
        <ArrowLeft size={16} /> Back to squad
      </Link>

      <div className="mb-8 flex items-center gap-6">
        <img
          src={photo}
          alt={name}
          className="h-24 w-24 rounded-full border-2 border-bayern-gold object-cover"
        />
        <div className="text-left">
          <h1 className="font-display text-4xl text-text">{name}</h1>
          <p className="text-text-dim">
            #{number ?? '-'} · {position}
          </p>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox label="Appearances" value={appearances} />
        <StatBox label="Goals" value={goals} />
        <StatBox label="Assists" value={assists} />
        <StatBox label="Rating" value={rating} />
        <StatBox label="Minutes" value={minutes} />
        <StatBox label="Yellow Cards" value={yellowCards} />
        <StatBox label="Red Cards" value={redCards} />
        <StatBox label="Pass Accuracy" value={passAccuracy ? `${passAccuracy}%` : null} />
      </div>

      {competitionGoals.length > 0 && (
        <div>
          <h2 className="mb-3 font-display text-xl uppercase tracking-wide text-bayern-gold">
            Goal Contributions by Competition
          </h2>
          <div className="h-64 rounded-lg border border-border bg-pitch-light p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitionGoals}>
                <XAxis dataKey="competition" stroke="#9ca39f" fontSize={12} />
                <YAxis stroke="#9ca39f" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#131b18',
                    border: '1px solid #24302b',
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="goals" fill="#dc052d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assists" fill="#ffd700" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerProfilePage;
