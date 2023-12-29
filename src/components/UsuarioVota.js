import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import votacion from "../abis/Votacion.json";
import votacionDHondt from "../abis/VotacionDHondt.json";
import cuenta from "../abis/Cuenta.json";
import Navigation from "./Navbar";
import UsuarioVotaForm from "./forms/UsuarioVotaForm";

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
  const [selectedCandidato, setSelectedCandidato] = useState({
    lista: null,
    candidato: null,
  });
  const [metodoConteo, setMetodoConteo] = useState("");
  const [votacionContract, setVotacionContract] = useState(null);

  useEffect(() => {
    async function loadCandidatos() {
      try {
        let contractInstance;
        let votacionContract = new ethers.Contract(
          votacionAddress,
          votacion.abi,
          wallet
        );
        const metodo = await votacionContract.obtenerMetodoConteo();
        setMetodoConteo(metodo);

        if (metodo === "mayoria-absoluta") {
          contractInstance = votacionContract;
          const numCandidatos = await votacionContract.obtenerNumCandidatos();
          const candidatos = [];
          for (let i = 0; i < numCandidatos; i++) {
            const candidato = await votacionContract.candidatos(i);
            candidatos.push(candidato);
          }
          setCandidatos(candidatos);
        } else if (metodo === "dhondt") {
          contractInstance = new ethers.Contract(
            votacionAddress,
            votacionDHondt.abi,
            wallet
          );
          const numListas = await contractInstance.obtenerNumListas();
          const candidatosPorLista = [];
          for (let i = 0; i < numListas; i++) {
            const numCandidatos =
              await contractInstance.obtenerNumCandidatosLista(i);
            const candidatos = [];
            for (let j = 0; j < numCandidatos; j++) {
              const candidato = await contractInstance.obtenerCandidatoLista(
                i,
                j
              );
              candidatos.push(candidato);
            }
            candidatosPorLista.push(candidatos);
          }
          setCandidatos(candidatosPorLista);
        }
        setVotacionContract(contractInstance);
      } catch (error) {
        console.error("Error loading candidatos: ", error);
      }
    }

    loadCandidatos();
  }, []);

  async function votar() {
    try {
      const cuentaContract = new ethers.Contract(
        contractAddress,
        cuenta.abi,
        wallet
      );

      const nombreVotacion = await votacionContract.obtenerNombre();
      let nombreCandidato;
      let candidatoIndex;
      let listaIndex;

      if (metodoConteo === "mayoria-absoluta") {
        nombreCandidato = candidatos[selectedCandidato];
        candidatoIndex = selectedCandidato;
        await votacionContract.votar(candidatoIndex);
      } else if (metodoConteo === "dhondt") {
        nombreCandidato =
          candidatos[selectedCandidato.lista][selectedCandidato.candidato];
        candidatoIndex = selectedCandidato.candidato;
        listaIndex = selectedCandidato.lista;
        await votacionContract.votarDhondt(listaIndex, candidatoIndex);
      }

      await cuentaContract.votar(
        votacionAddress,
        candidatoIndex,
        nombreCandidato,
        nombreVotacion
      );

      alert("Voto registrado con éxito.");
      navigate("/Boleta", {
        state: {
          account,
          votacion: nombreVotacion,
          candidato: nombreCandidato,
        },
      });
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
            <UsuarioVotaForm
              metodoConteo={metodoConteo}
              candidatos={candidatos}
              selectedCandidato={selectedCandidato}
              setSelectedCandidato={setSelectedCandidato}
              votar={votar}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UsuarioVota;
