import React, { useEffect, useState } from "react";
import { Compass } from "lucide-react";
import { discoverMovies, fetchItemsWithCount } from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";

export default function Western() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchWestern = async () => {
      setLoading(true);
      try {
        const data = await fetchItemsWithCount(discoverMovies, 84, page, {
          with_genres: "37",
          sort_by: "popularity.desc",
        });
        setItems(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching western movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWestern();
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <Compass className="text-red-600" size={32} />
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Western Movies
          </h1>
        </div>

        <MovieGrid items={items} type="movie" loading={loading} />

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
