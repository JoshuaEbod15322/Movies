import React from "react";
import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { TMDB_CONFIG } from "../services/tmdb";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export default function MovieCard({ item, type = "movie" }) {
  const itemType = item.media_type || type;
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const posterPath = item.poster_path
    ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.POSTER_SIZE}${item.poster_path}`
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 20 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-zinc-900 rounded-2xl transition-all duration-300 border border-white/10"
    >
      <Link to={`/${itemType}/${item.id}`} className="block">
        <div className="aspect-[2/3] relative overflow-hidden bg-zinc-900 rounded-t-2xl">
          {posterPath ? (
            <img
              src={posterPath}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}

          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center bg-zinc-800 text-center p-4",
              posterPath ? "hidden" : "flex",
            )}
          >
            <Star className="text-red-600 mb-2" size={32} />
            <span className="text-xs font-black uppercase tracking-tighter text-white/60">
              {title}
            </span>
          </div>

          {/* Hover Overlay - Removed shadow from play button */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-red-600 p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Play className="fill-current text-white" size={24} />
            </div>
          </div>

          {/* Rating Badge - Removed backdrop-blur and any shadow */}
          <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-yellow-400">
            <Star size={12} className="fill-current" />
            {item.vote_average?.toFixed(1)}
          </div>

          {/* Adult Badge - REMOVED shadow-lg and shadow-red-600/40 */}
          {item.adult && (
            <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded-md text-[10px] font-black text-white uppercase tracking-tighter border border-red-500">
              18+
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-red-500 transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-gray-400 text-xs">
              {releaseDate ? new Date(releaseDate).getFullYear() : "N/A"}
            </p>
            <span className="text-[10px] uppercase tracking-widest text-white/20">
              {itemType === "movie" ? "Movie" : "TV"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
