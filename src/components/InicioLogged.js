import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Table, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faPoll } from "@fortawesome/free-solid-svg-icons";
import votacionFactory from "../abis/VotacionFactory.json";
import votacion from "../abis/Votacion.json";
import Navigation from "./Navbar";

const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:7545`);
const privateKey =
  "0xec362c8b60288f86de32edff2a845407480eb611d71d0848543ff97847097275";
const wallet = new ethers.Wallet(privateKey, provider);

function InicioLogged() {
  const location = useLocation();
  const [account, setAccount] = useState(location.state.account);
  const [contractAddress, setContractAddress] = useState(
    location.state.contractAddress
  );
  const [factory, setFactory] = useState(null);
  const [votaciones, setVotaciones] = useState([]);
  const [votacionesTerminadas, setVotacionesTerminadas] = useState([]);
  const [showCandidatos, setShowCandidatos] = useState(false);
  const [candidatosInfo, setCandidatosInfo] = useState([]);
  const [showHistorial, setShowHistorial] = useState(false);

  const handleCloseCandidatos = () => setShowCandidatos(false);
  const handleShowCandidatos = () => setShowCandidatos(true);
  const handleCloseHistorial = () => setShowHistorial(false);
  const handleShowHistorial = () => setShowHistorial(true);

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
  }

  async function loadVotaciones() {
    try {
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

          if (estado && !terminada) {
            votaciones.push({ nombre, direccion });
          }
        }
      }

      setVotaciones(votaciones);
    } catch (error) {
      console.error("Error loading votaciones: ", error);
    }
  }

  async function loadVotacionesTerminadas() {
    try {
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

          votaciones.push({ nombre, direccion });
        }
      }

      setVotacionesTerminadas(votaciones);
    } catch (error) {
      console.error("Error loading votaciones terminadas: ", error);
    }
  }

  async function verCandidatos(indice) {
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
  }

  async function verResultados(indice) {
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
  }

  return (
    <div>
      <Navigation account={account} />
      <h1>Bienvenido a VotoNaut, usuario.</h1>
      <h4>Su dirección es: {account}</h4>
      <Button variant="info" onClick={handleShowHistorial}>
        <FontAwesomeIcon icon={faHistory} />
        Historial de Votaciones
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {votaciones.map((votacion, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{votacion.nombre}</td>
              <td>{votacion.direccion}</td>
              <td>
                <Button variant="primary" onClick={() => verCandidatos(index)}>
                  Ver Candidatos
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showCandidatos} onHide={handleCloseCandidatos}>
        <Modal.Header closeButton>
          <Modal.Title>Candidatos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {candidatosInfo.map((info, index) => (
            <p key={index}>
              {info.candidato}: {info.votos} votos
            </p>
          ))}
        </Modal.Body>
      </Modal>
      <Modal show={showHistorial} onHide={handleCloseHistorial} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Historial de Votaciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {votacionesTerminadas.map((votacion, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{votacion.nombre}</td>
                  <td>{votacion.direccion}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => verResultados(index)}
                    >
                      <FontAwesomeIcon icon={faPoll} />
                      Ver Resultados
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default InicioLogged;
