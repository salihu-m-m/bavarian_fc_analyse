import { Link } from 'react-router-dom';

function PlayerCard({ player }) {
  const { id, name, photo, number, position, rating } = player;

  return (
    <Link
      to={`/player/${id}`}
      className="group flex items-center gap-4 rounded-lg border border-border bg-pitch-light p-4 transition hover:border-bayern-red"
    >
      <div className="relative">
        <img
          src={photo}
          alt={name}
          className="h-16 w-16 rounded-full border-2 border-border object-cover group-hover:border-bayern-gold"
        />
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-bayern-red font-mono text-xs font-bold text-white">
          {number ?? '-'}
        </span>
      </div>

      <div className="flex-1 text-left">
        <h3 className="font-display text-lg leading-tight text-text">{name}</h3>
        <p className="text-sm text-text-dim">{position}</p>
      </div>

      {rating && (
        <span className="rounded bg-bayern-gold-dim px-2 py-1 font-mono text-sm font-semibold text-pitch">
          {rating}
        </span>
      )}
    </Link>
  );
}

export default PlayerCard;
