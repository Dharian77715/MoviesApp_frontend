import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { moviesApi } from "../../api/moviesApi";
import { MoviesCard } from "../components/MoviesCard";
import { ListGroup } from "../components/ListGroup";
import { SearchBox } from "../components/SearchBox";

export const MoviesPage = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const getMovies = async () => {
    try {
      const { data: moviesData } = await moviesApi.get("/movies");
      setMovies(moviesData);

      const { data } = await moviesApi.get("/movie/genres");
      setGenres(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleGenreSelect = ({ target }) => {
    setSelectedGenre(target.value);
    setSearchQuery("");
  };

  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    setSelectedGenre("");
  };

  const hasGenresByMovieId = (movie, selectedGenre) => {
    const hasSelectedGenre = movie.genres
      ?.map(({ id }) => id)
      ?.includes(Number(selectedGenre));
    return hasSelectedGenre;
  };

  const filteredMovies = movies.filter((movie) => {
    const filteredBySearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (searchQuery) {
      return filteredBySearch;
    }
    if (selectedGenre) {
      return hasGenresByMovieId(movie, selectedGenre);
    }

    return true;
  });

  const deleteMovie = async (id) => {
    try {
      const filteredMovies = movies.filter((m) => m.id !== id);
      await moviesApi.delete(`/movie/genres/${id}`);
      await moviesApi.delete(`/movies/${id}`);
      setMovies(filteredMovies);

      await Swal.fire({
        icon: "success",
        title: "Movie deleted",
        text: "The movie has been successfully deleted!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Movies</h1>
      <hr />

      <div className="row">
        <div className="col-3">
          <SearchBox value={searchQuery} onChange={handleSearch} />
        </div>
        <ListGroup
          name="All genres"
          items={genres}
          selectedItem={selectedGenre}
          onItemSelect={handleGenreSelect}
        />
        <div className="d-flex justify-content-end">
          <Link to="new" className="btn btn-primary mb-2">
            Add movie
          </Link>
        </div>
      </div>
      {filteredMovies.length === 0 ? (
        <p>
          La pelicula <b>{` ${searchQuery}`}</b> no fue encotrada
        </p>
      ) : (
        <div className="row rows-cols-1 row-cols-md-3 g-3">
          {filteredMovies.map((movie) => (
            <MoviesCard
              key={movie.id}
              movie={movie}
              genres={genres}
              onMovieDelete={deleteMovie}
            />
          ))}
        </div>
      )}
    </>
  );
};
