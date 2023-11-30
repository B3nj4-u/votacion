import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cuentaFactory from "../abis/CuentaFactory.json";
import cuenta from "../abis/Cuenta.json";
import { Form, Button, Modal } from "react-bootstrap";

import Navigation from "./Navbar";
import MyCarousel from "./Carousel";

// Creacion de la billetera
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:7545`);
const privateKey =
  "0xec362c8b60288f86de32edff2a845407480eb611d71d0848543ff97847097275";
const wallet = new ethers.Wallet(privateKey, provider);

function Home() {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [direccionUsuario, setDireccionUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const handleAdminLogin = () => {
    navigate("/inicioadmin");
  };
  const navigate = useNavigate();

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    const networkId = 5777; // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    const networkData = cuentaFactory.networks[networkId];

    if (networkData) {
      const abi = cuentaFactory.abi;
      const address = networkData.address;
      const contract = new ethers.Contract(address, abi, wallet);
      setContract(contract);
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

  async function crearNuevaCuenta(texto, contrasena) {
    // Llama a la función crearCuenta en el contrato
    let tx = await contract.crearCuenta(texto, contrasena);

    // Espera a que la transacción sea minada
    await tx.wait();

    // Obtiene el índice del último contrato creado
    let ultimoIndice = await contract.ultimoIndice();

    // Resta uno al índice para obtener el índice del contrato que acabamos de crear
    ultimoIndice = ultimoIndice - 1;

    // Obtiene la dirección del nuevo contrato Cuenta
    let nuevaCuentaDireccion = await contract.obtenerCuenta(ultimoIndice);

    // Crea una nueva instancia del contrato Cuenta
    let nuevaCuenta = new ethers.Contract(
      nuevaCuentaDireccion,
      cuenta.abi,
      wallet
    );

    // Ahora puedes llamar a las funciones del contrato Cuenta
    let direccion = await nuevaCuenta.obtenerDireccion();

    console.log(
      "El valor _direccion del nuevo contrato Cuenta es: ",
      direccion
    );

    // Devuelve el valor _direccion y la dirección del nuevo contrato Cuenta
    return { direccion, nuevaCuentaDireccion };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let texto = `${nombre}${rut}${fechaNacimiento}`;
    texto = texto.replace("-", "");
    texto = texto.replace("-", "");
    console.log(texto);

    // Llama a la función crearCuenta del contrato
    try {
      // Aquí es donde llamamos a la función para crear una nueva cuenta
      let { direccion, nuevaCuentaDireccion } = await crearNuevaCuenta(
        texto,
        contrasena
      );

      // Redirige al usuario a InicioLogged y pasa la dirección del contrato Cuenta como estado
      navigate("/inicio", {
        state: { account: direccion, contractAddress: nuevaCuentaDireccion },
      });
    } catch (error) {
      // Muestra un mensaje de error al usuario
      alert(error);
    }
  }

  async function handleLogin(event) {
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

        // Instancia el contrato Cuenta y verifica la contraseña
        const cuentaContract = new ethers.Contract(
          direccionContrato,
          cuenta.abi,
          wallet
        );
        const contrasenaCorrecta = await cuentaContract.verificarContrasena(
          contrasena
        );

        if (contrasenaCorrecta) {
          // Si la contraseña es correcta, redirige al usuario a la página de inicio
          navigate("/inicio", {
            state: {
              account: direccionUsuario,
              contractAddress: direccionContrato,
            },
          });
        } else {
          // Si la contraseña es incorrecta, muestra un mensaje de error
          alert("Contraseña incorrecta");
        }
      } else {
        window.alert("¡El Smart Contract no se ha desplegado en la red!");
      }
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
    }
  }

  return (
    <div>
      <Navigation account={account} />
      <MyCarousel />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formDireccionUsuario">
                  <Form.Label>Dirección del Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa la dirección del usuario"
                    value={direccionUsuario}
                    onChange={(e) => setDireccionUsuario(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formContrasenaLogin">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Iniciar Sesión
                </Button>
              </Form>
              <Button variant="link" onClick={() => setShowModal(true)}>
                ¿No tienes cuenta? ¡Crea una!
              </Button>
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Crear Cuenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNombre">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tu nombre"
                        name="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formRut">
                      <Form.Label>RUT</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tu RUT"
                        name="rut"
                        value={rut}
                        onChange={(e) => setRut(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formFechaNacimiento">
                      <Form.Label>Fecha de Nacimiento</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Ingresa tu fecha de nacimiento"
                        name="fechaNacimiento"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formContrasena">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Crear Cuenta
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>
            </div>
          </main>
        </div>
      </div>
      <div style={{ position: "fixed", right: 0, bottom: 0, margin: "10px" }}>
        <Button variant="primary" onClick={handleAdminLogin}>
          Iniciar sesión como administrador
        </Button>
      </div>
    </div>
  );
}

export default Home;
