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
    // Validate page parameter if present
    if (params.page !== undefined) {
      const page = Number(params.page);
      if (isNaN(page) || page < 1 || page > 500) {
        // Return empty results instead of throwing to avoid crashing the UI
        return { results: [], total_pages: 0, total_results: 0 };
      }
      params.page = Math.floor(page);
    }

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

export const getTrending = (timeWindow = "day", page = 1) => {
  return fetchFromTMDB(`/trending/all/${timeWindow}`, { page });
};

export const getLatestMovies = (page = 1) => {
  return fetchFromTMDB("/movie/now_playing", { page });
};

export const getLatestTVSeries = (page = 1) => {
  return fetchFromTMDB("/tv/on_the_air", { page });
};

export const getLatestAnime = (page = 1) => {
  return fetchFromTMDB("/discover/tv", {
    page,
    with_genres: "16",
    with_original_language: "ja",
    sort_by: "first_air_date.desc",
  });
};

export const fetchItemsWithCount = async (
  fetchFn,
  count = 24,
  page = 1,
  params = {},
) => {
  // Ensure page is at least 1 and an integer
  const safePage = Math.max(1, Math.floor(page));

  const startItem = (safePage - 1) * count;
  const endItem = safePage * count;

  const startPage = Math.floor(startItem / 20) + 1;
  const endPage = Math.floor((endItem - 1) / 20) + 1;

  // TMDB has a limit of 500 pages
  const pagesToFetch = [];
  for (let p = startPage; p <= endPage; p++) {
    if (p <= 500) {
      pagesToFetch.push(p);
    }
  }

  if (pagesToFetch.length === 0) {
    return { results: [], total_pages: 0, total_results: 0 };
  }

  const results = await Promise.all(
    pagesToFetch.map((p) => fetchFn({ ...params, page: p })),
  );

  const allResults = results.flatMap((r) => r.results);
  const totalResults = results[0].total_results || 0;

  // Calculate total pages based on our custom count, but cap at what TMDB can provide
  // TMDB max items = 500 pages * 20 items = 10,000 items
  const maxItems = Math.min(totalResults, 10000);
  const totalPages = Math.ceil(maxItems / count);

  const offset = startItem % 20;
  const slicedResults = allResults.slice(offset, offset + count);

  return {
    results: slicedResults,
    total_pages: totalPages,
    total_results: totalResults,
  };
};
