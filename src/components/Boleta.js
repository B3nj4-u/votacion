import React, { useState,useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navbar";
import "./Boleta.css"; // Importa tu archivo CSS
import jsPDF from "jspdf";


function Boleta() {
  const location = useLocation();
  const navigate = useNavigate();
  const [votacion] = useState(location.state.votacion);
  const [candidato] = useState(location.state.candidato);
  const [account] = useState(location.state.account);
  const [contractAddress] = useState(
    location.state.contractAddress
  );
  const direccionRef = useRef(null);
  function handleCopy() {
    direccionRef.current.select();
    document.execCommand("copy");
  }

  function handleDownload() {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Comprobante de Votación", 20, 20);
    doc.setFontSize(16);
    doc.text(`Votación: ${votacion}`, 20, 30);
    doc.text(`Candidato: ${candidato}`, 20, 40);
    doc.text("Dirección del Usuario:", 20, 50);

    // Divide la dirección en varias líneas
    const lineas = account.match(/.{1,33}/g); // Ajusta el número 30 para cambiar cuántos caracteres hay en cada línea
    lineas.forEach((linea, i) => {
      doc.text(linea, 20, 60 + i * 10);
    });

    doc.save("boleta.pdf");
  }

  async function volverInicio(){
    navigate("/inicio", {
      state: { account, contractAddress},
    });
  }

  return (
    <div>
      <Navigation account={account} />
      <div className="contenedor">
        <div className="boleta">
          <h2>Comprobante de Votación</h2>
          <div className="datos">
            <p>Votación: {votacion}</p>
            <p>Candidato: {candidato}</p>
            <p>Dirección del Usuario:</p>
            <textarea ref={direccionRef} value={account} readOnly />
            <Button onClick={handleCopy}>Copiar</Button>
          </div>
        </div>
        <p>
          <Button onClick={handleDownload}>Descargar</Button>
        </p>
        <p>
          <Button onClick={volverInicio}>Inicio</Button>
        </p>
      </div>
    </div>
  );
}

export default Boleta;
