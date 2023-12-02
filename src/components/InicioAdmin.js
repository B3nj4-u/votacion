import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Table } from "react-bootstrap";
import votacionFactory from "../abis/VotacionFactory.json";
import votacion from "../abis/Votacion.json";
import Navigation from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faStop,
  faPlus,
  faTrash,
  faHistory,
  faPoll,
} from "@fortawesome/free-solid-svg-icons";

const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:7545`);
const privateKey =
  "0xec362c8b60288f86de32edff2a845407480eb611d71d0848543ff97847097275";
const wallet = new ethers.Wallet(privateKey, provider);

function InicioAdmin() {
  const [factory, setFactory] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [candidatos, setCandidatos] = useState([""]);
  const [show, setShow] = useState(false);
  const [votaciones, setVotaciones] = useState([]);
  const [showEliminar, setShowEliminar] = useState(false);
  const [votacionAEliminar, setVotacionAEliminar] = useState("");
  const [showCandidatos, setShowCandidatos] = useState(false);
  const [candidatosInfo, setCandidatosInfo] = useState([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [votacionesTerminadas, setVotacionesTerminadas] = useState([]);

  const handleCloseHistorial = () => setShowHistorial(false);
  const handleShowHistorial = () => setShowHistorial(true);
  const handleCloseCandidatos = () => setShowCandidatos(false);
  const handleShowCandidatos = () => setShowCandidatos(true);
  const handleCloseEliminar = () => setShowEliminar(false);
  const handleShowEliminar = () => setShowEliminar(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      console.log(
        "El contrato está funcionando bien. Address: ",
        address,
        " Abi: ",
        abi,
        " Wallet: ",
        wallet
      );
    } else {
      window.alert("¡El Smart Contract no se ha desplegado en la red!");
    }
  }

  async function terminarVotacion(indice) {
    try {
      let tx = await factory.terminarVotacion(indice);
      await tx.wait();
      loadVotaciones(); // Actualiza las votaciones después de terminar una
      loadVotacionesTerminadas();
      alert(
        "La votación ha terminado. Los resultados son: " +
          JSON.stringify(candidatosInfo)
      );
    } catch (error) {
      console.error("Error terminando votacion: ", error);
    }
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

  async function loadVotaciones() {
    try {
      console.log("Cargando votaciones...");
      const votaciones = [];
      const ultimoIndice = await factory.ultimoIndice();
      console.log(`Hay ${ultimoIndice} votaciones en total.`);

      for (let i = 0; i < ultimoIndice; i++) {
        console.log(`Cargando votacion ${i}...`);
        const direccion = await factory.obtenerVotacion(i);
        if (direccion) {
          const votacionContract = new ethers.Contract(
            direccion,
            votacion.abi,
            wallet
          );
          const nombre = await votacionContract.nombre();
          const estado = await votacionContract.obtenerEstado();
          const descripcion = await votacionContract.obtenerDescripcion(); // Obtén la descripción aquí
          const terminada = await votacionContract.obtenerTerminada();

          console.log(
            `Votacion ${i}: nombre=${nombre}, estado=${estado}, terminada=${terminada}, descripcion=${descripcion}`
          );

          if (estado && !terminada) {
            console.log(`La votacion ${i} está en curso.`);
            votaciones.push({ nombre, direccion, descripcion }); // Incluye la descripción aquí
          }
        }
      }

      setVotaciones(votaciones);
      if (votaciones.length > 0) {
        setVotacionAEliminar("0"); // Inicializa votacionAEliminar con el índice de la primera votación
      }
      console.log("Votaciones cargadas.");
    } catch (error) {
      console.error("Error loading votaciones: ", error);
    }
  }

  async function loadVotacionesTerminadas() {
    try {
      console.log("Cargando votaciones terminadas...");
      const votaciones = [];
      const ultimoIndice = await factory.ultimoIndiceTerminadas();
      console.log(`Hay ${ultimoIndice} votaciones terminadas en total.`);

      for (let i = 0; i < ultimoIndice; i++) {
        console.log(`Cargando votacion terminada ${i}...`);
        const direccion = await factory.obtenerVotacionTerminada(i);
        if (direccion) {
          const votacionContract = new ethers.Contract(
            direccion,
            votacion.abi,
            wallet
          );
          const nombre = await votacionContract.nombre();
          const descripcion = await votacionContract.obtenerDescripcion(); // Obtén la descripción aquí
          console.log(
            `Votacion terminada ${i}: nombre=${nombre}, descripcion=${descripcion}`
          );

          votaciones.push({ nombre, direccion, descripcion }); // Incluye la descripción aquí
        }
      }

      setVotacionesTerminadas(votaciones);
      console.log("Votaciones terminadas cargadas.");
    } catch (error) {
      console.error("Error loading votaciones terminadas: ", error);
    }
  }

  async function crearVotacion(nombre, candidatos, descripcion) {
    try {
      let tx = await factory.crearVotacion(nombre, candidatos, descripcion);
      await tx.wait();
      loadVotaciones(); // Actualiza las votaciones después de crear una nueva
    } catch (error) {
      console.error("Error creating votacion: ", error);
    }
    console.log(descripcion);
  }

  async function eliminarVotacion(indice) {
    try {
      let tx = await factory.eliminarVotacion(indice);
      await tx.wait();
      loadVotaciones(); // Actualiza las votaciones después de eliminar una
    } catch (error) {
      console.error("Error eliminando votacion: ", error);
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

  async function handleSubmitEliminar(event) {
    event.preventDefault();
    if (votacionAEliminar !== "") {
      try {
        await eliminarVotacion(votacionAEliminar);
        handleCloseEliminar();
      } catch (error) {
        console.error("Error submitting form: ", error);
      }
    } else {
      console.error("No se seleccionó ninguna votación para eliminar.");
    }
  }

  function handleAddCandidato() {
    setCandidatos([...candidatos, ""]);
  }

  function handleRemoveCandidato(index) {
    const newCandidatos = [...candidatos];
    newCandidatos.splice(index, 1);
    setCandidatos(newCandidatos);
  }

  function handleCandidatoChange(event, index) {
    const newCandidatos = [...candidatos];
    newCandidatos[index] = event.target.value;
    setCandidatos(newCandidatos);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await crearVotacion(nombre, candidatos, descripcion);
    handleClose();
  }

  return (
    <div>
      <Navigation account={"Administrador"} />
      <h1>Bienvenido administrador </h1>
      <h4>Estado del contrato: True</h4>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Button variant="primary" onClick={handleShow}>
            <FontAwesomeIcon icon={faPlus} /> Crear Votación
          </Button>
          <Button variant="danger" onClick={handleShowEliminar}>
            <FontAwesomeIcon icon={faTrash} /> Eliminar Votación
          </Button>
        </div>
        <Button variant="info" onClick={handleShowHistorial}>
          <FontAwesomeIcon icon={faHistory} /> Historial de Votaciones
        </Button>
      </div>

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

            {candidatos.map((candidato, index) => (
              <Form.Group controlId={`formCandidato${index}`} key={index}>
                <Form.Label>Candidato {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el nombre del candidato"
                  value={candidato}
                  onChange={(e) => handleCandidatoChange(e, index)}
                />
                <Button
                  variant="danger"
                  onClick={() => handleRemoveCandidato(index)}
                >
                  Eliminar candidato
                </Button>
              </Form.Group>
            ))}

            <Button variant="primary" onClick={handleAddCandidato}>
              Agregar candidato
            </Button>

            <Button variant="success" type="submit">
              Confirmar y crear
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEliminar} onHide={handleCloseEliminar}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Votación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEliminar}>
            <Form.Group controlId="formEliminar">
              <Form.Label>Selecciona la votación a eliminar</Form.Label>
              <Form.Control
                as="select"
                value={votacionAEliminar}
                onChange={(e) => setVotacionAEliminar(e.target.value)}
              >
                {votaciones.map((votacion, index) => (
                  <option key={index} value={index}>
                    {votacion.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="danger" type="submit">
              Confirmar y eliminar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {votacionesTerminadas.map((votacion, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{votacion.nombre}</td>
                  <td>{votacion.descripcion}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => verResultados(index)}
                    >
                      <FontAwesomeIcon icon={faPoll} /> Ver Resultados
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

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
                  <FontAwesomeIcon icon={faEye} /> Ver Detalles
                </Button>
                <Button
                  variant="warning"
                  onClick={() => terminarVotacion(index)}
                >
                  <FontAwesomeIcon icon={faStop} /> Terminar Votación
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default InicioAdmin;
