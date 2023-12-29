// AdminLoginModal.js
import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

function AdminLoginModal({ showAdminLoginModal, handleCloseAdminLoginModal, handleSubmitAdminLogin }) {
  return (
    <Modal show={showAdminLoginModal} onHide={handleCloseAdminLoginModal}>
      <Modal.Header closeButton>
        <Modal.Title>Contraseña del administrador</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmitAdminLogin}>
          <Form.Group controlId="formAdminPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa la contraseña del administrador"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Confirmar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AdminLoginModal;
