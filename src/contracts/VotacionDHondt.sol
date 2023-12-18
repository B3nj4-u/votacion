// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Votacion.sol";

contract VotacionDHondt is Votacion {
    uint public escanios;
    string[][] public listas;
    string[] public nombresDeListas;
    uint[][] public votosDhondt;

    struct Resultado {
        string nombre;
        uint escanios;
        CandidatoElecto[] candidatosElectos;
    }

    struct CandidatoElecto {
        string nombre;
        uint votos;
    }

    constructor(string memory _nombre, string[][] memory _listas, string[] memory _nombresDeListas, address _factory, string memory _descripcion, uint _escanios, string memory _metodoConteo)
        Votacion(_nombre, _listas[0], _factory, _descripcion, _metodoConteo) {
        escanios = _escanios;
        listas = _listas;
        estado = true;
        nombresDeListas = _nombresDeListas;
        votosDhondt = new uint[][](_listas.length);

        for(uint i=0; i<_listas.length ; i++){
            votosDhondt[i] = new uint[](_listas[i].length);
        }

        for (uint i = 1; i < _listas.length; i++) {
            for (uint j = 0; j < _listas[i].length; j++) {
                candidatos.push(_listas[i][j]);
            }
        }
    }


    function obtenerEscanios() public view returns (uint){
        return escanios;
    }

    // Función para votar
    function votarDhondt(uint listaIndex, uint candidatoIndex) public {
        require(estado, "Esta votacion ha sido eliminada");
        require(!terminada, "Esta votacion ya ha finalizado");
        votosDhondt[listaIndex][candidatoIndex]++;
    }

    // Función para obtener el conteo de votos de un candidato
    function obtenerVotos(uint lista, uint candidato) public view returns (uint) {
        return votosDhondt[lista][candidato];
    }

    // Función para obtener el número de candidatos de una lista específica
    function obtenerNumCandidatosLista(uint lista) public view returns (uint) {
        return listas[lista].length;
    }

    function obtenerNumListas() public view returns (uint) {
        return listas.length;
    }

    // Función para obtener el nombre de un candidato de una lista específica
    function obtenerCandidatoLista(uint lista, uint candidato) public view returns (string memory) {
        return listas[lista][candidato];
    }

    function obtenerVotosLista(uint lista) public view returns (uint[] memory) {
        return votosDhondt[lista];
    }

    function obtenerTodosLosVotos() public view returns (uint[][] memory) {
        return votosDhondt;
    }

    function obtenerNombreLista(uint lista) public view returns (string memory) {
        return nombresDeListas[lista];
    }



   
}
