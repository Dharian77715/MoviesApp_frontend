import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const MoviesForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [movies, setMovies] = useState({
    title: "sinbad",
  });

  const onInputChange = ({ target }) => {
    setMovies({ ...movies, [target.name]: target.value });
    console.log(target.name, target.value);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();

    if (params.id) {
      //edit
    } else {
      //add-create
    }
    console.log(movies);
    // navigate("/");
  };

  //   useEffect(() => {
  //     if (params.id) {
  //       setMovies(movies.find((movie) => movie.id === params.id));
  //     }
  //   }, []);

  return (
    <>
      <h5>Add or edit movie</h5>
      <hr />

      <form onSubmit={onFormSubmit}>
        <input
          name="title"
          type="text"
          placeholder="Title"
          onChange={onInputChange}
          value={movies.title}
        />
        <input type="date" />
        <input type="file" />

        <button className="btn btn-primary">Save</button>
      </form>
      <Link to={-1} className="btn btn-outline-secondary">
        Back
      </Link>
    </>
  );
};
