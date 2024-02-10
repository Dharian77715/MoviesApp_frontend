import { useState } from "react";
import Modal from "react-modal";

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
          <h3 className="text-secondary">{`Actors participating in ${movie.title}`}</h3>
          <hr />
          <ul>
            <li>Lista</li>
            <li>Lista</li>
            <li>Lista</li>
            <li>Lista</li>
            <li>Lista</li>
            <li>Lista</li>
            <li>Lista</li>
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
