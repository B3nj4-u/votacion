import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Table, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHistory, faVoteYea } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import votacionFactory from "../abis/VotacionFactory.json";
import votacion from "../abis/Votacion.json";
import votacionDHondt from "../abis/VotacionDHondt.json";
import cuenta from "../abis/Cuenta.json";
import Navigation from "./Navbar";
import dhondt from "dhondt";
import CandidatosModalUser from "./modals/CandidatosModalUser";
import HistorialModalUser from "./modals/HistorialModalUser";
import TablaVotacionesUser from "./tables/TablaVotacionesUser";
import Cargando from "./Cargando";

const { ethers } = require("ethers");
require("dotenv").config();
const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const providerUrl = process.env.REACT_APP_PROVIDER_URL;
if (!providerUrl) {
  console.error("Falta providerUrl. Verifica tu archivo .env.");
  process.exit(1);
}
if (!privateKey) {
  console.error("Falta privateKey. Verifica tu archivo .env.");
  process.exit(1);
}
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);

function InicioLogged() {
  const location = useLocation();
  const [account, setAccount] = useState(location.state.account);
  const [contractAddress, setContractAddress] = useState(
    location.state.contractAddress
  );
  console.log(contractAddress);
  const [factory, setFactory] = useState(null);
  const [votaciones, setVotaciones] = useState([]);
  const [votacionesTerminadas, setVotacionesTerminadas] = useState([]);
  const [showCandidatos, setShowCandidatos] = useState(false);
  const [candidatosInfo, setCandidatosInfo] = useState([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCloseCandidatos = () => setShowCandidatos(false);
  const handleShowCandidatos = () => setShowCandidatos(true);
  const handleCloseHistorial = () => setShowHistorial(false);
  const handleShowHistorial = () => setShowHistorial(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadBlockchainData();
  }, []);

  useEffect(() => {
    if (factory) {
      loadVotaciones();
      loadVotacionesTerminadas();
    }
  }, [factory]);

  async function loadBlockchainData() {
    try {
      setLoading(true);
      const networkId = 5777; // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
      const networkData = votacionFactory.networks[networkId];

      if (networkData) {
        const abi = votacionFactory.abi;
        const address = networkData.address;
        const factory = new ethers.Contract(address, abi, wallet);
        setFactory(factory);
      } else {
        window.alert("¡El Smart Contract no se ha desplegado en la red!");
      }
    } catch (error) {
      console.error("Error loading blockchain data: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadVotaciones() {
    try {
      setLoading(true);
      const votaciones = [];
      const ultimoIndice = await factory.ultimoIndice();
      for (let i = 0; i < ultimoIndice; i++) {
        const direccion = await factory.obtenerVotacion(i);
        if (direccion) {
          const votacionContract = new ethers.Contract(
            direccion,
            votacion.abi,
            wallet
          );
          const nombre = await votacionContract.nombre();
          const estado = await votacionContract.obtenerEstado();
          const terminada = await votacionContract.obtenerTerminada();
          const descripcion = await votacionContract.obtenerDescripcion();

          if (estado && !terminada) {
            votaciones.push({ nombre, direccion, descripcion });
          }
        }
      }
      setVotaciones(votaciones);
    } catch (error) {
      console.error("Error loading votaciones: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadVotacionesTerminadas() {
    try {
      setLoading(true);
      const votaciones = [];
      const ultimoIndice = await factory.ultimoIndiceTerminadas();

      for (let i = 0; i < ultimoIndice; i++) {
        const direccion = await factory.obtenerVotacionTerminada(i);
        if (direccion) {
          const votacionContract = new ethers.Contract(
            direccion,
            votacion.abi,
            wallet
          );
          const nombre = await votacionContract.nombre();
          const descripcion = await votacionContract.obtenerDescripcion();

          votaciones.push({ nombre, direccion, descripcion });
        }
      }

      setVotacionesTerminadas(votaciones);
    } catch (error) {
      console.error("Error loading votaciones terminadas: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function verCandidatos(indice) {
    try {
      setLoading(true);
      const votacionContract = new ethers.Contract(
        votaciones[indice].direccion,
        votacion.abi,
        wallet
      );
      const numCandidatos = await votacionContract.obtenerNumCandidatos();
      const candidatosYVotos = [];
      for (let i = 0; i < numCandidatos; i++) {
        const candidato = await votacionContract.candidatos(i);
        const votos = (await votacionContract.obtenerVotos(i)).toNumber();
        candidatosYVotos.push({ candidato, votos });
      }
      setCandidatosInfo(candidatosYVotos);
      handleShowCandidatos();
    } catch (error) {
      console.error("Error viewing candidates: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function irAVotar(indice) {
    try {
      setLoading(true);
      const votacionDireccion = votaciones[indice].direccion;
      const cuentaContract = new ethers.Contract(
        contractAddress,
        cuenta.abi,
        wallet
      );
      const haVotado = await cuentaContract.comprobarVoto(votacionDireccion);
      if (haVotado) {
        alert("Ya has votado en esta votación.");
      } else {
        navigate("/votacion", {
          state: {
            account,
            votacionAddress: votacionDireccion,
            contractAddress,
          },
        });
      }
    } catch (error) {
      console.error("Error going to vote: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function verDetallesTerminadas(indice) {
    try {
      setLoading(true);
      const votacionContract = new ethers.Contract(
        votacionesTerminadas[indice].direccion,
        votacion.abi,
        wallet
      );
      const metodoConteo = await votacionContract.obtenerMetodoConteo();
      console.log(metodoConteo);

      if (metodoConteo === "mayoria-absoluta") {
        verResultados(indice);
      } else if (metodoConteo === "dhondt") {
        obtenerResultadosDhondtTerminada(indice);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function verResultados(indice) {
    try {
      setLoading(true);
      const votacionContract = new ethers.Contract(
        votacionesTerminadas[indice].direccion,
        votacion.abi,
        wallet
      );
      const numCandidatos = await votacionContract.obtenerNumCandidatos();
      const candidatosYVotos = [];
      for (let i = 0; i < numCandidatos; i++) {
        const candidato = await votacionContract.candidatos(i);
        const votos = (await votacionContract.obtenerVotos(i)).toNumber();
        candidatosYVotos.push({ candidato, votos });
      }
      alert("Los resultados son: " + JSON.stringify(candidatosYVotos));
    } catch (error) {
      console.error("Error viewing results: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function obtenerResultadosDhondtTerminada(indice) {
    try {
      setLoading(true);
      console.log("Iniciando obtenerResultadosDhondt...");

      const votacionContract = new ethers.Contract(
        votacionesTerminadas[indice].direccion,
        votacionDHondt.abi,
        wallet
      );

      console.log("Contrato obtenido:", votacionContract);

      // Obtén todos los votos individuales de cada candidato en cada lista
      const votosDhondtBigNumber =
        await votacionContract.obtenerTodosLosVotos();
      const votosPorCandidato = votosDhondtBigNumber.map((lista) =>
        lista.map((voto) => voto.toNumber())
      );

      // Suma los votos de cada candidato en una lista para obtener el total de votos de cada lista
      const votosPorLista = votosPorCandidato.map((votosLista) =>
        votosLista.reduce((a, b) => a + b, 0)
      );

      console.log("Votos por lista:", votosPorLista);

      // Obtener los escaños
      const escanios = await votacionContract.obtenerEscanios();
      console.log("Escanios:", escanios);

      // Calcula los escaños usando la biblioteca dhondt
      const asignacion = dhondt.compute(votosPorLista, escanios);
      console.log("Asignación:", asignacion);

      let mensaje = "";
      for (let i = 0; i < asignacion.length; i++) {
        if (asignacion[i] > 0) {
          const nombreLista = await votacionContract.obtenerNombreLista(i);
          const numCandidatos =
            await votacionContract.obtenerNumCandidatosLista(i);
          let candidatos = [];
          for (let j = 0; j < numCandidatos; j++) {
            const candidato = await votacionContract.obtenerCandidatoLista(
              i,
              j
            );
            const votosCandidato = votosPorCandidato[i][j];
            candidatos.push({ nombre: candidato, votos: votosCandidato });
          }
          // Ordena los candidatos por votos en orden descendente
          candidatos.sort((a, b) => b.votos - a.votos);
          // Selecciona solo los candidatos que fueron electos
          const candidatosElectos = candidatos.slice(0, asignacion[i]);
          for (let k = 0; k < candidatosElectos.length; k++) {
            mensaje += `Lista: ${nombreLista}, Candidato: ${candidatosElectos[k].nombre}, Escaños: ${asignacion[i]}, Votos: ${candidatosElectos[k].votos}\n`;
          }
        }
      }

      console.log("Mensaje final:", mensaje);
      alert(mensaje);
    } catch (error) {
      console.error("Error en obtenerResultadosDhondt:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <Navigation account={account} />
      <h1>Bienvenido a VotoNaut, usuario.</h1>
      <h4>Su dirección es: {account}</h4>
      <Button variant="info" onClick={handleShowHistorial}>
        <FontAwesomeIcon icon={faHistory} /> Historial de Votaciones
      </Button>
      {loading && <Cargando />}
      <TablaVotacionesUser
        votaciones={votaciones}
        verCandidatos={verCandidatos}
        irAVotar={irAVotar}
      />
      <CandidatosModalUser
        show={showCandidatos}
        handleClose={handleCloseCandidatos}
        candidatosInfo={candidatosInfo}
      />
      <HistorialModalUser
        show={showHistorial}
        handleClose={handleCloseHistorial}
        votacionesTerminadas={votacionesTerminadas}
        verDetallesTerminadas={verDetallesTerminadas}
      />
    </div>
  );
}

export default InicioLogged;
