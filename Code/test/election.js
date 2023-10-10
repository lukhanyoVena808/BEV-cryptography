var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  var electionInstance;

  it("initializes with zero candidates", function() {
    return Election.deployed().then(function(instance) {
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 0);
    });
  });

  it("it initializes the candidates with the correct values", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.addCandidate("Candidate 1", "ABC");
    }).then(function() {
        electionInstance.candidates(1).then(function(candidate) {
        assert.equal(candidate[0], 1, "contains the correct id");
        assert.equal(candidate[1], "Candidate 1", "contains the correct name");
        assert.equal(candidate[2], "ABC", "contains the correct political party");
        assert.equal(candidate[3], 0, "contains the correct votes count");
      });
      return electionInstance.addCandidate("Candidate 2", "CBA");
    }).then(function() {
        electionInstance.candidates(2).then(function(candidate) {
          assert.equal(candidate[0], 2, "contains the correct id");
          assert.equal(candidate[1], "Candidate 2", "contains the correct name");
          assert.equal(candidate[2], "CBA", "contains the correct political party");
          assert.equal(candidate[3], 0, "contains the correct votes count");
        });
      });
    });

    it("allows a user to register for voting", function() {
      return Election.deployed().then(function(instance) {
        electionInstance = instance;
        return electionInstance.addVoter("876543210E", "workHard@gmail.com", "Lux", "Musica", "a45C63", { from: accounts[1] });
      }).then(function() {
        electionInstance.getVoter({from: accounts[1]}).then(function(details) {
          assert.equal(details[0], "Lux", "contains the correct name");
          assert.equal(details[1], "Musica", "contains the correct surname");
          assert.equal(details[2], "workHard@gmail.com", "contains the correct email");
          assert.equal(details[3], "a45C63", "contains the correct reference number");
          assert.equal(details[4], true, "user is registered");
          assert.equal(details[5], false, "user has not voted");
          assert.equal(details[6], false, "user's vote is not verified");
        });
      })
    });

    it("throws an exception when users use same id for registration ", function() {
      return Election.deployed().then(function(instance) {
        electionInstance = instance;
        return electionInstance.addVoter("AAA3210E", "workHard@gmail.com", "Lux", "Musica", "a45C63", { from: accounts[2] });
      }).then(function() {
        //Try using the same ID
        electionInstance.addVoter("AAA3210E", "smartLeaner@gmail.com", "Elon", "Maks", "4567SW", { from: accounts[3] }).then(assert.fail).catch(function(error) {
          assert(error, "Personal ID already in use");
          });
        });
      });


      it("throws an exception when users use same public address for registration ", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          return electionInstance.addVoter("AWE10E", "workSamrt@gmail.com", "Jack", "Beanstock", "a45C63", { from: accounts[3] });
        }).then(function() {
          //Try using the same ID
          electionInstance.addVoter("AQ00030E", "winer@gmail.com", "Ron", "Don", "ZX67SW", { from: accounts[3] }).then(assert.fail).catch(function(error) {
            assert(error, "The public address already in use");
            });
          });
        });

    it("allows the admin to start an election", function() {
      return Election.deployed().then(function(instance) {
        electionInstance = instance;
        return electionInstance.startElection({ from: accounts[0] });
      }).then(function() {
        return electionInstance.phase();
      }).then(function(phase) {
          assert.equal(phase, "registration",  "election phase is registration");
        })
    });
  
    it("throws an exception for user trying to start an election", function() {
      return Election.deployed().then(function(instance) {
        electionInstance = instance;
        return electionInstance.startElection({ from: accounts[0] });
      }).then(assert.fail).catch(function(error) {
        assert(error, "Only Admin can perform this function");
        })
    });
   

  it("allows a voter to cast a vote", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      let candidateId = 1;
      return electionInstance.vote(candidateId, "Monday October 2, 2023", "7:00:22 PM GMT+2", { from: accounts[1] });
    }).then(function() {
      return electionInstance.has_Voted({from: accounts[1]});
    }).then(function(voted) {
      assert(voted, "the voter was marked as voted");
      let candidateId = 1;
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      let voteCount = candidate[3];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
      return electionInstance.votingTrails(0);
    }).then(function(trail) {
      assert.equal(trail[0], "a45C63", "the vote trail has correct user reference number");
      assert.equal(trail[1], "Monday October 2, 2023", "correct date of vote recorded");
      assert.equal(trail[2], "7:00:22 PM GMT+2", "correct time of vote recorded");
      assert.equal(trail[3], false,  "vote is not verified");
    });
    
  });

  it("throws an exception for invalid candidates", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(99, "Monday October 9, 2023", "6:00:22 PM GMT+2", { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error, "invalid candidate");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      let voteCount = candidate1[3];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      let voteCount = candidate2[3];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
    });
  });

  it("throws an exception for double voting", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      // Try double voting 
      let candidateId = 2;
      return electionInstance.vote(candidateId, "Tuesday October 10, 2023", "6:00:22 PM GMT+2", { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error ,  "Already Voted");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      let voteCount = candidate1[3];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      let voteCount = candidate2[3];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
    });
  });


  it("allows voter to verify vote using audit keys", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.copyKeys({ from: accounts[1] });
    }).then(function(keys) {
      return electionInstance.verifyVote(keys[0], keys[1], { from: accounts[1] });
    }).then(function() {
      return electionInstance.votingTrails(0);
      }).then(function(trail) {
        assert.equal(trail[3], true,  "vote is verified");
      })
  });

  it("throws an exception for admin trying to vote", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(candidateId, "Tuesday October 10, 2023", "7:12:22 PM GMT+2", { from: accounts[0] });
    }).then(assert.fail).catch(function(error) {
      assert(error, "Admin Cannot vote");
      })
  });


  it("allows for election winner to be retrieved", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.getWinner();
    }).then(function(winner) {
        assert.equal(winner, "Candidate 1",  "winner retrieved");
      })
  });
 


});
