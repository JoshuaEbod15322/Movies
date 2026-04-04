const API_KEY =
  import.meta.env.VITE_TMDB_API_KEY || "3a5aebed8be13c820d53dfd4e162c93a";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const TMDB_CONFIG = {
  API_KEY,
  BASE_URL,
  IMAGE_BASE_URL,
  BACKDROP_SIZE: "original",
  POSTER_SIZE: "w500",
  PROFILE_SIZE: "w185",
  IMAGE_BASE_URL_W300: "https://image.tmdb.org/t/p/w300",
};

export const fetchFromTMDB = async (endpoint, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...params,
    });
    const url = `${BASE_URL}${endpoint}?${queryParams}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("TMDB API Error:", {
        status: response.status,
        statusText: response.statusText,
        url: url.replace(API_KEY, "HIDDEN"),
        message: errorData.status_message || "Unknown error",
      });
      throw new Error(
        errorData.status_message ||
          `TMDB Error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

export const getMovies = (type = "popular", page = 1) => {
  return fetchFromTMDB(`/movie/${type}`, { page });
};

export const getTVSeries = (type = "popular", page = 1) => {
  return fetchFromTMDB(`/tv/${type}`, { page });
};

export const getMovieDetails = (id) => {
  return fetchFromTMDB(`/movie/${id}`, {
    append_to_response: "credits,videos,recommendations",
  });
};

export const getTVDetails = (id) => {
  return fetchFromTMDB(`/tv/${id}`, {
    append_to_response: "credits,videos,recommendations",
  });
};

export const getTVSeasonDetails = (id, seasonNumber) => {
  return fetchFromTMDB(`/tv/${id}/season/${seasonNumber}`);
};

export const getGenres = (type = "movie") => {
  return fetchFromTMDB(`/genre/${type}/list`);
};

export const discoverMovies = (params = {}) => {
  return fetchFromTMDB("/discover/movie", params);
};

export const discoverTV = (params = {}) => {
  return fetchFromTMDB("/discover/tv", params);
};

export const searchMulti = (query, page = 1) => {
  return fetchFromTMDB("/search/multi", { query, page });
};
