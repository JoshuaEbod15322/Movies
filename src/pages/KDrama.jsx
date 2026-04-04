import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { discoverTV } from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";

export default function KDrama() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchKDrama = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          with_original_language: "ko",
          with_genres: "18",
          sort_by: "popularity.desc",
        };
        const data = await discoverTV(params);
        setItems(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching K-Drama:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKDrama();
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <Heart className="text-red-600" size={32} />
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            K-Drama
          </h1>
        </div>

        <MovieGrid items={items} type="tv" loading={loading} />

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
