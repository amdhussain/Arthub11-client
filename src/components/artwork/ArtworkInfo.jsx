'use client';

import PropTypes from 'prop-types';

export default function ArtworkInfo({ artwork }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-1">
          {artwork.category || 'Artwork'}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">{artwork.title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium shrink-0">
          {(artwork.artist?.name || artwork.artistName || 'A').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-sm">
            {artwork.artist?.name || artwork.artistName || 'Unknown Artist'}
          </p>
          {artwork.artist?._id && (
            <a
              href={`/artist/${artwork.artist._id}`}
              className="text-xs text-primary hover:underline"
            >
              View profile
            </a>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">
          {artwork.price != null
            ? `$${Number(artwork.price).toLocaleString()}`
            : 'Price on request'}
        </span>
        {artwork.isOnSale && (
          <span className="badge badge-secondary text-xs">Sale</span>
        )}
      </div>

      {artwork.description && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/70 mb-2">
            Description
          </h3>
          <p className="text-base-content/80 leading-relaxed whitespace-pre-line">
            {artwork.description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 p-4 bg-base-200/50 rounded-xl">
        <MetaItem label="Medium" value={artwork.medium} />
        <MetaItem label="Dimensions" value={artwork.dimensions} />
        <MetaItem label="Year" value={artwork.year} />
        <MetaItem label="Location" value={artwork.location} />
        <MetaItem label="Rating" value={artwork.rating ? `${artwork.rating} / 5` : '—'} />
        <MetaItem label="Stock" value={artwork.stock != null && artwork.stock <= 0 ? 'Sold Out' : `${artwork.stock ?? 100} remaining`} />
      </div>

      {artwork.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {artwork.tags.map((tag) => (
            <span key={tag} className="badge badge-ghost badge-sm">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-base-content/50 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value || '—'}</p>
    </div>
  );
}

MetaItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

ArtworkInfo.propTypes = {
  artwork: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    medium: PropTypes.string,
    dimensions: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    location: PropTypes.string,
    rating: PropTypes.number,
    isOnSale: PropTypes.bool,
    isSold: PropTypes.bool,
    availability: PropTypes.bool,
    stock: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    artist: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    artistName: PropTypes.string,
  }).isRequired,
};
