// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Cuenta {

    bytes32 public _direccion;
    // Mapeo de dirección a votos
    // Mapeo de dirección a booleano para comprobar si un usuario ha votado
    mapping(address => bool) private haVotado;
     // Dirección del CuentaFactory
    address public factory;
    bytes32 private _contrasenaHash; // Almacena el hash de la contraseña

    struct Voto {
        address votacion;
        uint candidato;
        string nombreCandidato;
        string nombreVotacion;
    }

    // Array de structs Voto
    Voto[] public votos;

    // Constructor que recibe una cadena de texto y la convierte en una dirección
    constructor(string memory texto, string memory contrasena, address _factory) {
        _direccion = keccak256(abi.encodePacked(texto));
        _contrasenaHash = keccak256(abi.encodePacked(contrasena));
        factory = _factory; // Almacena la dirección de la factory
    }

    // Función para obtener la dirección
    function obtenerDireccion() public view returns (bytes32) {
        return _direccion;
    }

    // Función para comprobar si un usuario ha votado
    function comprobarVoto(address direccion) public view returns (bool) {
        return haVotado[direccion];
    }

    // Función para almacenar el voto de un usuario
    function votar(address votacion, uint candidato, string memory nombreCandidato, string memory nombreVotacion) public {
        require(!haVotado[msg.sender], "El usuario ya ha votado.");
        haVotado[votacion] = true;
        votos.push(Voto(votacion, candidato, nombreCandidato, nombreVotacion));
    }

    // Función para obtener los votos de un usuario
    function obtenerVotos() public view returns (Voto[] memory) {
        return votos;
    }

    // Función para verificar la contraseña
    function verificarContrasena(string memory contrasena) public view returns (bool) {
        return keccak256(abi.encodePacked(contrasena)) == _contrasenaHash;
    }


}
