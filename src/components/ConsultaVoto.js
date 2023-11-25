import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import cuentaFactory from "../abis/CuentaFactory.json";
import cuenta from "../abis/Cuenta.json";
import Navigation from "./Navbar";

const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:7545`);
const privateKey =
  "0xec362c8b60288f86de32edff2a845407480eb611d71d0848543ff97847097275";
const wallet = new ethers.Wallet(privateKey, provider);

function ConsultaVoto() {
  const [direccionUsuario, setDireccionUsuario] = useState("");
  const [votos, setVotos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  async function handleConsulta(event) {
    event.preventDefault();
    try {
      // Aquí es donde instancias el contrato CuentaFactory y llamas a la función para obtener la dirección del contrato
      const networkId = 5777; // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
      const networkData = cuentaFactory.networks[networkId];

      if (networkData) {
        const abi = cuentaFactory.abi;
        const address = networkData.address;
        const contract = new ethers.Contract(address, abi, wallet);
        const direccionContrato = await contract.obtenerDireccionContrato(
          direccionUsuario
        );
        // Instancia el contrato Cuenta y obtén los votos del usuario
        const cuentaContract = new ethers.Contract(
          direccionContrato,
          cuenta.abi,
          wallet
        );
        const votos = await cuentaContract.obtenerVotos();
        // Muestra los votos en un modal
        setVotos(votos);
        setShowModal(true);
      } else {
        window.alert("¡El Smart Contract no se ha desplegado en la red!");
      }
    } catch (error) {
      console.error("Error al consultar los votos: ", error);
    }
  }

  return (
    <div>
      <Navigation account={"No hay sesión"} />

      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
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
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Votos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {votos &&
                    votos.map((voto, index) => (
                      <div key={index}>
                        <h5>Votación: {voto.nombreVotacion}</h5>
                        <p>Candidato: {voto.nombreCandidato}</p>
                      </div>
                    ))}
                </Modal.Body>
              </Modal>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ConsultaVoto;
