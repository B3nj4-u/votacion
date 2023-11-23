const CuentaFactory = artifacts.require("CuentaFactory");
const VotacionFactory = artifacts.require("VotacionFactory");

module.exports = async function(deployer) {
  await deployer.deploy(CuentaFactory);
  await deployer.deploy(VotacionFactory);
  
  
  const cuentaFactory = await CuentaFactory.deployed();
  const votacionFactory = await VotacionFactory.deployed();
};
