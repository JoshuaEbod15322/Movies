import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Filter, X } from "lucide-react";
import {
  searchMulti,
  searchMovies,
  searchTV,
  discoverMovies,
  discoverTV,
  getGenres,
  fetchItemsWithCount,
} from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import { motion, AnimatePresence } from "motion/react";

const CERTIFICATIONS = {
  movie: ["G", "PG", "PG-13", "R", "NC-17"],
  tv: ["TV-G", "TV-PG", "TV-14", "TV-MA"],
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const type = searchParams.get("type") || "all";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const rating = searchParams.get("rating") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const movieGenres = await getGenres("movie");
        const tvGenres = await getGenres("tv");
        // Combine and deduplicate genres
        const combined = [...movieGenres.genres, ...tvGenres.genres];
        const unique = Array.from(
          new Map(combined.map((g) => [g.id, g])).values(),
        );
        setGenres(unique.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      const params = {
        page,
        with_genres: genre || undefined,
        certification_country: rating && type !== "all" ? "US" : undefined,
        certification: rating && type !== "all" ? rating : undefined,
      };

      if (type === "movie") {
        if (year) params.primary_release_year = year;
        if (query) {
          data = await fetchItemsWithCount(
            (p) => searchMovies(query, p.page, year),
            84,
            page,
          );
        } else {
          data = await fetchItemsWithCount(
            (p) => discoverMovies({ ...params, ...p }),
            84,
            page,
          );
        }
      } else if (type === "tv") {
        if (year) params.first_air_date_year = year;
        if (query) {
          data = await fetchItemsWithCount(
            (p) => searchTV(query, p.page, year),
            84,
            page,
          );
        } else {
          data = await fetchItemsWithCount(
            (p) => discoverTV({ ...params, ...p }),
            84,
            page,
          );
        }
      } else {
        if (query) {
          data = await fetchItemsWithCount(
            (p) => searchMulti(query, p.page),
            84,
            page,
          );
        } else {
          data = await fetchItemsWithCount(
            (p) => discoverMovies({ ...params, ...p }),
            84,
            page,
          );
        }
      }

      let filteredResults = data.results;

      if (query && (genre || rating)) {
        filteredResults = filteredResults.filter((item) => {
          const genreMatch =
            !genre ||
            (item.genre_ids && item.genre_ids.includes(Number(genre)));
          return genreMatch;
        });
      }

      const finalResults = filteredResults.filter(
        (item) =>
          item.media_type === "movie" ||
          item.media_type === "tv" ||
          !item.media_type,
      );

      setResults(finalResults);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  }, [query, page, type, genre, year, rating]);

  useEffect(() => {
    fetchResults();
    window.scrollTo(0, 0);
  }, [fetchResults]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams();
    if (query) newParams.set("q", query);
    setSearchParams(newParams);
  };

  const hasActiveFilters = type !== "all" || genre || year || rating;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <SearchIcon className="text-red-600" size={32} />
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              {query ? (
                <>
                  Results for: <span className="text-red-600">"{query}"</span>
                </>
              ) : (
                <>
                  Browse <span className="text-red-600">Movies & TV</span>
                </>
              )}
            </h1>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              showFilters || hasActiveFilters
                ? "bg-red-600 border-red-600 text-white"
                : "bg-transparent border-white/20 text-white/70 hover:border-white/40"
            }`}
            id="filter-toggle-button"
          >
            <Filter size={18} />
            <span className="font-bold uppercase text-sm tracking-widest">
              Filters
            </span>
            {hasActiveFilters && (
              <span className="bg-white text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
                !
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/40">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => updateFilter("type", e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="all">All Content</option>
                    <option value="movie">Movies</option>
                    <option value="tv">TV Series</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/40">
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => updateFilter("genre", e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">All Genres</option>
                    {genres.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/40">
                    Year
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2024"
                    value={year}
                    onChange={(e) => updateFilter("year", e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/40">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => updateFilter("rating", e.target.value)}
                    disabled={type === "all"}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">All Ratings</option>
                    {type !== "all" &&
                      CERTIFICATIONS[type].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-4 pt-4 border-t border-white/5">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    <X size={16} />
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <MovieGrid items={results} type="movie" loading={loading} />

        {!loading && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 text-xl font-medium">
              No results found matching your criteria.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-red-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {!loading && results.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
