import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from './Home';
import Footer from './Footer';
import InicioLogged from './InicioLogged';
import InicioAdmin from './InicioAdmin';
import UsuarioVota from './UsuarioVota';
import ConsultaVoto from './ConsultaVoto';
import Boleta from './Boleta';

class App extends Component {
    
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <div>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/inicio" element={<InicioLogged />} />
                            <Route path="/inicioAdmin" element={<InicioAdmin  />} /> 
                            <Route path="/votacion" element={<UsuarioVota />} />
                            <Route path="/consulta" element={<ConsultaVoto />} />
                            <Route path="/boleta" element={<Boleta />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        );
    }

}

export default App;