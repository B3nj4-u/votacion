import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import votacion from "../abis/Votacion.json";
import cuenta from "../abis/Cuenta.json";
import Navigation from "./Navbar";

const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:7545`);
const privateKey =
  "0xec362c8b60288f86de32edff2a845407480eb611d71d0848543ff97847097275";
const wallet = new ethers.Wallet(privateKey, provider);

function UsuarioVota() {
  const location = useLocation();
  const navigate = useNavigate();
  const [account, setAccount] = useState(location.state.account);
  const [contractAddress, setContractAddress] = useState(
    location.state.contractAddress
  );
  const [votacionAddress, setVotacionAddress] = useState(
    location.state.votacionAddress
  );
  const [candidatos, setCandidatos] = useState([]);
  const [selectedCandidato, setSelectedCandidato] = useState(null);

  useEffect(() => {
    loadCandidatos();
  }, []);

  async function loadCandidatos() {
    try {
      const votacionContract = new ethers.Contract(
        votacionAddress,
        votacion.abi,
        wallet
      );
      const numCandidatos = await votacionContract.obtenerNumCandidatos();
      const candidatos = [];
      for (let i = 0; i < numCandidatos; i++) {
        const candidato = await votacionContract.candidatos(i);
        candidatos.push(candidato);
      }
      setCandidatos(candidatos);
    } catch (error) {
      console.error("Error loading candidatos: ", error);
    }
  }

  async function votar() {
    try {
      const cuentaContract = new ethers.Contract(
        contractAddress,
        cuenta.abi,
        wallet
      );
      await cuentaContract.votar(votacionAddress, selectedCandidato);

      const votacionContract = new ethers.Contract(
        votacionAddress,
        votacion.abi,
        wallet
      );
      await votacionContract.votar(selectedCandidato);

      alert("Voto registrado con éxito.");
      navigate("/Inicio", { state: { account, contractAddress } });
    } catch (error) {
      console.error("Error voting: ", error);
      alert("Ya has votado en esta votación.");
      navigate("/Inicio", { state: { account, contractAddress } });
    }
  }

  return (
    <div>
      <Navigation account={account} />
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h1>Selecciona un candidato para votar</h1>
            <Form>
              {candidatos.map((candidato, index) => (
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
              ))}
              <Button variant="primary" onClick={votar}>
                Votar
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UsuarioVota;
