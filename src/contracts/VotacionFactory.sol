// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Votacion.sol";

contract VotacionFactory {
    // Array para almacenar las direcciones de todas las votaciones
    address[] public votaciones;
    // Array para almacenar las direcciones de todas las votaciones terminadas
    address[] public votacionesTerminadas;

    // Función para crear una nueva votación
    function crearVotacion(string memory nombre, string[] memory candidatos) public {
        Votacion votacion = new Votacion(nombre, candidatos, address(this));
        votaciones.push(address(votacion));
    }

    // Función para obtener todas las votaciones
    function obtenerVotaciones() public view returns (address[] memory) {
        return votaciones;
    }

    // Función para obtener todas las votaciones terminadas
    function obtenerVotacionesTerminadas() public view returns (address[] memory) {
        return votacionesTerminadas;
    }

    // Función para obtener una votación por su índice
    function obtenerVotacion(uint indice) public view returns (Votacion) {
        require(indice < votaciones.length, "Indice fuera de rango");
        return Votacion(votaciones[indice]);
    }

    // Función para obtener una votación terminada por su índice
    function obtenerVotacionTerminada(uint indice) public view returns (Votacion) {
        require(indice < votacionesTerminadas.length, "Indice fuera de rango");
        return Votacion(votacionesTerminadas[indice]);
    }

    // Función para obtener el número de votaciones
    function ultimoIndice() public view returns (uint) {
        return votaciones.length;
    }

    // Función para obtener el número de votaciones terminadas
    function ultimoIndiceTerminadas() public view returns (uint) {
        return votacionesTerminadas.length;
    }

    // Función para terminar una votación
    function terminarVotacion(uint indice) public {
        Votacion votacion = obtenerVotacion(indice);
        votacion.terminarVotacion();
        // Mueve la votación terminada al array de votacionesTerminadas
        votacionesTerminadas.push(address(votacion));
        // Mueve todas las votaciones después de la votación terminada una posición hacia atrás
        for (uint i = indice; i < votaciones.length - 1; i++) {
            votaciones[i] = votaciones[i + 1];
        }
        // Elimina la última votación del array
        votaciones.pop();
    }

    // Función para eliminar una votación
    function eliminarVotacion(uint indice) public {
        Votacion votacion = obtenerVotacion(indice);
        votacion.eliminar();
        // Mueve todas las votaciones después de la votación eliminada una posición hacia atrás
        for (uint i = indice; i < votaciones.length - 1; i++) {
            votaciones[i] = votaciones[i + 1];
        }
        // Elimina la última votación del array
        votaciones.pop();
    }
}
