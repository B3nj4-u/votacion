// TablaVotacionesAdmin.js
import React from "react";
import { Table, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faStop } from "@fortawesome/free-solid-svg-icons";

function TablaVotacionesAdmin({
  votaciones,
  terminarVotacionPassword,
  setTerminarVotacionPassword,
  terminarVotacion,
  verDetalles,
}) {
  return (
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
        {votaciones.map((votacion, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{votacion.nombre}</td>
            <td>{votacion.descripcion}</td>
            <td>
              <Button variant="primary" onClick={() => verDetalles(index)}>
                <FontAwesomeIcon icon={faEye} /> Ver Detalles
              </Button>
              <Form.Control
                type="password"
                placeholder="Ingresa la contrasenia del administrador para terminar una votación"
                value={terminarVotacionPassword}
                onChange={(e) => setTerminarVotacionPassword(e.target.value)}
              />
              <Button variant="warning" onClick={() => terminarVotacion(index)}>
                <FontAwesomeIcon icon={faStop} /> Terminar Votación
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TablaVotacionesAdmin;
