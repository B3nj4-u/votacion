import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import votacion from "../abis/Votacion.json";
import votacionDHondt from "../abis/VotacionDHondt.json";
import cuenta from "../abis/Cuenta.json";
import Navigation from "./Navbar";
import UsuarioVotaForm from "./forms/UsuarioVotaForm";
import Cargando from "./Cargando";

const { ethers } = require("ethers");

require("dotenv").config();
const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const providerUrl = process.env.REACT_APP_PROVIDER_URL;
if (!providerUrl) {
  window.alert("Falta providerUrl. Verifica tu archivo .env.");
  process.exit(1);
}
if (!privateKey) {
  window.alert("Falta privateKey. Verifica tu archivo .env.");
  process.exit(1);
}
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);

function UsuarioVota() {
  const location = useLocation();
  const navigate = useNavigate();
  const [account] = useState(location.state.account);
  const [contractAddress] = useState(location.state.contractAddress);
  const [votacionAddress] = useState(location.state.votacionAddress);
  const [candidatos, setCandidatos] = useState([]);
  const [selectedCandidato, setSelectedCandidato] = useState({
    lista: null,
    candidato: null,
  });
  const [metodoConteo, setMetodoConteo] = useState("");
  const [votacionContract, setVotacionContract] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCandidatos() {
      try {
        setLoading(true);
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
        window.alert("Error loading candidatos: ", error);
      } finally {
        setLoading(false);
      }
    }

    loadCandidatos();
  }, []);

  async function votar() {
    try {
      setLoading(true);
      const cuentaContract = new ethers.Contract(
        contractAddress,
        cuenta.abi,
        wallet
      );
      const haVotado = await cuentaContract.comprobarVoto(votacionAddress);
      if (haVotado) {
        window.alert("Ya has votado en esta votación.");
        navigate("/Inicio", { state: { account, contractAddress } });
      } else {
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
            contractAddress,
            votacion: nombreVotacion,
            candidato: nombreCandidato,
          },
        });
      }
    } catch (error) {
      window.alert("Error voting: ", error);
      navigate("/Inicio", { state: { account, contractAddress } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navigation account={account} />
      {loading && <Cargando />}
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
