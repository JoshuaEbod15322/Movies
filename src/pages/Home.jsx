import React, { useEffect, useState } from "react";
import {
  Play,
  Info,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getMovies, TMDB_CONFIG } from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import { CATEGORIES } from "../constants";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function Home() {
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movies, setMovies] = useState([]);
  const [activeCategory, setActiveCategory] = useState("popular");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const popular = await getMovies("popular");
        setHeroMovies(popular.results.slice(0, 5));

        const currentCategoryData = await getMovies(activeCategory);
        setMovies(currentCategoryData.results);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [activeCategory]);

  useEffect(() => {
    if (heroMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroMovies]);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
  const prevSlide = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + heroMovies.length) % heroMovies.length,
    );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Carousel */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {heroMovies.length > 0 && (
            <motion.div
              key={heroMovies[currentIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0">
                <img
                  src={`${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.BACKDROP_SIZE}${heroMovies[currentIndex].backdrop_path}`}
                  alt={heroMovies[currentIndex].title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      Featured
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                      <Star size={16} className="fill-current" />
                      {heroMovies[currentIndex].vote_average?.toFixed(1)}
                    </div>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
                    {heroMovies[currentIndex].title}
                  </h1>
                  <p className="text-gray-300 text-lg mb-8 line-clamp-3 leading-relaxed">
                    {heroMovies[currentIndex].overview}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/movie/${heroMovies[currentIndex].id}`}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-600/30"
                    >
                      <Play className="fill-current" size={20} />
                      Watch Now
                    </Link>
                    <Link
                      to={`/movie/${heroMovies[currentIndex].id}`}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all border border-white/20"
                    >
                      <Info size={20} />
                      More Info
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-16 right-6 md:right-16 flex items-center gap-4 z-20">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            {heroMovies.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentIndex === i ? "bg-red-600 w-6" : "bg-white/30",
                )}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Categories & Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-red-600" size={32} />
            <h2 className="text-3xl font-black tracking-tighter uppercase">
              Discover
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                  activeCategory === cat.id
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "text-gray-400 hover:text-white",
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <MovieGrid items={movies} loading={loading} />
      </div>
    </div>
  );
}
