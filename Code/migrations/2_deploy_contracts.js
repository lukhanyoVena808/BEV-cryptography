var ECC_lib = artifacts.require("./EllipticCurve.sol");  //elliptic ibrary
var Election = artifacts.require("./Election.sol"); //evoting smart contract
var txOrg= artifacts.require("./Attack.sol"); //attack smart contract

module.exports = function(deployer) { 
    deployer.deploy(ECC_lib); 
    deployer.link(ECC_lib, Election);
    deployer.deploy(Election); 
    deployer.link(Election, txOrg);
    deployer.deploy(txOrg); 
};