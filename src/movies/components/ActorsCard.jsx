import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { moviesApi } from "../../api/moviesApi";
import { ActorDetails } from "../pages/ActorDetails";

export const ActorsCard = ({ actor, onActorDelete }) => {
  const [img, setImg] = useState([]);
  const [sex, setSex] = useState({});

  const getImg = async () => {
    const { data } = await moviesApi.get(`/uploads/actors/${actor.id}`, {
      responseType: "blob",
    });
    const objectURL = URL.createObjectURL(data);
    setImg(objectURL);
  };

  const getSex = async () => {
    try {
      const { data } = await moviesApi.get(`/actor/sex/${actor.sex_id}`);
      const sex = data.find((sex) => sex.id === actor.sex_id);
      if (sex) {
        setSex(sex);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getImg();
    getSex();
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
                alt={actor.name}
                style={{ height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
          <div className="col-8">
            <div className="card-body">
              <h5 className="card-title">{actor.name}</h5>
              <p className="card-text">{sex.sex_name}</p>
              <p className="card-text">{`Nacimiento: ${new Date(
                actor.date_of_birth
              ).toLocaleDateString("es")}`}</p>
              <ActorDetails actor={actor} />
            </div>
            <Link
              to={`edit/${actor.id}`}
              className="btn btn-outline-success m-2"
            >
              Editar
            </Link>
            <button
              onClick={() => onActorDelete(actor.id)}
              className="btn btn-outline-danger m-2"
            >
              Borrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
