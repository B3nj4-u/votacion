import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

function CrearCuentaModal({
  showModal,
  setShowModal,
  handleSubmit,
  nombre,
  setNombre,
  rut,
  setRut,
  fechaNacimiento,
  setFechaNacimiento,
  contrasena,
  setContrasena,
}) {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Cuenta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formRut">
            <Form.Label>RUT</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu RUT"
              name="rut"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formFechaNacimiento">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="date"
              placeholder="Ingresa tu fecha de nacimiento"
              name="fechaNacimiento"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formContrasena">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Crear Cuenta
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CrearCuentaModal;
