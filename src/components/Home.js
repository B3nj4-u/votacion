import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cuentaFactory from "../abis/CuentaFactory.json";
import cuenta from "../abis/Cuenta.json";
import { Form, Button, Modal } from "react-bootstrap";
import CrearCuentaModal from "./modals/CrearCuentaModal";
import LoginForm from "./forms/LoginForm";
import AdminLoginModal from "./modals/AdminLoginModal";
import Cargando from "./Cargando";

import Navigation from "./Navbar";
import MyCarousel from "./Carousel";
require("dotenv").config();
const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const providerUrl = process.env.REACT_APP_PROVIDER_URL;
// Validación de variables de entorno
if (!adminPassword) {
  console.error("Falta adminPassword. Verifica tu archivo .env.");
  process.exit(1);
}
if (!providerUrl) {
  console.error("Falta providerUrl. Verifica tu archivo .env.");
  process.exit(1);
}
if (!privateKey) {
  console.error("Falta privateKey. Verifica tu archivo .env.");
  process.exit(1);
}

// Creacion de la billetera
const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);

function Home() {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [direccionUsuario, setDireccionUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const navigate = useNavigate();
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const handleCloseAdminLoginModal = () => setShowAdminLoginModal(false);
  const handleShowAdminLoginModal = () => setShowAdminLoginModal(true);
  const handleAdminLogin = () => {
    handleShowAdminLoginModal();
  };
  useEffect(() => {
    loadBlockchainData();
  }, []);

  function handleSubmitAdminLogin(event) {
    event.preventDefault();
    const password = event.target.formAdminPassword.value;
    if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
      navigate("/inicioadmin");
      handleCloseAdminLoginModal();
    } else {
      alert("Contraseña incorrecta!");
    }
  }

  async function loadBlockchainData() {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error("Error al cargar los datos de la blockchain: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function crearNuevaCuenta(texto, contrasena) {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error("Error al crear una nueva cuenta: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let texto = `${nombre}${rut}${fechaNacimiento}`;
    texto = texto.replace("-", "");
    texto = texto.replace("-", "");
    console.log(texto);

    // Llama a la función crearCuenta del contrato
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navigation account={account} />
      {loading && <Cargando />}
      <MyCarousel />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <LoginForm
                handleLogin={handleLogin}
                direccionUsuario={direccionUsuario}
                setDireccionUsuario={setDireccionUsuario}
                contrasena={contrasena}
                setContrasena={setContrasena}
              />
              <Button variant="link" onClick={() => setShowModal(true)}>
                ¿No tienes cuenta? ¡Crea una!
              </Button>
              <CrearCuentaModal
                showModal={showModal}
                setShowModal={setShowModal}
                handleSubmit={handleSubmit}
                nombre={nombre}
                setNombre={setNombre}
                rut={rut}
                setRut={setRut}
                fechaNacimiento={fechaNacimiento}
                setFechaNacimiento={setFechaNacimiento}
                contrasena={contrasena}
                setContrasena={setContrasena}
              />
              <AdminLoginModal
                showAdminLoginModal={showAdminLoginModal}
                handleCloseAdminLoginModal={handleCloseAdminLoginModal}
                handleSubmitAdminLogin={handleSubmitAdminLogin}
              />
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
