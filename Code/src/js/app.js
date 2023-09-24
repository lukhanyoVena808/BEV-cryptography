App = {

  web3Provider: null,
  contracts: {},
  account: '0x0',
  voted: null,
  adminIn: null,
  adminView: null,
  
  

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

    adminIn = $("#logIns");
    adminView = $("#dashboard");
    adminIn.show();
    adminView.hide();

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
            const candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + party + "</td></tr>"
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
        
      }).then(function(next2) {  //has voted already
        
        if(next2) { 
          myform.hide();
        }

        electionInstance.phase().then(function(thePhase) {
          if(thePhase != "voting") { 
            myform.hide();
            $("#process").html("Voting has not started");
          }
          if (thePhase == "results"){
            $("#process").html("Voting is over");
          }
        })
        content.show();
      }
      ).catch(function(error) {
        console.warn(error);
      });

      return App.viewData();
  },

  castVote: function() {
    const candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // try {            
      //   const parsed = JSON.parse(JSON.stringify(result)).tx;
      //   console.log(parsed)
      // } catch (error) {
      //   console.log(error)
      // }
      return App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },

  registerVoter:  function(name, surname, person_id, email, otpR, otpFk) {    

    const result = personID.replace(/[^a-zA-Z0-9 ]/g, '')?.length || 0;
    const result2 = personID?.length || 0;
    $.getJSON("ids.json", function(election) {
      var electionInstance;
      const myArray = election.data;
      // Conditions  
      if (name != '' && email != ''  && person_id !='' && surname != '') {
        if (result >= 10  &&  result == result2 && JSON.stringify(myArray).includes(person_id)){ 
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){  
            if ( otpR == otpFk){          
                  App.contracts.Election.deployed().then(function(instance){
                    electionInstance = instance;
                    return electionInstance.phase();
                    }).then(function(result){ 
                      if(result =="registration")  {
                        return electionInstance.addVoter(person_id, email, name, surname, { from: App.account }).then(function(result){ 
                          alert("You have been registered!");
                          // $("#demo_form").trigger("reset"); 
                          window.location.replace("/register")
                          voted = true;
                          return true;
                        });
                      }
                      else{
                        alert("You can only register during the registration phase.");
                        // return false;
                        window.location.replace("/register")
                      }
                      
                    }).catch(function(err){
                      console.error(err);
                    })
                  }else{
                      alert("Invalid OTP, please re-register")
                      window.location.replace("/register")
                  }

          } else {
            alert("Invalid Email Address...!!!");
            // return false;
            window.location.replace("/register")
            }

      } else {
          alert("Invalid identification number!");
          // return false;
          window.location.replace("/register")
        }
    } else {
        alert("All fields are required.....!");
        // return false;
        window.location.replace("/register")
        }
        // return App.getRemainingTime();
        

    })
    
  },

  AddCandidate:  function() {   
    // const name =  $("#name-C").val().replace(/[^a-zA-Z0-9 ]/g, ''); 
    const name =  $("#name-C").val();
    const surname = $("#surname-C").val();
    const party= $("#party-C").val();
      
    //change proprty of an element in form, so the post method executes it checks that the property, if changed then render Overview else render admin login in
    try {  
          // Conditions
          if (name != '' && party != '' && surname != '') { 
                App.contracts.Election.deployed().then(function(instance){
                  return instance.addCandidate(name+ " "+surname, party, { from: App.account });
                  }).then(function(result){ 
                                      
                    alert("Candidate Added!");
                    $("#demo_form2").trigger("reset"); 
                    return App.render();
                  }).catch(function(err){
                    alert("Candidate Not Added");
                    console.error(err);
                    return false;
                  })
            } else {
                alert("All fields are required.....!");
                return false;
                }
      } catch (error) {
          console.warn(error);
      }
     
  },

  getRemainingTime: function() {
    var electionInstance;
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.phase().then(function(the_phase){
              if (the_phase != "Election has not started" && the_phase !="Election ended"){
                $("#setTimer").html("</span>Current Phase: "+the_phase+"</span>");
              }
            })
      }).catch(function(err){
        console.error(err);
      })
    
  },

  //admin signs in 
  admin_Signs_In: function(){
    try {      
      ethereum.request({method: "personal_sign", params: [App.account,  web3.sha3("elections2023_nationWideSA")]}).then(function(result){ //bytes of signture

        App.contracts.Election.deployed().then(function(instance) {
            return instance.verify("elections2023_nationWideSA", result, { from: App.account });
          }).then(function(result2) {
            if(result2){  //signature valid 
              adminIn.hide();
              adminView.show();
              localStorage.setItem("auth", 1);
              alert("Signed In!");
            }
            else{
              alert("Site restricted to Admin only.");
            }
            
            }).catch(function(err){
              console.error(err);
            })
      });
    } catch (error) {
        console.warn(error);
    }
  },

  startElections: function(){
    App.contracts.Election.deployed().then(function(instance) {
      const electionInstance = instance;
        return electionInstance.startElection({from: App.account});
      }).then(function(results){
        alert("Elections have started");
        return App.render();
      }).catch(function(err){
        console.error(err);
      })
  },

  changePhases: function(){
    var electionInstance
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
        return electionInstance.phase();
      }).then(function(the_phase){
       
        if (the_phase != "Election has not started" && the_phase !="Election ended"){
          return electionInstance.changePhase({from: App.account}).then(function() {
            alert("Next Phase");
          });
        }
        if (the_phase == "Election ended"){
          alert("Election ended");
        }
        else{
          alert("Election has not started");
        }
      }).catch(function(err){
        console.error(err);
      })
  },

  viewData: function(){
    var electionInstance;
    const content = $("#content2023");
    content.show()
        
    try {     
        
        App.contracts.Election.deployed().then(function(instance) {
          electionInstance = instance;
            return electionInstance.candidatesCount();
        }).then(function(candidatesCount) {             
                const candidatesResults = $("#candidatesResults2023");
                candidatesResults.empty();
                for (let i= 1; i <= candidatesCount; i++) {
                  electionInstance.candidates(i).then(function(candidate) {
                    const id = candidate[0];
                    const name = candidate[1];
                    const party = candidate[2];
                    const voteCount = candidate[3];

                    // Render candidate Result
                    const candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + party + "</td><td>" + voteCount + "</td></tr>"
                    candidatesResults.append(candidateTemplate);
                  });
                }
                return electionInstance.phase();
              }).then(function(currentPhase) {
                    if (currentPhase == "results"){
                      electionInstance.getWinner().then(function(myWinner) {
                        $("#details").html("Winner: "+myWinner);
                      })
                    }
                    else if (currentPhase == "voting"){
                      electionInstance.getWinner().then(function(myWinner) {
                        $("#details").html("Top runnner: "+myWinner);
                      })
                    }
                    else{
                      $("#details").html("Voting has not started");
                    }   
            }).catch(function(err){
              console.error(err);
            })
    } catch (error) {
        console.warn(error);
    }
    return App.getRemainingTime();

  },

  handleOTP:  function(){
    const name =  $("#name-reg2").val();
    const surname = $("#surname-reg2").val();
    const person_id= $("#personID-reg2").val();
    const email = $("#email-reg2").val(); 
    const checkOTP = $("#otp2000").val(); 
   
    $("#myOTP").fadeTo( "fast" , 0);
    const otpCode= $("#otp-reg").val();  
    console.log(name)
    const result = person_id.replace(/[^a-zA-Z0-9 ]/g, '')?.length || 0;
    const result2 = person_id?.length || 0;

    $.getJSON("ids.json", function(election) {
      var electionInstance;
      const myArray = election.data;
      // Conditions  
        if (result >= 10  &&  result == result2 && JSON.stringify(myArray).includes(person_id)){ 
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){  
            if ( checkOTP == otpCode){          
                  App.contracts.Election.deployed().then(function(instance){
                    electionInstance = instance;
                    return electionInstance.phase();
                    }).then(function(result){ 
                      if(result =="registration")  {
                        return electionInstance.addVoter(person_id, email, name, surname, { from: App.account }).then(function(result){ 
                          alert("You have been registered!");
                          // $("#demo_form").trigger("reset"); 
                          window.location.replace("/register")
                          voted = true;
                          return true;
                        });
                      }
                      else{
                        alert("You can only register during the registration phase.");
                        // return false;
                        window.location.replace("/register")
                      }
                      
                    }).catch(function(err){
                      console.error(err);
                    })
                  }else{
                      alert("Invalid OTP, please re-register")
                      window.location.replace("/register")
                  }

          } else {
            alert("Invalid Email Address...!!!");
            // return false;
            window.location.replace("/register")
            }

      } else {
          alert("Invalid identification number!");
          // return false;
          window.location.replace("/register")
        }
        

    });

  },

};

$(function() {
 
  $(window).load(function() {
    App.init();  
   
  });
});
