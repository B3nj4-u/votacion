import React from 'react';
import { Modal } from 'react-bootstrap';

const VotosModal = ({ showModal, setShowModal, votos }) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Votos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {votos &&
          votos.map((voto, index) => (
            <div key={index}>
              <h5>Votación: {voto.nombreVotacion}</h5>
              <p>Candidato: {voto.nombreCandidato}</p>
            </div>
          ))}
      </Modal.Body>
    </Modal>
  );
}

export default VotosModal;
