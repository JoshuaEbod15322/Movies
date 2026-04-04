import React from "react";
import { GENRES } from "../constants";
import { cn } from "../lib/utils";

export default function GenreFilter({ selectedGenre, onGenreChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
      <button
        onClick={() => onGenreChange(null)}
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
          !selectedGenre
            ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white",
        )}
      >
        All Genres
      </button>
      {GENRES.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onGenreChange(genre.id)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
            selectedGenre === genre.id
              ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white",
          )}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
