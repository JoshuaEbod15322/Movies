import React, { useEffect, useState, useRef } from "react";
import { Film, ChevronDown } from "lucide-react";
import {
  discoverMovies,
  fetchItemsWithCount,
  getGenres,
} from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres("movie");
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = {
          sort_by: "popularity.desc",
        };
        if (selectedGenre) {
          params.with_genres = selectedGenre;
        }

        const data = await fetchItemsWithCount(
          discoverMovies,
          100,
          page,
          params,
        );
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    window.scrollTo(0, 0);
  }, [page, selectedGenre]);

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <Film className="text-red-600" size={32} />
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              Movies
            </h1>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all min-w-[200px] justify-between"
            >
              <span className="font-bold">
                {selectedGenre
                  ? genres.find((g) => g.id.toString() === selectedGenre)?.name
                  : "All Genres"}
              </span>
              <ChevronDown
                className={cn("transition-transform", isOpen && "rotate-180")}
                size={20}
              />
            </button>

            {isOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 py-2 max-h-96 overflow-y-auto no-scrollbar">
                <button
                  onClick={() => {
                    handleGenreChange("");
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-6 py-3 text-sm font-bold transition-all hover:bg-white/5",
                    selectedGenre === "" ? "text-red-600" : "text-gray-400",
                  )}
                >
                  All Genres
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => {
                      handleGenreChange(genre.id.toString());
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-6 py-3 text-sm font-bold transition-all hover:bg-white/5",
                      selectedGenre === genre.id.toString()
                        ? "text-red-600"
                        : "text-gray-400",
                    )}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <MovieGrid items={movies} loading={loading} />

        {!loading && movies.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
