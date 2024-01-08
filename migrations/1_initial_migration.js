const CuentaFactory = artifacts.require("CuentaFactory");
const VotacionFactory = artifacts.require("VotacionFactory");
//const Cuenta = artifacts.require("Cuenta");
//const Votacion = artifacts.require("Votacion");
//const VotacionDHondt = artifacts.require("VotacionDHondt");

module.exports = async function(deployer) {
  //await deployer.deploy(Cuenta);
  //await deployer.deploy(Votacion);
  //await deployer.deploy(VotacionDHondt);
  await deployer.deploy(CuentaFactory);
  await deployer.deploy(VotacionFactory);
  
  
  const cuentaFactory = await CuentaFactory.deployed();
  const votacionFactory = await VotacionFactory.deployed();
  //const cuenta = await Cuenta.deployed();
  //const votacion = await Votacion.deployed();
  //const votacionDHondt = await VotacionDHondt.deployed();
};
