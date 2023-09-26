var ECC_lib = artifacts.require("./EllipticCurve.sol");  //scep256 library
var Election = artifacts.require("./Election.sol"); //evoting smart contract

module.exports = function(deployer) { 
    deployer.deploy(ECC_lib); 
    deployer.link(ECC_lib, Election);
    deployer.deploy(Election); 
};