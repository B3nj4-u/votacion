import React from 'react';
import { Form, Button } from 'react-bootstrap';

const ConsultaVotoForm = ({ direccionUsuario, setDireccionUsuario, handleConsulta }) => {
  return (
    <Form onSubmit={handleConsulta}>
      <Form.Group controlId="formDireccionUsuario">
        <Form.Label>Dirección del Usuario</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa la dirección del usuario"
          value={direccionUsuario}
          onChange={(e) => setDireccionUsuario(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Consultar Votos
      </Button>
    </Form>
  );
}

export default ConsultaVotoForm;
