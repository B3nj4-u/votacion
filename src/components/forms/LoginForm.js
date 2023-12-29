// LoginForm.js
import React from "react";
import { Form, Button } from "react-bootstrap";

function LoginForm({ handleLogin, direccionUsuario, setDireccionUsuario, contrasena, setContrasena }) {
  return (
    <Form onSubmit={handleLogin}>
      <Form.Group controlId="formDireccionUsuario">
        <Form.Label>Dirección del Usuario</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa la dirección del usuario"
          value={direccionUsuario}
          onChange={(e) => setDireccionUsuario(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formContrasenaLogin">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Ingresa tu contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Iniciar Sesión
      </Button>
    </Form>
  );
}

export default LoginForm;
