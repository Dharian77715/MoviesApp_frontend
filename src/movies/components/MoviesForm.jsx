import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { moviesApi } from "../../api/moviesApi";
import Swal from "sweetalert2";
import { FileUploader } from "react-drag-drop-files";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-regular-svg-icons";

export const MoviesForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const fileTypes = ["JPG", "PNG", "JPEG"];

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

  const onGenreChange = (selectedOptions) => {
    const selectedGenreIds = selectedOptions.map((option) => option.value);

    let updatedSelectedGenres = selectedGenres.slice();
    console.log(updatedSelectedGenres);

    selectedGenreIds.forEach((id) => {
      if (!updatedSelectedGenres.some((genre) => genre.genres_id === id)) {
        updatedSelectedGenres = [
          ...updatedSelectedGenres,
          { genres_id: id, active: 1 },
        ];
      }
    });

    updatedSelectedGenres = updatedSelectedGenres.map((genre) => ({
      ...genre,
      active: selectedGenreIds.includes(genre.genres_id) ? 1 : 0,
    }));

    setSelectedGenres(updatedSelectedGenres);
  };

  const onFileInputChange = (file) => {
    setImage(file);
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

      if (image && movieId) {
        await handleApiImg(movieId);
      }

      if (params.id) {
        Swal.fire({
          icon: "success",
          title: "Película editada",
          text: "¡La película ha sido editada con éxito!",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Película creada",
          text: "¡La película ha sido agregada con éxito!",
        });
      }

      navigate("/");
    } catch (error) {
      console.error("Error submitting the form:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "¡Error en el formulario, por favor revise los campos!!",
      });
    }
  };

  const selectedOptions = selectedGenres.map((genre) => ({
    value: genre.genres_id,
    label: genres.find((g) => g.id === genre.genres_id)?.genre || "",
    isActive: genre.active === 1,
  }));

  const activeSelectedOptions = selectedOptions.filter(
    (option) => option.isActive
  );

  return (
    <>
      <h1>{params.id ? "Editar Película" : "Agregar Película"}</h1>
      <hr />

      <form className="container" onSubmit={onFormSubmit}>
        <div className="form-group mb-2 col-5">
          <label>Título</label>
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
          <label>Generos</label>
          <Select
            options={genres.map((genre) => ({
              value: genre.id,
              label: genre.genre,
            }))}
            value={activeSelectedOptions}
            onChange={onGenreChange}
            isMulti
          />
        </div>
        <div className="form-group mb-2 col-5">
          <label>Estreno</label>
          <input
            type="date"
            className="form-control"
            placeholder="Date: YYYY-MM-DD"
            name="release_date"
            value={movies.release_date || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-5">
          <label>País</label>
          <input
            type="text"
            className="form-control"
            placeholder="País"
            name="country"
            value={movies.country || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-5">
          <label>Duración</label>
          <input
            type="text"
            className="form-control"
            placeholder="Duración"
            name="duration"
            value={movies.duration || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-5">
          <label>Director</label>
          <input
            type="text"
            className="form-control"
            placeholder="Director"
            name="director"
            value={movies.director || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-5">
          <label>Elenco</label>
          <input
            type="text"
            className="form-control"
            placeholder="Elenco"
            name="cast"
            value={movies.cast || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-1">
          <label>Imagen</label>
          <FileUploader
            handleChange={onFileInputChange}
            name="file"
            types={fileTypes}
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Movie"
              style={{ maxWidth: "100%", margin: "5px" }}
            />
          )}
        </div>
        <Link to={"/"} className="btn btn-outline-secondary m-2">
          Retroceder
        </Link>
        <button type="submit" className="btn btn-outline-primary btn-block">
          <FontAwesomeIcon icon={faSave} />
          <span> Save</span>
        </button>
      </form>
    </>
  );
};
