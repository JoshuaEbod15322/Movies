import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Filter } from "lucide-react";
import {
  discoverMovies,
  discoverTV,
  fetchItemsWithCount,
} from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import { cn } from "../lib/utils";

export default function GenrePage() {
  const { genreId, genreName } = useParams();
  const [items, setItems] = useState([]);
  const [type, setType] = useState("movie"); // 'movie' or 'tv'
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [genreId, type]);

  useEffect(() => {
    const fetchGenreData = async () => {
      setLoading(true);
      try {
        const fetchFn = type === "movie" ? discoverMovies : discoverTV;
        const data = await fetchItemsWithCount(fetchFn, 24, page, {
          with_genres: genreId,
          sort_by: "popularity.desc",
        });
        setItems(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching genre data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreData();
    window.scrollTo(0, 0);
  }, [genreId, type, page]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <Filter className="text-red-600" size={32} />
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              {genreName}{" "}
              <span className="text-red-600">
                {type === "movie" ? "Movies" : "TV Shows"}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={() => {
                setType("movie");
                setPage(1);
              }}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all",
                type === "movie"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white",
              )}
            >
              Movies
            </button>
            <button
              onClick={() => {
                setType("tv");
                setPage(1);
              }}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all",
                type === "tv"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white",
              )}
            >
              TV Shows
            </button>
          </div>
        </div>

        <MovieGrid items={items} type={type} loading={loading} />

        {!loading && items.length > 0 && (
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
