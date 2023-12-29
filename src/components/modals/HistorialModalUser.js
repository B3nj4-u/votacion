import React from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function HistorialModalUser({ show, handleClose, votacionesTerminadas, verDetallesTerminadas }) {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Historial de Votaciones</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {votacionesTerminadas.map((votacion, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{votacion.nombre}</td>
                <td>{votacion.descripcion}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => verDetallesTerminadas(index)}
                  >
                    <FontAwesomeIcon icon={faEye} /> Ver Resultados
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

export default HistorialModalUser;
