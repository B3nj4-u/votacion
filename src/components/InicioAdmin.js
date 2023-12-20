import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import votacionFactory from "../abis/VotacionFactory.json";
import votacion from "../abis/Votacion.json";
import votacionDHondt from "../abis/VotacionDHondt.json";
import Navigation from "./Navbar";
import CrearVotacionModal from "./modals/CrearVotacionModal";
import EliminarVotacionModal from "./modals/EliminarVotacionModal";
import TablaVotacionesAdmin from "./tables/TablaVotacionesAdmin";
import HistorialModal from "./modals/HistorialModal";
import CandidatosModal from "./modals/CandidatosModal";
import ResultadosModal from "./modals/ResultadosModal";
import dhondt from "dhondt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faHistory } from "@fortawesome/free-solid-svg-icons";
require("dotenv").config();
const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

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
  const [crearVotacionPassword, setCrearVotacionPassword] = useState("");
  const [eliminarVotacionPassword, setEliminarVotacionPassword] = useState("");
  const [terminarVotacionPassword, setTerminarVotacionPassword] = useState("");
  const [metodoConteo, setMetodoConteo] = useState("");
  const [listas, setListas] = useState([[""]]);
  const [escanios, setEscanios] = useState(1);
  const [resultados, setResultados] = useState([]);
  const [showResultados, setShowResultados] = useState(false);
  const [nombresDeListas, setNombresDeListas] = useState([]);

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

  /////////////////////////////////////////////////////
  //Creación, Eliminación y Terminación de Votaciones//
  ////////////////////////////////////////////////////
  async function crearVotacionDhondt(
    nombre,
    listas,
    nombresDeListas,
    descripcion,
    escanios
  ) {
    if (crearVotacionPassword !== adminPassword) {
      alert("Contrasenia incorrecta!");
      return;
    }
    try {
      let tx = await factory.crearVotacionDhondt(
        nombre,
        listas,
        nombresDeListas, // Añade esta línea
        descripcion,
        escanios
      );
      await tx.wait();
      let ultimoIndice = await factory.ultimoIndice();
      let votacionAddress = await factory.obtenerVotacion(ultimoIndice - 1);

      console.log("Dirección de la votación creada: ", votacionAddress);
      loadVotaciones(); // Actualiza las votaciones después de crear una nueva
    } catch (error) {
      console.error("Error creating votacion: ", error);
    }
    setCrearVotacionPassword("");
  }

  async function crearVotacion(nombre, candidatos, descripcion) {
    if (crearVotacionPassword !== adminPassword) {
      alert("Contrasenia incorrecta!");
      return;
    }
    try {
      let tx = await factory.crearVotacion(nombre, candidatos, descripcion);
      await tx.wait();
      loadVotaciones(); // Actualiza las votaciones después de crear una nueva
    } catch (error) {
      console.error("Error creating votacion: ", error);
    }
    console.log(descripcion);
    setCrearVotacionPassword("");
  }

  async function eliminarVotacion(indice) {
    if (eliminarVotacionPassword !== adminPassword) {
      alert("Contrasenia incorrecta!");
      return;
    }
    try {
      let tx = await factory.eliminarVotacion(indice);
      await tx.wait();
      loadVotaciones(); // Actualiza las votaciones después de eliminar una
    } catch (error) {
      console.error("Error eliminando votacion: ", error);
    }
    setEliminarVotacionPassword("");
  }

  async function terminarVotacion(indice) {
    if (terminarVotacionPassword !== adminPassword) {
      alert("Contrasenia incorrecta!");
      return;
    }
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
    setTerminarVotacionPassword("");
  }

  ////////////////////////////////
  // Visualizacion de las tablas//
  ///////////////////////////////

  async function loadVotaciones() {
    console.log("contrasenia: ", adminPassword);
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

  //////////////////////////
  // Obtención de Detalles//
  //////////////////////////
  async function verDetalles(indice) {
    const votacionContract = new ethers.Contract(
      votaciones[indice].direccion,
      votacion.abi,
      wallet
    );
    const metodoConteo = await votacionContract.obtenerMetodoConteo();
    console.log(metodoConteo);

    if (metodoConteo === "mayoria-absoluta") {
      console.log(indice);
      verCandidatos(indice);
    } else if (metodoConteo === "dhondt") {
      console.log(indice);
      obtenerResultadosDhondt(indice);
    }
  }

  async function verDetallesTerminadas(indice) {
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

  async function obtenerResultadosDhondtTerminada(indice) {
    try {
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

      const resultados = [];
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
          resultados.push({
            lista: nombreLista,
            candidatos: candidatosElectos,
          });
        }
      }

      console.log("Resultados:", resultados);

      // Actualiza el estado de los resultados y muestra el modal de resultados
      setResultados(resultados);
      setShowResultados(true);
      console.log("Estado actualizado, modal debería mostrarse");

      // Cierra el modal actual
      handleClose();
    } catch (error) {
      console.error("Error en obtenerResultadosDhondt:", error);
    }
  }

  async function obtenerResultadosDhondt(indice) {
    try {
      const votacionContract = new ethers.Contract(
        votaciones[indice].direccion,
        votacionDHondt.abi,
        wallet
      );
  
      const numListas = await votacionContract.obtenerNumListas();
      let resultados = [];
  
      for (let i = 0; i < numListas; i++) {
        let lista = await votacionContract.obtenerNombreLista(i);
        let votosLista = await votacionContract.obtenerVotosLista(i);
        let numCandidatos = await votacionContract.obtenerNumCandidatosLista(i);
        let candidatos = [];
  
        for (let j = 0; j < numCandidatos; j++) {
          let nombreCandidato = await votacionContract.obtenerCandidatoLista(i, j);
          candidatos.push({ nombre: nombreCandidato, votos: votosLista[j].toString() });
        }
  
        resultados.push({ lista: lista, candidatos: candidatos });
      }
  
      setResultados(resultados);
      setShowResultados(true);
      handleClose();
    } catch (error) {
      console.error("Error al obtener los resultados: ", error);
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
  /////////////////////
  //Manejo de Botones//
  ////////////////////

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

  function handleAddCandidato1() {
    setCandidatos([...candidatos, ""]);
  }

  function handleRemoveCandidato1(index) {
    const newCandidatos = [...candidatos];
    newCandidatos.splice(index, 1);
    setCandidatos(newCandidatos);
  }

  function handleNombreListaChange(e, index) {
    const newNombresDeListas = [...nombresDeListas];
    newNombresDeListas[index] = e.target.value;
    setNombresDeListas(newNombresDeListas);
  }

  function handleCandidatoChange1(event, index) {
    const newCandidatos = [...candidatos];
    newCandidatos[index] = event.target.value;
    setCandidatos(newCandidatos);
  }

  function handleAddCandidato(indexLista) {
    const newListas = [...listas];
    newListas[indexLista].push("");
    setListas(newListas);
  }

  // Función para eliminar un candidato de una lista
  function handleRemoveCandidato(indexLista, indexCandidato) {
    const newListas = [...listas];
    newListas[indexLista].splice(indexCandidato, 1);
    setListas(newListas);
  }

  // Función para manejar el cambio en el nombre de un candidato
  function handleCandidatoChange(event, indexLista, indexCandidato) {
    const newListas = [...listas];
    newListas[indexLista][indexCandidato] = event.target.value;
    setListas(newListas);
  }

  // Función para agregar una nueva lista de candidatos
  function handleAddLista() {
    setListas([...listas, [""]]);
  }

  // Función para eliminar una lista de candidatos
  function handleRemoveLista(indexLista) {
    const newListas = [...listas];
    newListas.splice(indexLista, 1);
    setListas(newListas);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (metodoConteo === "mayoria-absoluta") {
      await crearVotacion(nombre, candidatos, descripcion);
    } else if (metodoConteo === "dhondt") {
      await crearVotacionDhondt(
        nombre,
        listas,
        nombresDeListas,
        descripcion,
        escanios
      );
    }
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

      <TablaVotacionesAdmin
        votaciones={votaciones} // Asegúrate de pasar las votaciones necesarias
        terminarVotacionPassword={terminarVotacionPassword}
        setTerminarVotacionPassword={setTerminarVotacionPassword}
        terminarVotacion={terminarVotacion}
        verDetalles={verDetalles}
      />

      <CrearVotacionModal
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        nombre={nombre}
        setNombre={setNombre}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        metodoConteo={metodoConteo}
        setMetodoConteo={setMetodoConteo}
        candidatos={candidatos}
        handleCandidatoChange1={handleCandidatoChange1}
        handleAddCandidato1={handleAddCandidato1}
        handleRemoveCandidato1={handleRemoveCandidato1}
        listas={listas}
        nombresDeListas={nombresDeListas}
        handleNombreListaChange={handleNombreListaChange}
        handleAddLista={handleAddLista}
        handleRemoveLista={handleRemoveLista}
        handleCandidatoChange={handleCandidatoChange}
        escanios={escanios}
        setEscanios={setEscanios}
        crearVotacionPassword={crearVotacionPassword}
        setCrearVotacionPassword={setCrearVotacionPassword}
        handleAddCandidato={handleAddCandidato}
        handleRemoveCandidato={handleRemoveCandidato}
      />

      <EliminarVotacionModal
        showEliminar={showEliminar}
        handleCloseEliminar={handleCloseEliminar}
        handleSubmitEliminar={handleSubmitEliminar}
        votacionAEliminar={votacionAEliminar}
        setVotacionAEliminar={setVotacionAEliminar}
        eliminarVotacionPassword={eliminarVotacionPassword}
        setEliminarVotacionPassword={setEliminarVotacionPassword}
        votaciones={votaciones}
      />

      <CandidatosModal
        showCandidatos={showCandidatos}
        handleCloseCandidatos={handleCloseCandidatos}
        candidatosInfo={candidatosInfo}
      />

      <ResultadosModal
        showResultados={showResultados}
        setShowResultados={setShowResultados}
        resultados={resultados}
      />

      <HistorialModal
        showHistorial={showHistorial}
        handleCloseHistorial={handleCloseHistorial}
        votacionesTerminadas={votacionesTerminadas}
        verDetallesTerminadas={verDetallesTerminadas}
      />
    </div>
  );
}

export default InicioAdmin;
