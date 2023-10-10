

var Election = artifacts.require("./Election.sol");

contract("contract_Hijacking", function(accounts) {
  var electionInstance;

  it("prevent contract hijacking", function() {
    return Election.deployed().then(function(instance) {
        electionInstance = instance; 
        return electionInstance.admin();
    }).then(assert.fail).catch(function(error) {
        assert(error, "electionInstance.admin is not a function");
    });
  })

});