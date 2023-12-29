import React from "react";
import { Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faVoteYea } from "@fortawesome/free-solid-svg-icons";

function TablaVotacionesUser({ votaciones, verCandidatos, irAVotar }) {
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
              <Button variant="primary" onClick={() => verCandidatos(index)}>
                <FontAwesomeIcon icon={faEye} /> Ver Candidatos
              </Button>
              <Button variant="success" onClick={() => irAVotar(index)}>
                <FontAwesomeIcon icon={faVoteYea} /> Ir a Votar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TablaVotacionesUser;
