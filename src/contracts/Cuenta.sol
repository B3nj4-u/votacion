// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Cuenta {

    bytes32 public _direccion;
    // Mapeo de dirección a votos
    // Mapeo de dirección a booleano para comprobar si un usuario ha votado
    mapping(address => bool) private haVotado;
     // Dirección del CuentaFactory
    address public factory;

    struct Voto {
        address votacion;
        uint candidato;
    }

    mapping(address => Voto) public votos;


    // Constructor que recibe una cadena de texto y la convierte en una dirección
    constructor(string memory texto, address _factory) {
        _direccion = keccak256(abi.encodePacked(texto));
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

    function votar(address votacion, uint candidato) public {
        require(!haVotado[msg.sender], "El usuario ya ha votado.");
        haVotado[votacion] = true;
        votos[msg.sender] = Voto(votacion, candidato);
    }

}
