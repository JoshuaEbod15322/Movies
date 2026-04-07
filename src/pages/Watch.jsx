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
  Search,
  ChevronDown,
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
import CustomDropdown from "../components/CustomDropdown";

import MovieGrid from "../components/MovieGrid";

export default function Watch() {
  const { type, id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const season = Number(searchParams.get("s")) || 1;
  const episode = Number(searchParams.get("e")) || 1;

  const [item, setItem] = useState(null);
  const [resolvedType, setResolvedType] = useState(type);
  const [seasonData, setSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
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
        setResolvedType(actualType);
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
        setError(
          "Failed to load content. Please check your connection or try again later.",
        );
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

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-600/10 border border-red-600/20 p-8 rounded-2xl max-w-md">
          <Film className="text-red-600 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">
            Oops!
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all"
          >
            Try Again
          </button>
        </div>
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
            Back to Details
          </Link>
        </div>

        {/* Video Player Section */}
        <div className="mb-12">
          <VideoPlayer
            id={id}
            imdbId={item.external_ids?.imdb_id}
            type={resolvedType}
            season={season}
            episode={episode}
          />

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
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <List className="text-red-600" size={24} />
                  <h2 className="text-2xl font-black tracking-tighter uppercase">
                    Episodes
                  </h2>
                </div>

                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                      viewMode === "grid"
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : "text-gray-400 hover:text-white",
                    )}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                      viewMode === "list"
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : "text-gray-400 hover:text-white",
                    )}
                  >
                    List
                  </button>
                </div>
              </div>

              <div className="w-full md:w-64">
                <CustomDropdown
                  value={season}
                  options={
                    item.seasons?.map((s) => ({
                      value: s.season_number,
                      label: s.name || `Season ${s.season_number}`,
                    })) || []
                  }
                  onChange={handleSeasonChange}
                  placeholder="Select Season"
                />
              </div>
            </div>

            {loadingEpisodes ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "flex flex-col gap-2",
                )}
              >
                {[...Array(viewMode === "grid" ? 4 : 8)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "bg-white/5 rounded-xl animate-pulse",
                      viewMode === "grid" ? "h-24" : "h-12",
                    )}
                  />
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "flex flex-col gap-2",
                )}
              >
                {seasonData?.episodes?.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => handleEpisodeClick(ep.episode_number)}
                    className={cn(
                      "flex rounded-xl border transition-all text-left group overflow-hidden",
                      viewMode === "grid"
                        ? "flex-col p-3 gap-3"
                        : "items-center p-2 gap-4",
                      episode === ep.episode_number
                        ? "bg-red-600/10 border-red-600/50"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
                    )}
                  >
                    {viewMode === "grid" ? (
                      <>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-900 flex items-center justify-center">
                          {ep.still_path ? (
                            <img
                              src={`${TMDB_CONFIG.IMAGE_BASE_URL}/w300${ep.still_path}`}
                              alt={ep.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={cn(
                              "absolute inset-0 flex items-center justify-center bg-zinc-800",
                              ep.still_path ? "hidden" : "flex",
                            )}
                          >
                            <Play size={24} className="text-gray-600" />
                          </div>
                          <div
                            className={cn(
                              "absolute inset-0 flex items-center justify-center transition-opacity",
                              episode === ep.episode_number
                                ? "bg-red-600/40 opacity-100"
                                : "bg-black/40 opacity-0 group-hover:opacity-100",
                            )}
                          >
                            {episode === ep.episode_number ? (
                              <div className="flex flex-col items-center gap-1">
                                <div className="flex gap-0.5 items-end h-4">
                                  <div
                                    className="w-1 bg-white animate-[bounce_1s_infinite_0ms]"
                                    style={{ height: "60%" }}
                                  />
                                  <div
                                    className="w-1 bg-white animate-[bounce_1s_infinite_200ms]"
                                    style={{ height: "100%" }}
                                  />
                                  <div
                                    className="w-1 bg-white animate-[bounce_1s_infinite_400ms]"
                                    style={{ height: "80%" }}
                                  />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-tighter text-white">
                                  Playing
                                </span>
                              </div>
                            ) : (
                              <Play
                                size={24}
                                className="fill-current text-white"
                              />
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                              Episode {ep.episode_number}
                            </p>
                            <p className="text-[10px] text-gray-500 font-bold">
                              {ep.air_date
                                ? new Date(ep.air_date).toLocaleDateString()
                                : ""}
                            </p>
                          </div>
                          <h4
                            className={cn(
                              "text-sm font-bold line-clamp-1 transition-colors mb-1",
                              episode === ep.episode_number
                                ? "text-red-500"
                                : "text-white group-hover:text-red-500",
                            )}
                          >
                            {ep.name}
                          </h4>
                          {ep.overview && (
                            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                              {ep.overview}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black border transition-all",
                            episode === ep.episode_number
                              ? "bg-red-600 text-white border-red-600"
                              : "bg-white/5 text-red-600 border-white/10 group-hover:bg-red-600 group-hover:text-white",
                          )}
                        >
                          {episode === ep.episode_number ? (
                            <div className="flex gap-0.5 items-end h-3">
                              <div
                                className="w-0.5 bg-white animate-[bounce_1s_infinite_0ms]"
                                style={{ height: "60%" }}
                              />
                              <div
                                className="w-0.5 bg-white animate-[bounce_1s_infinite_200ms]"
                                style={{ height: "100%" }}
                              />
                              <div
                                className="w-0.5 bg-white animate-[bounce_1s_infinite_400ms]"
                                style={{ height: "80%" }}
                              />
                            </div>
                          ) : (
                            ep.episode_number
                          )}
                        </div>
                        <div className="min-w-0 flex-grow">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4
                              className={cn(
                                "text-sm font-bold line-clamp-1 transition-colors",
                                episode === ep.episode_number
                                  ? "text-red-500"
                                  : "text-white group-hover:text-red-500",
                              )}
                            >
                              {ep.name}
                            </h4>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                              •{" "}
                              {ep.air_date
                                ? new Date(ep.air_date).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                          {ep.overview && (
                            <p className="text-[11px] text-gray-400 line-clamp-1 leading-relaxed">
                              {ep.overview}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 pr-2">
                          {episode === ep.episode_number ? (
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                              Now Playing
                            </span>
                          ) : (
                            <Play
                              size={16}
                              className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          )}
                        </div>
                      </>
                    )}
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
