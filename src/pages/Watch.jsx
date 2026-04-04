import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  Play,
  ChevronLeft,
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
import { motion } from "motion/react";
import { cn } from "../lib/utils";

import MovieGrid from "../components/MovieGrid";

export default function Watch() {
  const { type, id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const season = Number(searchParams.get("s")) || 1;
  const episode = Number(searchParams.get("e")) || 1;

  const [item, setItem] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        let actualType = type;
        try {
          data =
            type === "movie"
              ? await getMovieDetails(id)
              : await getTVDetails(id);
        } catch (error) {
          if (
            error.message.includes("404") ||
            error.message.includes("not found")
          ) {
            data =
              type === "movie"
                ? await getTVDetails(id)
                : await getMovieDetails(id);
            actualType = type === "movie" ? "tv" : "movie";
          } else {
            throw error;
          }
        }

        setItem(data);
        if (actualType === "tv") {
          // Check if the requested season exists, otherwise use the first available
          const availableSeasons = data.seasons || [];
          const seasonExists = availableSeasons.some(
            (s) => s.season_number === season,
          );
          const firstSeason =
            availableSeasons.find((s) => s.season_number > 0)?.season_number ||
            availableSeasons[0]?.season_number ||
            1;

          if (!seasonExists) {
            setSearchParams({ s: firstSeason, e: 1 });
            fetchSeasonData(id, firstSeason);
          } else {
            fetchSeasonData(id, season);
          }
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [type, id]);

  const fetchSeasonData = async (tvId, seasonNum) => {
    setLoadingEpisodes(true);
    try {
      const data = await getTVSeasonDetails(tvId, seasonNum);
      setSeasonData(data);
    } catch (error) {
      console.error("Error fetching season data:", error);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  const handleSeasonChange = (newSeason) => {
    setSearchParams({ s: newSeason, e: 1 });
    fetchSeasonData(id, newSeason);
  };

  const handleEpisodeClick = (epNum) => {
    setSearchParams({ s: season, e: epNum });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) return null;

  const title = item.title || item.name;
  const currentEpisode = seasonData?.episodes?.find(
    (ep) => ep.episode_number === episode,
  );
  const cast = item.credits?.cast?.slice(0, 10) || [];
  const recommendations = item.recommendations?.results?.slice(0, 12) || [];

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs / Back */}
        <div className="mb-6">
          <Link
            to={`/${type}/${id}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold"
          >
            <ChevronLeft size={18} />
            Back
          </Link>
        </div>

        {/* Video Player Section */}
        <div className="mb-12">
          <VideoPlayer id={id} type={type} season={season} episode={episode} />

          <div className="mt-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
              {title}
              {type === "tv" && (
                <span className="text-red-600 ml-4">
                  S{season} E{episode}
                </span>
              )}
            </h1>
            {type === "tv" && currentEpisode && (
              <p className="text-xl text-gray-400 font-medium mb-4">
                {currentEpisode.name}
              </p>
            )}
            <p className="text-gray-400 leading-relaxed max-w-4xl">
              {type === "tv" ? currentEpisode?.overview : item.overview}
            </p>
          </div>
        </div>

        {/* TV Episodes Section */}
        {type === "tv" && item.number_of_seasons > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <List className="text-red-600" size={24} />
                <h2 className="text-2xl font-black tracking-tighter uppercase">
                  Episodes
                </h2>
              </div>
              <select
                value={season}
                onChange={(e) => handleSeasonChange(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-bold outline-none focus:border-red-600 transition-all"
              >
                {item.seasons?.map((s) => (
                  <option
                    key={s.id}
                    value={s.season_number}
                    className="bg-gray-900"
                  >
                    {s.name || `Season ${s.season_number}`}
                  </option>
                ))}
              </select>
            </div>

            {loadingEpisodes ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-white/5 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {seasonData?.episodes?.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => handleEpisodeClick(ep.episode_number)}
                    className={cn(
                      "flex flex-col gap-3 p-3 rounded-xl border transition-all text-left group",
                      episode === ep.episode_number
                        ? "bg-red-600/10 border-red-600/50"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
                    )}
                  >
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
                      {ep.still_path ? (
                        <img
                          src={`${TMDB_CONFIG.IMAGE_BASE_URL}/w300${ep.still_path}`}
                          alt={ep.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play size={24} className="text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={24} className="fill-current text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-0.5">
                        Episode {ep.episode_number}
                      </p>
                      <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                        {ep.name}
                      </h4>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cast Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Users className="text-red-600" size={24} />
            <h2 className="text-2xl font-black tracking-tighter uppercase">
              Top Cast
            </h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {cast.map((person) => (
              <div key={person.id} className="flex-shrink-0 w-24 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-white/10">
                  <img
                    src={
                      person.profile_path
                        ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.PROFILE_SIZE}${person.profile_path}`
                        : "https://via.placeholder.com/185x278?text=No+Image"
                    }
                    alt={person.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs font-bold text-white line-clamp-1">
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
          <div>
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
