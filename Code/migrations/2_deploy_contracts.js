var ECC_lib = artifacts.require("./EllipticCurve.sol");  //scep256 library
var ECC = artifacts.require("./Secp256k1.sol");  //elliptic curve implementation
var Election = artifacts.require("./Election.sol"); //evoting smart contract

module.exports = function(deployer) { 
    deployer.deploy(ECC_lib); 
    deployer.link(ECC_lib, ECC);
    deployer.deploy(ECC); 
    deployer.link(ECC, Election);
    deployer.deploy(Election); 
};