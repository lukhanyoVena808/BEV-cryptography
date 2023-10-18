var Election = artifacts.require("./Election.sol"); //attack smart contract

contract("Encryption Time", function(accounts) {
    var attackInstance;


    it("measure ecc", function() {
        return Election.deployed().then(function(instance) {
            attackInstance = instance;
            for (var j =0; j<BigData[i].length; j++){ //traverse through words in arr
    
            const start = Date.now();
            for(let i=0; i<10; i++){
                attackInstance.testEncryption({from: accounts[1]});
            } 
            console.log(Date.now() - start);
            }
        });
    });
      

});