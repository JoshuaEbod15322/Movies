import React, { useEffect, useState } from "react";
import { Tv } from "lucide-react";
import { discoverTV } from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";

export default function TVSeries() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          sort_by: "popularity.desc",
        };
        const data = await discoverTV(params);
        setSeries(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching TV series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <Tv className="text-red-600" size={32} />
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              TV Series
            </h1>
          </div>
        </div>

        <MovieGrid items={series} type="tv" loading={loading} />

        {!loading && series.length > 0 && (
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
