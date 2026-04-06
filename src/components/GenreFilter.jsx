import React, { useState, useRef, useEffect } from "react";
import { GENRES } from "../constants";
import { cn } from "../lib/utils";
import { ChevronDown } from "lucide-react";

export default function GenreFilter({ selectedGenre, onGenreChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all min-w-[200px] justify-between"
      >
        <span className="font-bold">
          {selectedGenre
            ? GENRES.find((g) => g.id === selectedGenre)?.name
            : "All Genres"}
        </span>
        <ChevronDown
          className={cn("transition-transform", isOpen && "rotate-180")}
          size={20}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-full md:w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 py-2 max-h-96 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              onGenreChange(null);
              setIsOpen(false);
            }}
            className={cn(
              "w-full text-left px-6 py-3 text-sm font-bold transition-all hover:bg-white/5",
              !selectedGenre ? "text-red-600 bg-red-600/5" : "text-gray-400",
            )}
          >
            All Genres
          </button>
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => {
                onGenreChange(genre.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-6 py-3 text-sm font-bold transition-all hover:bg-white/5",
                selectedGenre === genre.id ? "text-red-600" : "text-gray-400",
              )}
            >
              {genre.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
