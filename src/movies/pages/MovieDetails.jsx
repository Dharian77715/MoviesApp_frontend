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

export const MovieDetails = ({ movie }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [img, setImg] = useState([]);
  const [genres, setGenres] = useState([]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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
          <h3 className="text-secondary">{`${movie.title} detalles avanzados`}</h3>
          <hr />

          <div className="d-flex flex-column align-items-center">
            <h4>
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </h4>
            {img && (
              <img
                src={img}
                alt="Movie"
                style={{ maxWidth: "35%", marginTop: "10px" }}
                className="mx-auto d-block"
              />
            )}

            <div className="text-center">
              <hr />
              <h5>Información:</h5>
              <h6>
                <strong>Título:</strong> {movie.title}
              </h6>
              <h6>
                <strong>Genero:</strong>{" "}
                {genres.map(
                  ({ id, genre, active }, index) =>
                    active == 1 && (
                      <span key={id}>
                        {genre}
                        {index < genres.length - 1 && ", "}
                      </span>
                    )
                )}
              </h6>
              <h6>
                <strong>País:</strong> Lorem Aliquip
              </h6>
              <h6>
                <strong>Duración:</strong> {new Date().getSeconds() + 40}{" "}
                minutos
              </h6>
              <h6>
                <strong>Año:</strong>{" "}
                {new Date(movie.release_date).getFullYear()}
              </h6>
              <h6>
                <strong>Director:</strong> Aute Proident
              </h6>
              <h6>
                <strong>Elenco:</strong> Ipsum Aute, Amet Mollit, Dolor Eiusmod,
                Nulla Occaecat, Mollit Voluptate.
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
