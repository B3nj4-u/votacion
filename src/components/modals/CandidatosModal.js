// CandidatosModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

function CandidatosModal({
  showCandidatos,
  handleCloseCandidatos,
  candidatosInfo,
}) {
  return (
    <Modal show={showCandidatos} onHide={handleCloseCandidatos}>
      <Modal.Header closeButton>
        <Modal.Title>Candidatos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {candidatosInfo.map((info, index) => (
          <p key={index}>
            {info.candidato}: {info.votos} votos
          </p>
        ))}
      </Modal.Body>
    </Modal>
  );
}

export default CandidatosModal;
