var Election = artifacts.require("./Election.sol"); //attack smart contract

contract("Encryption Time", function(accounts) {
    var attackInstance;


    it("measure ecc", function() {
        return Election.deployed().then(function(instance) {
            attackInstance = instance;
            const start = Date.now();
            for(let i=0; i<10; i++){
                attackInstance.testEncryption({from: accounts[1]});
            }
            console.log(Date.now() - start);
        });
      });


});