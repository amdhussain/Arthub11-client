'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchArtistById } from '@/api/artist';

export default function ArtistProfile({ slug }) {
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchArtistById(slug)
      .then((res) => {
        if (cancelled) return;
        setArtist(res.artist);
        setArtworks(res.artworks || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="w-24 h-24 rounded-full bg-stone-200 animate-pulse" />
          <div className="h-8 w-48 bg-stone-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md border border-stone-100 overflow-hidden">
              <div className="aspect-[4/5] bg-stone-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-stone-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-stone-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    const isNotFound = error.response?.status === 404;
    if (isNotFound) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-6xl font-bold text-base-content/20 mb-4">404</p>
          <h2 className="text-2xl font-bold mb-2">Artist Not Found</h2>
          <p className="text-base-content/50 mb-6">
            The artist you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/marketplace" className="btn btn-primary">
            Browse Artworks
          </Link>
        </div>
      );
    }
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="alert alert-error max-w-md mx-auto">
          <span>Failed to load artist. Please try again.</span>
        </div>
        <Link href="/marketplace" className="btn btn-outline btn-sm mt-4">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-6xl font-bold text-base-content/20 mb-4">404</p>
        <h2 className="text-2xl font-bold mb-2">Artist Not Found</h2>
        <p className="text-base-content/50 mb-6">
          The artist you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/marketplace" className="btn btn-primary">
          Browse Artworks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
          {artist.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">{artist.name}</h1>
        <p className="text-base-content/60 mt-1">{artist.specialty || 'Artist'}</p>
        {artist.artworkCount != null && (
          <p className="text-sm text-base-content/50 mt-2">
            {artist.artworkCount} artwork{artist.artworkCount !== 1 ? 's' : ''}
          </p>
        )}
        {artist.bio && (
          <p className="text-base-content/70 max-w-xl mt-4 leading-relaxed">{artist.bio}</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-6">Artworks by {artist.name}</h2>

      {artworks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-stone-400 gap-3">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium text-stone-500">No artworks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <Link
              key={artwork._id || artwork.id}
              href={`/artwork/${artwork._id || artwork.id}`}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-stone-100 flex flex-col"
            >
              <figure className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                <img
                  src={
                    artwork.images?.[0]?.url ||
                    artwork.imageUrl ||
                    artwork.image ||
                    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop'
                  }
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </figure>
              <div className="p-4 space-y-1 flex-1 flex flex-col">
                <h3 className="text-slate-900 font-bold text-sm truncate group-hover:text-emerald-700 transition-colors">
                  {artwork.title}
                </h3>
                <p className="text-slate-500 text-xs truncate">
                  {artwork.category || 'Artwork'}
                </p>
                <p className="font-bold text-emerald-700 text-sm mt-auto pt-2">
                  {artwork.price != null
                    ? `$${Number(artwork.price).toLocaleString()}`
                    : 'Price on request'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
