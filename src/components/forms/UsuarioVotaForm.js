import React from "react";
import { Form, Button } from "react-bootstrap";

const UsuarioVotaForm = ({
  metodoConteo,
  candidatos,
  selectedCandidato,
  setSelectedCandidato,
  votar,
}) => (
  <Form>
    {metodoConteo === "mayoria-absoluta" ? (
      candidatos.map((candidato, index) => (
        <div key={index} className="mb-3">
          <Form.Check
            type="radio"
            id={`candidato-${index}`}
            name="candidato"
            label={candidato}
            value={index}
            onChange={() => setSelectedCandidato(index)}
          />
        </div>
      ))
    ) : (
      candidatos.map((lista, indexLista) => (
        <div key={indexLista}>
          <h2>Lista {indexLista + 1}</h2>
          {lista.map((candidato, indexCandidato) => (
            <div key={indexCandidato} className="mb-3">
              <Form.Check
                type="radio"
                id={`candidato-${indexLista}-${indexCandidato}`}
                name="candidato"
                label={candidato}
                value={`${indexLista}-${indexCandidato}`}
                onChange={(e) => {
                  const [lista, candidato] = e.target.value.split("-");
                  setSelectedCandidato({
                    lista: parseInt(lista),
                    candidato: parseInt(candidato),
                  });
                }}
              />
            </div>
          ))}
        </div>
      ))
    )}
    <Button variant="primary" onClick={votar}>
      Votar
    </Button>
  </Form>
);

export default UsuarioVotaForm;
