import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { searchMulti, fetchItemsWithCount } from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const page = Number(searchParams.get("page")) || 1;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await fetchItemsWithCount(
          (params) => searchMulti(query, params.page),
          24,
          page,
        );
        // Filter to only include movies and tv shows
        const filtered = data.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        );
        setResults(filtered);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    window.scrollTo(0, 0);
  }, [query, page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, page: newPage });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <SearchIcon className="text-red-600" size={32} />
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Results for: <span className="text-red-600">"{query}"</span>
          </h1>
        </div>

        <MovieGrid items={results} type="movie" loading={loading} />

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
