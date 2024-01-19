import React, { useEffect, useState } from "react";
import { moviesApi } from "../../api/moviesApi";
import { ListGroup } from "../components/ListGroup";
import { MoviesCard } from "../components/MoviesCard";
import { SearchBox } from "../components/SearchBox";

export const MoviesPage = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  console.log(genres);

  const getMovies = async () => {
    try {
      const { data: moviesData } = await moviesApi.get("/movies");
      setMovies(moviesData);

      const { data } = await moviesApi.get("/movie/genres");
      // setGenres(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleGenreSelect = (newSelectedGenre) => {
    setSelectedGenre(newSelectedGenre);
    setSearchQuery("");
  };

  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    setSelectedGenre([]);
  };

  const filteredMovies = movies.filter((movie) => {
    if (searchQuery) {
      return movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (selectedGenre && selectedGenre.length > 0) {
      return selectedGenre.some((selectedGenreItem) =>
        genres.toLowerCase().includes(selectedGenreItem.toLowerCase())
      );
    }
    return true;
  });

  return (
    <>
      <h1>Movies</h1>
      <hr />

      <div className="row">
        <div className="col-3">
          <SearchBox value={searchQuery} onChange={handleSearch} />
        </div>
        <ListGroup
          items={genres}
          selectedItem={selectedGenre}
          onItemSelect={handleGenreSelect}
        />
      </div>

      <div className="row rows-cols-1 row-cols-md-3 g-3">
        {filteredMovies.map((movie) => (
          <MoviesCard key={movie.id} movie={movie} genres={genres} />
        ))}
      </div>
    </>
  );
};
