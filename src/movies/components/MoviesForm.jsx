import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { moviesApi } from "../../api/moviesApi";

export const MoviesForm = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [movies, setMovies] = useState({});
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [image, setImage] = useState(null);

  const getMovies = async () => {
    try {
      const { data: moviesData } = await moviesApi.get("/movies");
      const foundMovies =
        moviesData?.find((m) => m.id === Number(params.id)) || {};
      const { release_date, genres, ...movieData } = foundMovies;
      const release_dateSplited = release_date?.split("T")[0];
      setMovies({ ...movieData, release_date: release_dateSplited });
      setSelectedGenres(genres?.map((genre) => genre.id) || []);

      const { data } = await moviesApi.get("/movie/genres");
      setGenres(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovies();
  }, [params.id]);

  const onInputChange = ({ target }) => {
    setMovies({ ...movies, [target.name]: target.value });
  };

  const onGenreChange = (event) => {
    const selectedGenreId = parseInt(event.target.value, 10);
    if (event.target.checked) {
      setSelectedGenres([...selectedGenres, selectedGenreId]);
    } else {
      setSelectedGenres(selectedGenres.filter((id) => id !== selectedGenreId));
    }
  };

  const onFileInputChange = ({ target }) => {
    if (target.files.length > 0) {
      setImage(target.files[0]);
    }
  };

  const handleApiImg = async (movieId) => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      await moviesApi.put(`/uploads/movies/${movieId}`, formData);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();

    try {
      let movieId;

      if (params.id) {
        movieId = params.id;
        await moviesApi.put(`/movies/${params.id}`, movies);
      } else {
        const response = await moviesApi.post("/movies", movies);
        movieId = response.data?.id || response.data?.data?.id;
      }

      await moviesApi.post(`/movie/genres/moviegenres`, {
        movies_id: Number(movieId),
        genres_id: selectedGenres,
      });

      if (image && movieId) {
        await handleApiImg(movieId);
      }

      navigate("/");
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <>
      <h1>{params.id ? "Edit Movie" : "Add Movie"}</h1>
      <hr />
      <form className="container" onSubmit={onFormSubmit}>
        <div className="form-group mb-2 col-5">
          <label>Movie Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            name="title"
            value={movies.title || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-5">
          <label>Movie Genres</label>
          {genres.map((genre) => (
            <div key={genre.id} className="form-check">
              <input
                type="checkbox"
                // id={`genre-${genre.id}`}
                value={genre.id}
                checked={selectedGenres.includes(genre.id)}
                onChange={onGenreChange}
                className="form-check-input"
              />
              <label htmlFor={`genre-${genre.id}`} className="form-check-label">
                {genre.genre}
              </label>
            </div>
          ))}
        </div>

        <div className="form-group mb-2 col-5">
          <label>Release Date</label>
          <input
            type="date"
            className="form-control"
            placeholder="Date: YYYY-MM-DD"
            name="release_date"
            value={movies.release_date || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-1">
          <label>Movie Image</label>
          <input
            type="file"
            className="form-control mb-2"
            accept="image/png, image/jpg"
            onChange={onFileInputChange}
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Movie"
              style={{ maxWidth: "100%", marginTop: "10px" }}
            />
          )}
        </div>

        <Link to={"/"} className="btn btn-outline-secondary m-2">
          Back
        </Link>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Save</span>
        </button>
      </form>
    </>
  );
};
