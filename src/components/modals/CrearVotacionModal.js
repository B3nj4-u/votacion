// CrearVotacionModal.js
import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function CrearVotacionModal({
  show,
  handleClose,
  handleSubmit,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  metodoConteo,
  setMetodoConteo,
  candidatos,
  handleCandidatoChange1,
  handleAddCandidato1,
  handleRemoveCandidato1,
  listas,
  nombresDeListas,
  handleNombreListaChange,
  handleAddLista,
  handleRemoveLista,
  handleCandidatoChange,
  escanios,
  setEscanios,
  crearVotacionPassword,
  setCrearVotacionPassword,
  handleAddCandidato,
  handleRemoveCandidato
}) {
  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Votación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre de la votación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre de la votación"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción de la votación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la descripción de la votación"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formMetodoConteo">
              <Form.Label>Método de conteo</Form.Label>
              <Form.Control
                as="select"
                value={metodoConteo}
                onChange={(e) => setMetodoConteo(e.target.value)}
              >
                <option value="">Selecciona un método</option>
                <option value="mayoria-absoluta">Mayoría Absoluta</option>
                <option value="dhondt">D'Hondt</option>
              </Form.Control>
            </Form.Group>

            {metodoConteo === "mayoria-absoluta" &&
              candidatos.map((candidato, index) => (
                <Form.Group controlId={`formCandidato${index}`} key={index}>
                  <Form.Label>Candidato {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el nombre del candidato"
                    value={candidato}
                    onChange={(e) => handleCandidatoChange1(e, index)}
                  />
                  <Button variant="primary" onClick={handleAddCandidato1}>
                    Agregar candidato
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveCandidato1(index)}
                  >
                    Eliminar candidato
                  </Button>
                </Form.Group>
              ))}

            {metodoConteo === "dhondt" &&
              listas.map((lista, indexLista) => (
                <div key={indexLista}>
                  <h5>Lista {indexLista + 1}</h5>
                  <Form.Group controlId={`formNombreLista${indexLista}`}>
                    <Form.Label>Nombre de la lista</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingresa el nombre de la lista"
                      value={nombresDeListas[indexLista]}
                      onChange={(e) => handleNombreListaChange(e, indexLista)}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleAddLista}>
                    Agregar lista
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveLista(indexLista)}
                  >
                    Eliminar lista
                  </Button>
                  {lista.map((candidato, indexCandidato) => (
                    <Form.Group
                      controlId={`formCandidato${indexLista}${indexCandidato}`}
                      key={indexCandidato}
                    >
                      <Form.Label>Candidato {indexCandidato + 1}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa el nombre del candidato"
                        value={candidato}
                        onChange={(e) =>
                          handleCandidatoChange(e, indexLista, indexCandidato)
                        }
                      />
                      <Button
                        variant="primary"
                        onClick={() => handleAddCandidato(indexLista)}
                      >
                        Agregar candidato
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleRemoveCandidato(indexLista, indexCandidato)
                        }
                      >
                        Eliminar candidato
                      </Button>
                    </Form.Group>
                  ))}
                </div>
              ))}

            {metodoConteo === "dhondt" && (
              <div>
                <Form.Group controlId="formEscanios">
                  <Form.Label>Número de escanios</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={escanios}
                    onChange={(e) => setEscanios(e.target.value)}
                  />
                </Form.Group>
              </div>
            )}

            <Form.Control
              type="password"
              placeholder="Ingresa la contrasenia del administrador"
              value={crearVotacionPassword}
              onChange={(e) => setCrearVotacionPassword(e.target.value)}
            />

            <Button variant="success" type="submit">
              Confirmar y crear
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
  );
}

export default CrearVotacionModal;
