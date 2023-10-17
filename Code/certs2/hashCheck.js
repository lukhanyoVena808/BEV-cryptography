var Election = artifacts.require("./Election.sol");

contract("HashCollision", function(accounts) {
    var electionInstance;

    //chech for hashing collisons on Blockchain for users with similar data inputs
    const BigData = [["word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word"],

               ["word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word"],

               ["word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word"], 

                ["word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word"],
              
              ["word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word"],

              ["word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word","word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", "word", ]
            ]

    it("check for hash collisions", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;

          for (var i =0; i<BigData.length; i++){
            var collisions =0;
            const hashs = [];
            for (var j =0; j<BigData[i].length; j++){ //traverse through words in arr
                electionInstance.random( {from: accounts[1]}).then( //random nonce
                  function(randN){
                    assert.notEqual(randN, 0, "Not Zero");
                    electionInstance.getHash(BigData[i][j], 100).then( // get hash of each word
                      function(theHash){
                          if (hashs.includes(theHash)){ collisions++;}
                          else{hashs[j] = theHash};
                          assert.notEqual(collisions, 0, `Data ${i}`);
                      }
                    );  
                  }
                );  
              }       
          }

        });
      });

});