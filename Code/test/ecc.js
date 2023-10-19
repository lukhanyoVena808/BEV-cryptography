var Election = artifacts.require("./Election.sol"); //attack smart contract

contract("Encryption Time", function(accounts) {
    var attackInstance;


    it("measure ecc", function() {
        return Election.deployed().then(function(instance) {
            attackInstance = instance;
            for(let i=0; i<100; i++){
                attackInstance.testEncryption({from: accounts[4]});
            } 
            console.log(Date.now() - start);
            
        });
    });
      

});