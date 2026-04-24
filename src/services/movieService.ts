import axios from "axios";
import type { MoviesResponse } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// interface MovieResponse {
//     results: Movie[];
// }

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<MoviesResponse> => {
  if (!query.trim()) return { results: [], total_pages: 0 };
  const response = await axios.get<MoviesResponse>(`${BASE_URL}/search/movie`, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
};
