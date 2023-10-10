var txOrg= artifacts.require("./Attack.sol"); //attack smart contract

contract("OriginAttack", function(accounts) {
    var attackInstance;
    
  it("prevent phishing attack", function() {
    return txOrg.deployed().then(function(instance) {
        attackInstance = instance;
        return attackInstance.attack({from: accounts[0]}); 
    }).then(assert.fail).catch(function(error) {
        assert(error, "Only Admin can perform this function");
    });
  })

});