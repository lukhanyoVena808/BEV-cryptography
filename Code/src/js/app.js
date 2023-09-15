
App = {

  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
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
  
    loader.show();
    content.hide();
  
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
  
      for (const i = 1; i <= candidatesCount; i++) {
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
      return electionInstance.voters(App.account);
    }).then(function(voter) {
      // Do not allow a user to vote
      if(voter.hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    const candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  registerVoter: function() {    
   
    const name =  $("name").val();
    const surname = $("#surname-reg").val();
    const person_id= $("#personID-reg").val();
    const result = person_id?.length || 0;
    const email = $("#email-reg").val();  

    // Regular Expression For Email
    // const emailReg = /^([w-.]+@([w-]+.)+[w-]{2,4})?$/;
    // email.match(emailReg)
    
    // Conditions
    if (name != '' && email != ''  && person_id !='' && surname != '') {
      if (result > 10){ 
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
          $("name") = '';
          alert("Registered. You can now go and vote!.");
          return true;
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
  
    
  }
};

$(function() {
  $(window).load(function() {
    App.init();   
    App.registerVoter();
  });
});
