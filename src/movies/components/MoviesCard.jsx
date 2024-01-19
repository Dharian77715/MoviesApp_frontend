import { useState, useEffect } from "react";

import { moviesApi } from "../../api/moviesApi";
import { MovieDetails } from "../pages/MovieDetails";

export const MoviesCard = ({ movie, genres }) => {
  const [img, setImg] = useState([]);

  const getImg = async () => {
    const { data } = await moviesApi.get(`/uploads/movies/${movie.id}`, {
      responseType: "blob",
    });
    const objectURL = URL.createObjectURL(data);
    setImg(objectURL);
  };

  useEffect(() => {
    getImg();
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
              <p className="card-text">{genres[0]}</p>
              Release date: {new Date(movie.release_date).toLocaleDateString()}
              <MovieDetails movie={movie} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
