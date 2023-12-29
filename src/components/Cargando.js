import React from 'react';
import cargando from "../img/cargando.gif"

const Cargando = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <img src={cargando} alt="Cargando..." />
      <p>No recargues la página. Es normal que se demore debido a que la transacción debe ser validada en Blockchain.</p>
    </div>
  );
};

export default Cargando;


