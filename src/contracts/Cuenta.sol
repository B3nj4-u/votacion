// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Cuenta {

    bytes32 public _direccion;
    // Mapeo de dirección a votos
    mapping(bytes32 => uint[]) private votos;
    // Mapeo de dirección a booleano para comprobar si un usuario ha votado
    mapping(address => bool) private haVotado;
     // Dirección del CuentaFactory
    address public factory;

    // Constructor que recibe una cadena de texto y la convierte en una dirección
    constructor(string memory texto, address _factory) {
        _direccion = keccak256(abi.encodePacked(texto));
        factory = _factory; // Almacena la dirección de la factory
    }

    // Función para almacenar el voto de un usuario
    function almacenarVoto(address direccion) public {
        require(!haVotado[direccion], "El usuario ya ha votado en esta votacion");
        haVotado[direccion] = true;
    }

    // Función para obtener los votos de una dirección
    function obtenerVotos(bytes32 direccion) public view returns (uint[] memory) {
        return votos[direccion];
    }

    // Función para obtener la dirección
    function obtenerDireccion() public view returns (bytes32) {
        return _direccion;
    }

    // Función para comprobar si un usuario ha votado
    function comprobarVoto(address direccion) public view returns (bool) {
        return haVotado[direccion];
    }
}
