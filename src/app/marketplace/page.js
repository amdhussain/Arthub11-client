'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useArtworks } from '@/hooks/useArtworks';
import SearchBar from '@/components/marketplace/SearchBar';
import CategoryFilter from '@/components/marketplace/CategoryFilter';
import SortDropdown from '@/components/marketplace/SortDropdown';
import ArtworkGrid from '@/components/marketplace/ArtworkGrid';
import Pagination from '@/components/marketplace/Pagination';

const LIMIT = 12;
const ALL = 'all';

export default function MarketplacePage() {
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL);
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  const params = {
    page,
    limit: LIMIT,
    ...(search && { search }),
    ...(category && category !== ALL && { category }),
    ...(sort && { sort }),
  };

  const { data, isLoading, isError, error } = useArtworks(params);

  const artworks = data?.artworks || data || [];
  const pages = data?.pages || 1;

  const handleSearchChange = useCallback((val) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((val) => {
    setCategory(val);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((val) => {
    setSort(val);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-10 sm:p-14">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Please Sign Up or Login to explore the marketplace.
            </h2>
            <p className="text-stone-500 mb-8 leading-relaxed">
              Create an account or sign in to browse artworks, view details, and start collecting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-200/50"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 bg-white border border-stone-200 hover:border-emerald-300 text-slate-700 font-semibold rounded-xl transition-all duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Browse Artworks</h1>
          <p className="text-stone-500">
            Discover unique pieces from artists around the world.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>
          <div className="w-full sm:w-44">
            <SortDropdown value={sort} onChange={handleSortChange} />
          </div>
        </div>

        <div className="mb-8">
          <CategoryFilter value={category} onChange={handleCategoryChange} />
        </div>

        <ArtworkGrid
          artworks={artworks}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />

        <Pagination
          page={page}
          pages={pages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
