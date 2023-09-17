const lk = 0;
App = {

  web3Provider: null,
  contracts: {},
  account: '0x0',
  voted: null,
  

  init: function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
  
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        // const accounts = await window.ethereum.request('eth_requestAccounts');
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
      });
      // console.log(accounts) ;
        
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    const loader = $("#loader");
    const content = $("#content");
    const regSMS = $("#isREg");
    const myform = $("#myVote");
    loader.show();
    content.hide();
    regSMS.hide();

    // Load account data frist before showing process
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;  //the account loaded
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  
      // Load contract data
      App.contracts.Election.deployed().then(function(instance) {
        electionInstance = instance;
        return electionInstance.candidatesCount();
      }).then(function(candidatesCount) {
        const candidatesResults = $("#candidatesResults");
        candidatesResults.empty();
    
        const candidatesSelect = $('#candidatesSelect');
        candidatesSelect.empty();
    
        for (let i= 1; i <= candidatesCount; i++) {
          electionInstance.candidates(i).then(function(candidate) {
            const id = candidate[0];
            const name = candidate[1];
            const party = candidate[2];
            const voteCount = candidate[3];
            // Render candidate Result
            const candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + party + "</td><td>" + voteCount + "</td></tr>"
            candidatesResults.append(candidateTemplate);
    
            // Render candidate ballot option
            const candidateOption = "<option value='" + id + "' >" + name + "</ option>"
            candidatesSelect.append(candidateOption);
          });
        }
     
        return electionInstance.isVoter_Registered({from: App.account});
      }).then(function(next) {
        // Do not allow a user to vote
          if(!next) { 
            regSMS.show();
            myform.hide();
          }
          loader.hide();
          return electionInstance.has_Voted({from: App.account});
        
      }).then(function(next2) {
        if(next2) { 
          myform.hide();
        }
        content.show();
      }
      ).catch(function(error) {
        console.warn(error);
      });
  },

  castVote: function() {
    const candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      return App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },

  registerVoter:  function() {    
    const name =  $("#name-reg").val().replace(/[^a-zA-Z0-9 ]/g, '');
    const surname = $("#surname-reg").val().replace(/[^a-zA-Z0-9 ]/g, '');
    const person_id= $("#personID-reg").val();
    const result = person_id.replace(/[^a-zA-Z0-9 ]/g, '')?.length || 0;
    const result2 = person_id?.length || 0;
    const email = $("#email-reg").val();  

    // Conditions
    if (name != '' && email != ''  && person_id !='' && surname != '') {
      if (result >= 10  &&  result == result2){ 
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){             
          App.contracts.Election.deployed().then(function(instance){
            return instance.addVoter(person_id, email, name, surname, { from: App.account });
            }).then(function(result){        
              voted = true;
              alert("Your have been registered!");
            }).catch(function(err){
              console.error(err);
            })

        } else {
          alert("Invalid Email Address...!!!");
          return false;
          }

    } else {
        alert("The Indentification No. must be at least 10 digit long!");
        return false;
      }
  } else {
      alert("All fields are required.....!");
      return false;
      }
    
  },

  getRemainingTime: function() {
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
        return electionInstance.getTime();
      }).then(function(the_durations){
        console.log(parseInt(the_durations, 16))
        const timer = $('setTimer');
        timer.text("Remaining Time: "+  the_durations);
      })
    
  },

  //admin signs in 
  admin_Signs_In: function(){
  

    try {    
    
      const clean_message = "elections2023_nationWideSA";
      // const hashed_message = web3._extend.utils.toHex(clean_message);
      // console.log(web3.eth.accounts[0]) web3._extend.utils.toHex(
  
      web3.eth.sign(App.account, web3.sha3(clean_message),function(err, result){

        }).then(console.log);
   
    //   App.contracts.Election.deployed().then(function(instance) {
    //   return instance.verify("elections2023_nationWideSA", hashed_message, { from: App.account });
    // }).then(function(result) {
    //   if(result){
    //     alert("Sign In!");
    //   }
    //   else{
    //     alert("Error might have occurred");
    //   }
      
    //   }).catch(function(err) {
    //     console.error(err);
    //   });
      
    } catch (error) {
        console.warn(error);
    }

  },


};

$(function() {
  $(window).load(function() {
    App.init();   
  });
});


// to sign message ethereum.request({method: "personal_sign", param: [account, hashedMessage]}) -> return promise with PromiseResult (signature). The we call verify (address of Signer, string message, PromiseResult (signature)). The return is a boolean.

// Use signature verifier, when Admin adds candidates, add voters, and changes phase.