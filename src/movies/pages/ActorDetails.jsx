import { useState } from "react";
import Modal from "react-modal";
import { ActorsCard } from "../components/ActorsCard";

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
          <h3 className="text-secondary">{`${actor.name} advanced details`}</h3>
          <hr />
          <ActorsCard actor={actor} />

          <ul>
            <li>Name: {actor.name}</li>
            <li>Sex:</li>
            <li>Country:</li>
            <li>DOB:</li>
            <li>Height:</li>
            <li>Spouse:</li>
            <li>Children:</li>
            <li>Movies:</li>
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
