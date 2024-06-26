// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Votacion {
    // Nombre de la votación
    string public nombre;
    // Estado de la votación (en terminos de eliminacion)
    bool public estado = false;
    // Estado de la votación (en términos de si acabó o no)
    bool public terminada = false;
    // Los candidatos de la votación
    string[] public candidatos;
    // Mapeo de candidato a votos
    mapping(uint => uint) public votos;

    string public metodoConteo;


    // Dirección del creador de la votación
    address public factory;

    // Descripción de la votación
    string descripcion;

    constructor(string memory _nombre, string[] memory _candidatos, address _factory, string memory _descripcion, string memory _metodoConteo) {
        nombre = _nombre;
        estado = true;
        candidatos = _candidatos;
        factory = _factory; 
        descripcion = _descripcion;
        metodoConteo = _metodoConteo;
    }


    // Función para eliminar la votación
    function eliminar() public {
        require(msg.sender == factory, "Solo la factory puede eliminar la votacion");
        estado = false;
    }

    // Función para terminar la votación
    function terminarVotacion() public {
        require(msg.sender == factory, "Solo la factory puede terminar la votacion");
        terminada = true;
    }

    // Función para obtener el nombre de la votación
    function obtenerNombre() public view returns (string memory) {
        return nombre;
    }

    // Función para votar
    function votar(uint candidato) public {
        require(estado, "Esta votacion ha sido eliminada");
        require(!terminada, "Esta votacion ya ha finalizado");
        votos[candidato]++;
    }

    // Función para obtener el conteo de votos de un candidato
    function obtenerVotos(uint candidato) public view returns (uint) {
        return votos[candidato];
    }

    // Función para obtener el estado de la votación
    function obtenerEstado() public view returns (bool) {
        return estado;
    }

    // Función para ver si ha sido terminada la votación
    function obtenerTerminada() public view returns (bool) {
        return terminada;
    }

    // Función para obtener el número de candidatos
    function obtenerNumCandidatos() public view returns (uint) {
        return candidatos.length;
    }

    // Función para obtener la descripción de la votación
    function obtenerDescripcion() public view returns (string memory) {
        return descripcion;
    }

    function obtenerMetodoConteo() public view returns (string memory) {
        return metodoConteo;
    }

}
