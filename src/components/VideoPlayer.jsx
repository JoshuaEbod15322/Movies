import React, { useState } from "react";
import { Play, Settings, Maximize, ExternalLink } from "lucide-react";
import { cn } from "../lib/utils";

export default function VideoPlayer({ id, type = "movie", season, episode }) {
  const [source, setSource] = useState("vidsrc");

  const getEmbedUrl = () => {
    switch (source) {
      case "vidsrc":
        return type === "movie"
          ? `https://vidsrc.to/embed/movie/${id}`
          : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
      case "vidlink":
        return type === "movie"
          ? `https://vidlink.pro/movie/${id}`
          : `https://vidlink.pro/tv/${id}/${season}/${episode}`;
      case "videasy":
        return type === "movie"
          ? `https://videasy.to/embed/movie/${id}`
          : `https://videasy.to/embed/tv/${id}/${season}/${episode}`;
      case "moviesapi":
        return type === "movie"
          ? `https://moviesapi.club/movie/${id}`
          : `https://moviesapi.club/tv/${id}-${season}-${episode}`;
      case "2embed":
        return type === "movie"
          ? `https://www.2embed.cc/embed/${id}`
          : `https://www.2embed.cc/embed/tv?tmdb=${id}&s=${season}&e=${episode}`;
      default:
        return "";
    }
  };

  return (
    <div className="w-full">
      <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group border border-white/10">
        <iframe
          src={getEmbedUrl()}
          className="w-full h-full"
          allowFullScreen
          frameBorder="0"
          referrerPolicy="no-referrer"
          title="Video Player"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Server
            </span>
            <div className="flex flex-wrap bg-black/40 p-1 rounded-lg border border-white/10 gap-1">
              <button
                onClick={() => setSource("vidsrc")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                  source === "vidsrc"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "text-gray-400 hover:text-white",
                )}
              >
                VidSrc
              </button>
              <button
                onClick={() => setSource("vidlink")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                  source === "vidlink"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "text-gray-400 hover:text-white",
                )}
              >
                VidLink
              </button>
              <button
                onClick={() => setSource("videasy")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                  source === "videasy"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "text-gray-400 hover:text-white",
                )}
              >
                Videasy
              </button>
              <button
                onClick={() => setSource("moviesapi")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                  source === "moviesapi"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "text-gray-400 hover:text-white",
                )}
              >
                MoviesAPI
              </button>
              <button
                onClick={() => setSource("2embed")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                  source === "2embed"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "text-gray-400 hover:text-white",
                )}
              >
                2Embed
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-500 italic">
            If player doesn't work, try switching servers.
          </p>
        </div>
      </div>
    </div>
  );
}
