var ECC_lib = artifacts.require("./EllipticCurve.sol");  //scep256 library
var ECC = artifacts.require("./ECC.sol");  //elliptic curve implementation
var Election = artifacts.require("./Election.sol"); //evoting smart contract

module.exports = function(deployer) { 
    deployer.deploy(ECC_lib); 
    deployer.deploy(ECC); 
    deployer.deploy(Election); 
};