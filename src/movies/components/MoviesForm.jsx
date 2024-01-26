import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { moviesApi } from "../../api/moviesApi";

export const MoviesForm = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [movies, setMovies] = useState({});
  const [genres, setGenres] = useState([]);
  const [image, setImage] = useState(null);

  const getMovies = async () => {
    try {
      const { data: moviesData } = await moviesApi.get("/movies");
      const foundMovies =
        moviesData?.find((m) => m.id === Number(params.id)) || {};
      const { release_date, ...movies } = foundMovies;
      const release_dateSplited = release_date?.split("T")[0];
      setMovies({ ...movies, release_date: release_dateSplited });

      const { data } = await moviesApi.get(
        `/movie/genres/moviegenres/${params.id}`
      );
      setGenres(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovies();
  }, [params.id]);

  const mapGenres = genres.map(
    ({ id, genre }) => genre
    // <span key={id}>
    //   {genre}
    //   {index < genres.length - 1 && ", "}
    // </span>
  );

  const onInputChange = ({ target }) => {
    setMovies({ ...movies, [target.name]: target.value });
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

      // Construir la URL para subir la imagen utilizando el ID de la película
      const uploadUrl = `/uploads/movies/${movieId}`;

      // Hacer la solicitud para subir la imagen
      await moviesApi.put(uploadUrl, formData);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Puedes manejar el error según tus necesidades
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

        // Intentar obtener el ID de la respuesta
        movieId = response.data?.id || response.data?.data?.id;

        if (!movieId) {
          throw new Error("No se pudo obtener el ID de la película");
        }
      }

      // Si hay una imagen y se ha obtenido un ID de película, cargarla
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
        {/* <div className="col-5">
          <label>Movie Genres</label>
          <input
            type="text"
            className="form-control"
            placeholder="Genres"
            name="genres"
            value={mapGenres || ""}
            onChange={onInputChange}
          />
        </div> */}

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
