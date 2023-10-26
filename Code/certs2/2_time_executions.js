var Election = artifacts.require("./Election.sol");

contract("Time_Executions", function(accounts) {
  var electionInstance;

  it("adding 6 candidate", function() {
    return Election.deployed().then(function(instance) {
        electionInstance = instance;
        for (let i= 0; i < 6; i++) {
            electionInstance.addCandidate(`Candidate ${i}`, `ABC${i}`, {from: accounts[0]});
        }
    })
  })

// it("adding 16 candidate", function() {
//     return Election.deployed().then(function(instance) {
//         electionInstance = instance;
//         for (let i= 0; i < 16; i++) {
//             electionInstance.addCandidate(`Candidate ${i}`, `ABC${i}`, {from: accounts[0]});
//         }
//     })
// })

// it("adding 32 candidate", function() {
//     return Election.deployed().then(function(instance) {
//         electionInstance = instance;
//         for (let i= 0; i < 32; i++) {
//             electionInstance.addCandidate(`Candidate ${i}`, `ABC${i}`, {from: accounts[0]});
//         }
//     })
// })

// it("adding 64 candidate", function() {
//     return Election.deployed().then(function(instance) {
//         electionInstance = instance;
//         for (let i= 0; i < 64; i++) {
//             electionInstance.addCandidate(`Candidate ${i}`, `ABC${i}`, {from: accounts[0]});
//         }
//     })
// })

// it("adding 128 candidate", function() {
//     return Election.deployed().then(function(instance) {
//         electionInstance = instance;
//         for (let i= 0; i < 128; i++) {
//             electionInstance.addCandidate(`Candidate ${i}`, `ABC${i}`, {from: accounts[0]});
//         }
//     })
// })


it("getting 6 candidate", function() {
    return Election.deployed().then(function(instance) {
        electionInstance = instance;
        for (let i= 0; i < 6; i++) {
            electionInstance.candidates(i).then(function(){
  });
        }
    })
})

it("getting 16 candidate", function() {
    return Election.deployed().then(function(instance) {
        electionInstance = instance;
        for (let i= 0; i < 16; i++) {
            electionInstance.candidates(i);
        }
    })
})

it("getting 32 candidate", function() {
    return Election.deployed().then(function(instance) {
        electionInstance = instance;
        for (let i= 0; i < 32; i++) {
            electionInstance.candidates(i);
        }
    })
})

it("getting 64 candidate", function() {
    return Election.deployed().then(function(instance) {
        electionInstance = instance;
        for (let i= 0; i < 64; i++) {
            electionInstance.candidates(i);
        }
    })
})

it("getting 128 candidate", function() {
    return Election.deployed().then(function(instance) {
        electionInstance = instance;
        for (let i= 0; i < 128; i++) {
            electionInstance.candidates(i);
        }
    })
})

})
