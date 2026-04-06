import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  Play,
  ChevronRight,
  Users,
  Film,
  List,
} from "lucide-react";
import {
  getMovieDetails,
  getTVDetails,
  getTVSeasonDetails,
  TMDB_CONFIG,
} from "../services/tmdb";
import VideoPlayer from "../components/VideoPlayer";
import MovieGrid from "../components/MovieGrid";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export default function MovieDetails() {
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        try {
          data =
            type === "movie"
              ? await getMovieDetails(id)
              : await getTVDetails(id);
        } catch (error) {
          // If the first attempt fails with 404, try the other type
          if (
            error.message.includes("404") ||
            error.message.includes("not found")
          ) {
            data =
              type === "movie"
                ? await getTVDetails(id)
                : await getMovieDetails(id);
          } else {
            throw error;
          }
        }
        setItem(data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) return null;

  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const runtime =
    item.runtime || (item.episode_run_time && item.episode_run_time[0]);
  const genres = item.genres || [];
  const cast = item.credits?.cast?.slice(0, 10) || [];
  const recommendations = item.recommendations?.results?.slice(0, 12) || [];
  const trailer = item.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  );

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Hero Backdrop */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img
            src={`${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.BACKDROP_SIZE}${item.backdrop_path}`}
            alt={title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to={`/watch/${type}/${id}`}
              className="bg-red-600 p-6 rounded-full shadow-2xl shadow-red-600/40 group flex items-center justify-center"
            >
              <Play
                className="fill-current text-white group-hover:scale-110 transition-transform"
                size={48}
              />
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Poster & Info */}
          <div className="w-full lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <img
                src={`${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.POSTER_SIZE}${item.poster_path}`}
                alt={title}
                className="w-full"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Rating
                  </p>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold">
                    <Star size={16} className="fill-current" />
                    {item.vote_average?.toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Year
                  </p>
                  <p className="font-bold">
                    {new Date(releaseDate).getFullYear()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Runtime
                  </p>
                  <p className="font-bold">
                    {type === "tv" ? "Series" : `${runtime}m`}
                  </p>
                </div>
                {item.adult && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                      Rating
                    </p>
                    <p className="font-bold text-red-600">18+</p>
                  </div>
                )}
              </div>

              <Link
                to={`/watch/${type}/${id}`}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30"
              >
                <Play className="fill-current" size={20} />
                Watch Now
              </Link>
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-2/3">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
                {title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-8">
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-gray-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-12">
                {item.overview}
              </p>

              {/* Trailer Section */}
              {trailer && (
                <div className="mt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Play className="text-red-600" size={24} />
                    <h2 className="text-2xl font-black tracking-tighter uppercase">
                      Official Trailer
                    </h2>
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cast Section */}
        <div className="mt-16 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Users className="text-red-600" size={24} />
            <h2 className="text-2xl font-black tracking-tighter uppercase">
              Top Cast
            </h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {cast.map((person) => (
              <div
                key={person.id}
                className="flex-shrink-0 w-24 text-center group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-white/10 relative bg-zinc-900 flex items-center justify-center">
                  {person.profile_path ? (
                    <img
                      src={`${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.PROFILE_SIZE}${person.profile_path}`}
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center bg-zinc-800 text-white font-black text-2xl uppercase",
                      person.profile_path ? "hidden" : "flex",
                    )}
                  >
                    {person.name.charAt(0)}
                  </div>
                </div>
                <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                  {person.name}
                </p>
                <p className="text-[10px] text-gray-500 line-clamp-1">
                  {person.character}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <Film className="text-red-600" size={24} />
              <h2 className="text-2xl font-black tracking-tighter uppercase">
                More Like This
              </h2>
            </div>
            <MovieGrid items={recommendations} type={type} />
          </div>
        )}
      </div>
    </div>
  );
}
