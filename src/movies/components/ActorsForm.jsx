import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { moviesApi } from "../../api/moviesApi";
import Swal from "sweetalert2";
import { FileUploader } from "react-drag-drop-files";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-regular-svg-icons";

export const ActorsForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];

  const [actors, setActors] = useState([]);
  const [sex, setSex] = useState([]);
  const [selectedSex, setSelectedSex] = useState([]);
  const [image, setImage] = useState(null);

  const getActors = async () => {
    try {
      const { data: actorsData } = await moviesApi.get("/actors");
      const foundActors =
        actorsData?.find((a) => a.id === Number(params.id)) || {};
      const { date_of_birth, ...actorData } = foundActors;
      const dobSplited = date_of_birth?.split("T")[0];
      setActors({ ...actorData, date_of_birth: dobSplited });
      setSelectedSex(sex?.map((s) => s.id) || []);

      const { data } = await moviesApi.get("/actor/sex");
      setSex(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getActors();
  }, [params.id]);

  const onInputChange = ({ target }) => {
    setActors({ ...actors, [target.name]: target.value });
  };

  const onSexChange = (event) => {
    const selectedSexId = parseInt(event.target.value, 10);
    if (event.target.checked) {
      setSelectedSex([...selectedSex, selectedSexId]);
      setActors({ ...actors, sex_id: selectedSexId });
    } else {
      setSelectedSex(selectedSex.filter((id) => id !== selectedSexId));
    }
  };

  const onFileInputChange = (file) => {
    setImage(file);
  };

  const handleApiImg = async (actorId) => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      await moviesApi.put(`/uploads/actors/${actorId}`, formData);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();

    try {
      let actorId;

      if (params.id) {
        actorId = params.id;
        await moviesApi.put(`/actors/${params.id}`, actors);
      } else {
        const response = await moviesApi.post("/actors", actors);
        actorId = response.data?.id || response.data?.data?.id;
      }

      if (image && actorId) {
        await handleApiImg(actorId);
      }

      if (params.id) {
        Swal.fire({
          icon: "success",
          title: "Actor editado",
          text: "¡El actor ha sido editado con éxito!",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Actor agregado",
          text: "¡El actor ha sido agregado con éxito!",
        });
      }

      navigate("/actors");
    } catch (error) {
      console.error("Error submitting the form:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "¡Error en el formulario, por favor revise los campos!",
      });
    }
  };

  return (
    <>
      <h1>{params.id ? "Editar Actor" : "Agregar Actor"}</h1>
      <hr />
      <form className="container" onSubmit={onFormSubmit}>
        <div className="form-group mb-2 col-5">
          <label>Nombre del actor</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            name="name"
            value={actors.name || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-5">
          <label>sexo del actor</label>
          {sex.map((s) => (
            <div key={s.id} className="form-check">
              <input
                type="checkbox"
                value={s.id}
                checked={selectedSex.includes(s.id)}
                onChange={onSexChange}
                className="form-check-input"
              />
              <label className="form-check-label">{s.sex_name}</label>
            </div>
          ))}
        </div>

        <div className="form-group mb-2 col-5">
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            className="form-control"
            placeholder="Date: YYYY-MM-DD"
            name="date_of_birth"
            value={actors.date_of_birth || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-5">
          <label>Cónyuge</label>
          <input
            type="text"
            className="form-control"
            placeholder="Cónyuge"
            name="spouse"
            value={actors.spouse || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-5">
          <label>Hijos</label>
          <input
            type="text"
            className="form-control"
            placeholder="Hijos"
            name="children"
            value={actors.children || ""}
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
            value={actors.country || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-5">
          <label>Películas</label>
          <input
            type="text"
            className="form-control"
            placeholder="Películas"
            name="movies"
            value={actors.movies || ""}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group mb-2 col-1">
          <label>Imagen del actor</label>
          <FileUploader
            handleChange={onFileInputChange}
            name="file"
            types={fileTypes}
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Actor"
              style={{ maxWidth: "100%" }}
            />
          )}
        </div>

        <Link to="/actors" className="btn btn-outline-secondary m-2">
          Retroceder
        </Link>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <FontAwesomeIcon icon={faSave} />
          <span> Guardar</span>
        </button>
      </form>
    </>
  );
};
