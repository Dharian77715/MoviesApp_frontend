import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { moviesApi } from "../../api/moviesApi";
import Swal from "sweetalert2";

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
      const { data } = await moviesApi.get("/movie/genres");
      setGenres(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getMovieGenres = async () => {
    try {
      const { data } = await moviesApi.get(
        `/movie/genres/moviegenres/${params.id}`
      );
      const moviesGenres = data.map(({ id, active }) => ({
        genres_id: id,
        active,
      }));
      setSelectedGenres(moviesGenres || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovies();
    getMovieGenres();
  }, [params.id]);

  const onInputChange = ({ target }) => {
    setMovies({ ...movies, [target.name]: target.value });
  };

  const onGenreChange = (event) => {
    const selectedGenreId = parseInt(event.target.value, 10);
    const hasGenredId = selectedGenres.find(
      ({ genres_id }) => genres_id == selectedGenreId
    );
    console.log(selectedGenres);
    console.log("hasGenredId", hasGenredId);

    if (hasGenredId) {
      const updatedSelectedGenres = selectedGenres.map(
        ({ genres_id, active }) => {
          if (genres_id === selectedGenreId) {
            return { genres_id, active: event.target.checked ? 1 : 0 };
          }
          return { genres_id, active };
        }
      );
      console.log(updatedSelectedGenres);
      setSelectedGenres(updatedSelectedGenres);
    } else {
      setSelectedGenres([
        ...selectedGenres,
        { active: event.target.checked ? 1 : 0, genres_id: selectedGenreId },
      ]);
    }

    // if (event.target.checked) {
    //   setSelectedGenres([
    //     ...selectedGenres,
    //     { active: event.target.checked, genres_id: selectedGenreId },
    //   ]);
    // } else {
    //   setSelectedGenres(selectedGenres.filter((id) => id !== selectedGenreId));
    // }
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

        console.log("Selected", selectedGenres);
        await moviesApi.put(`/movie/genres/moviegenres/${params.id}`, {
          movies_id: Number(movieId),
          genres_id: selectedGenres,
        });
      } else {
        const response = await moviesApi.post("/movies", movies);
        movieId = response.data?.id || response.data?.data?.id;

        await moviesApi.post(`/movie/genres/moviegenres`, {
          movies_id: Number(movieId),
          genres_id: selectedGenres,
        });
      }

      console.log(selectedGenres);

      if (image && movieId) {
        await handleApiImg(movieId);
      }

      if (params.id) {
        Swal.fire({
          icon: "success",
          title: "Movie edited",
          text: "Your movie has been successfully edited!",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Movie created",
          text: "Your movie has been successfully created!",
        });
      }

      navigate("/");
    } catch (error) {
      console.error("Error submitting the form:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message,
      });
    }
  };

  function isActiveGender(genre) {
    return selectedGenres.find(({ genres_id, active }) => {
      if (genres_id == genre.id && active == 1) {
        return true;
      }
      return false;
    });
  }

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
                checked={isActiveGender(genre) ? true : false}
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
          <span> Save</span>
        </button>
      </form>
    </>
  );
};
