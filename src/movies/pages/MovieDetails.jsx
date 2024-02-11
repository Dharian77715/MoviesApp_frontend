import { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { MoviesCard } from "../components/MoviesCard";

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
  const navigate = useNavigate();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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
          <h3 className="text-secondary">{`${movie.title} advanced details`}</h3>
          <hr />
          <MoviesCard movie={movie} />
          <ul>
            <li>Title: {movie.title}</li>
            <li>Genre:</li>
            <li>Country:</li>
            <li>Duration:</li>
            <li>Year:</li>
            <li>Director:</li>
            <li>Cast:</li>
          </ul>
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
