// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Cuenta.sol";

contract CuentaFactory {
    // Mapeo de índice a contratos
    mapping(uint => Cuenta) public cuentas;
    // Mapeo de _direccion a dirección del contrato
    mapping(bytes32 => address) public direcciones;
    uint public ultimoIndice = 0;

    // Función para crear un nuevo contrato Cuenta
    function crearCuenta(string memory texto, string memory contrasena) public {
        Cuenta cuenta = new Cuenta(texto, contrasena, address(this));
        cuentas[ultimoIndice] = cuenta;
        direcciones[cuenta._direccion()] = address(cuenta);
        ultimoIndice++;
    }

    // Función para obtener la dirección de un contrato Cuenta
    function obtenerCuenta(uint indice) public view returns (Cuenta) {
        return cuentas[indice];
    }

    // Función para obtener el valor de _direccion de un contrato Cuenta
    function obtenerDireccion(uint indice) public view returns (bytes32) {
        return cuentas[indice]._direccion();
    }

    // Función para obtener la dirección del contrato de una _direccion
    function obtenerDireccionContrato(bytes32 _direccion) public view returns (address) {
        return direcciones[_direccion];
    }
}
