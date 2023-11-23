// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Cuenta.sol";

contract CuentaFactory {
    // Mapeo de índice a contratos
    mapping(uint => Cuenta) public cuentas;
    uint public ultimoIndice = 0;

    // Función para crear un nuevo contrato Cuenta
    function crearCuenta(string memory texto) public {
        Cuenta cuenta = new Cuenta(texto, address(this));
        cuentas[ultimoIndice] = cuenta;
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
}