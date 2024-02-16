import { useEffect, useState } from "react";
import Modal from "react-modal";
import { moviesApi } from "../../api/moviesApi";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

export const ActorDetails = ({ actor }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [img, setImg] = useState([]);
  const [sex, setSex] = useState([]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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
    <div>
      <small className="text-primary" onClick={openModal}>
        More...
      </small>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={200}
      >
        <div>
          <h3 className="text-secondary">{`${actor.name} detalles avanzados`}</h3>
          <hr />

          <div className="d-flex flex-column align-items-center">
            <h4>{actor.name}</h4>
            {img && (
              <img
                src={img}
                alt="Actor"
                style={{ maxWidth: "35%", marginTop: "10px" }}
                className="mx-auto d-block"
              />
            )}

            <div className="text-center">
              <hr />
              <h5>Información:</h5>

              <h6>
                <strong>Nombre:</strong> {actor.name}
              </h6>

              <h6>
                <strong>Nacimiento:</strong>{" "}
                {new Date(actor.date_of_birth).toLocaleDateString()}
              </h6>

              <h6>
                <strong>Sexo:</strong> {sex.sex_name}
              </h6>

              <h6>
                <strong>Cónyuge:</strong> Aute ut aute proident
              </h6>

              <h6>
                <strong>Hijos:</strong> Aliqua Sunt, Nostrud Anim, Sint Veniam
              </h6>

              <h6>
                <strong>País:</strong> Lorem aliquip
              </h6>

              <h6>
                <strong>Películas:</strong> Ipsum Aute, Amet Mollit, Dolor
                Eiusmod, Nulla Occaecat, Mollit Voluptate.
              </h6>
            </div>
          </div>
          <br />

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
