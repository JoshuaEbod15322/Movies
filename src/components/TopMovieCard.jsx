import React from "react";
import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { TMDB_CONFIG } from "../services/tmdb";
import { motion } from "motion/react";

export default function TopMovieCard({ item, rank, type = "movie" }) {
  const itemType = item.media_type || type;
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const posterPath = item.poster_path
    ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.POSTER_SIZE}${item.poster_path}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="relative group flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-all"
    >
      {/* Rank Number Background */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-9xl font-black text-white/15 select-none pointer-events-none italic z-0">
        {rank}
      </div>

      <Link
        to={`/${itemType}/${item.id}`}
        className="relative z-10 flex items-center gap-4 w-full"
      >
        <div className="relative w-24 aspect-[2/3] flex-shrink-0 overflow-hidden rounded-xl shadow-2xl">
          {posterPath ? (
            <img
              src={posterPath}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <Star className="text-zinc-600" size={24} />
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="fill-current text-white" size={20} />
          </div>
        </div>

        <div className="flex-grow min-w-0">
          <h3 className="text-white font-bold text-lg truncate group-hover:text-red-500 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
              <Star size={14} className="fill-current" />
              {item.vote_average?.toFixed(1)}
            </div>
            <span className="text-zinc-500 text-sm">
              {releaseDate ? new Date(releaseDate).getFullYear() : "N/A"}
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {item.overview}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
