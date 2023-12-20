// EliminarVotacionModal.js
import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function EliminarVotacionModal({
  showEliminar,
  handleCloseEliminar,
  handleSubmitEliminar,
  votacionAEliminar,
  setVotacionAEliminar,
  eliminarVotacionPassword,
  setEliminarVotacionPassword,
  votaciones,
}) {
  return (
    <Modal show={showEliminar} onHide={handleCloseEliminar}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Votación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEliminar}>
            <Form.Group controlId="formEliminar">
              <Form.Label>Selecciona la votación a eliminar</Form.Label>
              <Form.Control
                as="select"
                value={votacionAEliminar}
                onChange={(e) => setVotacionAEliminar(e.target.value)}
              >
                {votaciones.map((votacion, index) => (
                  <option key={index} value={index}>
                    {votacion.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Control
              type="password"
              placeholder="Ingresa la contrasenia del administrador"
              value={eliminarVotacionPassword}
              onChange={(e) => setEliminarVotacionPassword(e.target.value)}
            />
            <Button variant="danger" type="submit">
              Confirmar y eliminar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
  );
}

export default EliminarVotacionModal;
