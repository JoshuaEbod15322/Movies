import React from "react";
import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { TMDB_CONFIG } from "../services/tmdb";
import { motion } from "motion/react";

export default function MovieCard({ item, type = "movie" }) {
  const itemType = item.media_type || type;
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const posterPath = item.poster_path
    ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.POSTER_SIZE}${item.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <motion.div
      whileHover={{
        scale: 1.05, // Reduced scale for a more subtle effect
        zIndex: 20, // Increased zIndex slightly
      }}
      transition={{ duration: 0.2 }}
      className="group relative bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/20"
    >
      <Link to={`/${itemType}/${item.id}`} className="block">
        <div className="aspect-[2/3] relative">
          <img
            src={posterPath}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-98" // Reduced scale slightly for cleaner look
            referrerPolicy="no-referrer"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-red-600 p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
              <Play className="fill-current text-white" size={24} />
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-yellow-400 z-10">
            <Star size={12} className="fill-current" />
            {item.vote_average?.toFixed(1)}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 relative bg-gray-900">
          <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-red-500 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            {releaseDate ? new Date(releaseDate).getFullYear() : "N/A"}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
