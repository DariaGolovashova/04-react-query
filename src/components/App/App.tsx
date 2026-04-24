import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../service/movieService";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  console.log({
    MovieGrid,
    Loader,
    ErrorMessage,
    MovieModal,
    ReactPaginate,
    Toaster,
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    // enabled: query !== "",
    enabled: query.trim() !== "",
  });

  const movies = data?.results || [];
  // const totalPages = data?.total_pages || 0;
  const totalPages = Math.min(data?.total_pages || 0, 500);
  // if (!isLoading && !isError && query && movies.length === 0) {
  //   toast("No movies found for your request.");
  // }
  useEffect(() => {
    if (!isLoading && !isError && query && movies.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isLoading, isError, query, movies.length]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && (
        <MovieGrid
          movies={movies}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
      )}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          // onPageChange={({ selected }) => setPage(selected + 1)}
          onPageChange={(event) => setPage(event.selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Toaster />
    </>
  );
}

export default App;
