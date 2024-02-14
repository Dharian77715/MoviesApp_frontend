import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { moviesApi } from "../../api/moviesApi";
import { MovieDetails } from "../pages/MovieDetails";

export const MoviesCard = ({ movie, onMovieDelete }) => {
  const [img, setImg] = useState([]);
  const [genres, setGenres] = useState([]);

  const getImg = async () => {
    const { data } = await moviesApi.get(`/uploads/movies/${movie.id}`, {
      responseType: "blob",
    });
    const objectURL = URL.createObjectURL(data);
    setImg(objectURL);
  };

  const getGenres = async () => {
    try {
      const { data } = await moviesApi.get(
        `/movie/genres/moviegenres/${movie.id}`
      );
      setGenres(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getImg();
    getGenres();
  }, []);

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card">
        <div className="row no-gutters">
          <div className="col-4">
            {img && (
              <img
                src={img}
                className="card-img-top"
                alt={movie.title}
                style={{ height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
          <div className="col-8">
            <div className="card-body">
              <h5 className="card-title">{movie.title}</h5>
              <p className="card-text">
                {genres.map(
                  ({ id, active, genre }, index) =>
                    active == 1 && (
                      <span key={id}>
                        {genre}
                        {index < genres.length - 3 && " "}
                      </span>
                    )
                )}
              </p>
              Release date: {new Date(movie.release_date).toLocaleDateString()}
              <MovieDetails movie={movie} />
            </div>
            <Link
              to={`edit/${movie.id}`}
              className="btn btn-outline-success m-2"
            >
              Edit
            </Link>
            <button
              onClick={() => onMovieDelete(movie.id)}
              className="btn btn-outline-danger m-2"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
