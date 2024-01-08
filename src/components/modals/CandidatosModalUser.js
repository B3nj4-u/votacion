import React from "react";
import { Modal } from "react-bootstrap";

function CandidatosModalUser({ show, handleClose, candidatosInfo }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Candidatos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {candidatosInfo.map((info, index) => (
          <p key={index}>{info.candidato}</p>
        ))}
      </Modal.Body>
    </Modal>
  );
}

export default CandidatosModalUser;
