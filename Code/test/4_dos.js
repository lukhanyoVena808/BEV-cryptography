

var Election = artifacts.require("./Election.sol");

contract("DOS_Attack", function(accounts) {
  var electionInstance;

  it("DOS Attack", function() {
    return Election.deployed().then(function(instance) {
        electionInstance = instance;
        for (let i= 0; i < 10; i++) {
            electionInstance.addCandidate(`Candidate ${i}`, `ABC${i}`, {from: accounts[0]});
        }
    })   })

});