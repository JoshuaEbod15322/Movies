import React, { useEffect, useState, useRef } from "react";
import { Tv, ChevronDown } from "lucide-react";
import { discoverTV, fetchItemsWithCount, getGenres } from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import { cn } from "../lib/utils";
import CustomDropdown from "../components/CustomDropdown";

export default function TVSeries() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres("tv");
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      try {
        const params = {
          sort_by: "popularity.desc",
        };
        if (selectedGenre) {
          params.with_genres = selectedGenre;
        }

        const data = await fetchItemsWithCount(discoverTV, 84, page, params);
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
            <Tv className="text-red-600" size={32} />
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              TV Series
            </h1>
          </div>

          <div className="w-full md:w-64">
            <CustomDropdown
              value={selectedGenre}
              options={[
                { value: "", label: "All Genres" },
                ...genres.map((g) => ({
                  value: g.id.toString(),
                  label: g.name,
                })),
              ]}
              onChange={handleGenreChange}
              placeholder="Select Genre"
            />
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
