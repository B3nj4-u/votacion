// ResultadosModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

function ResultadosModal({ showResultados, setShowResultados, resultados }) {
  return (
    <Modal show={showResultados} onHide={() => setShowResultados(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Resultados D'Hondt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table>
          <thead>
            <tr>
              <th>Lista</th>
              <th>Nombre</th>
              <th>Votos</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((lista, index) =>
              lista.candidatos.map((candidato, i) => (
                <tr key={index + "-" + i}>
                  {i === 0 && (
                    <td rowSpan={lista.candidatos.length}>{lista.lista}</td>
                  )}
                  <td>{candidato.nombre}</td>
                  <td>{candidato.votos}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowResultados(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResultadosModal;
