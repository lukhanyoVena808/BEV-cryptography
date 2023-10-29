var txOrg= artifacts.require("./Attack.sol"); //attack smart contract

contract("Spoofing Attack", function(accounts) {
    var attackInstance;
    
  it("test spoofing attack", function() {
    return txOrg.deployed().then(function(instance) {
        attackInstance = instance;
        return attackInstance.attack({from: accounts[0]});  //attacker utililez admin address
    }).then(assert.fail).catch(function(error) {
        assert.equal(error.data.message, "revert");
    });
  })

});