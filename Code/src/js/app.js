// un hashed ID's, Hashed ID's in JSON file
// "data":["123456789A","BCDEFGHIJK",
//     "LMNOPQRSTU","987654321B", "VWXYZABCDE",
//     "FGHIJKLMNOP","246813579C","QRSTUVWXYZA",
//     "135792468D","XYZABCDEF12","876543210E",
//     "GHIJKLMNOPQ","314159265F","ABCDEFGHIJKL",
//     "9876543210G","MNOPQRSTUVWXYZ","0123456789H",
//     "UVWXYZABCD","567890123I","EFGHIJKLMNOPQ",
//     "4321098765J"]


App = {

  web3Provider: null,
  contracts: {},
  account: '0x0',
  voted: null,
  adminIn: null,
  adminView: null,
  keyWin:null,
  
  

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
        $("#numOfCandidates").html("Candidates: "+candidatesCount);
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

        electionInstance.votersCount().then(function(res){
          $("#numOfRegistrations").html("Resgistrations: "+res); 
        })

        electionInstance.numVotes().then(function(res){
          $("#numOfVoters").html("Votes: "+res);
        })       
        return electionInstance.isVoter_Registered({from: App.account});
      }).then(function(next) {
        // Do not allow a user to vote, if not registered
          if(!next) { 
            regSMS.show();
            myform.hide();
          }
          else{
            electionInstance.getVoter({from: App.account}).then(async function(voter) {
              const the_voter = $("#voter_info");
              the_voter.empty();
              const v_name = voter[0];
              const v_surname= voter[1];
              const v_email= voter[2];
              const v_ref= voter[3];
              const v_registered= voter[4];
              const v_voted= voter[5];
              const v_verified= voter[6];
              const candidateTemplate = "<tr><th><strong>Name</strong></th><td>" +  v_name + 
                                  "</td></tr>" +"<tr><th><strong>Surname</strong></th><td>" +  v_surname + "</td></tr>"+
                                  "<tr><th><strong>Email</strong></th><td>" +  v_email + "</td></tr>"+
                                  "<tr><th><strong>Is registered?</strong></th><td>" +  v_registered + "</td></tr>"+
                                  "<tr><th><strong>Has Voted?</strong></th><td>" +  v_voted + "</td></tr>"+
                                  "<tr><th><strong>Vote Verified?</strong></th><td>"+ v_verified+"</td></tr>"+
                                  "<tr><th><strong>User Reference Number</strong></th><td>"+ v_ref+"</td></tr>";
                                  
              the_voter.append(candidateTemplate);

            })
          }
          loader.hide();
          return electionInstance.has_Voted({from: App.account});
          }).then(function(next2) { 
            if(next2) {  //has voted already
              myform.hide();    
              electionInstance.copyKeys({from: App.account}).then(function(_keys){  //get keys              
                const p1 = _keys[0];
                const p2 = _keys[1];
                const the_voter = $("#voter_info");
                const candidateTemplate = '<tr  style="word-wrap: break-word"><th><strong>Vote Audit Key 1</strong></th><td>'+ (p1)+'</td></tr>'+
                        '<tr  style="word-wrap: break-word"><th><strong>Vote Audit Key 2</strong></th><td>'+p2+"</td></tr>";
                the_voter.append(candidateTemplate);     
              }).catch(function(error) {
                console.warn(error);
              });
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
      }).catch(function(error) {
        console.warn(error);
      });
      return App.viewData();
  },


  castVote: function() {
    var electionInstance;
    const dt = new Date();
    const fm = new Intl.DateTimeFormat('en-SA', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Africa/Johannesburg' }).format(dt);  //date && time
    const candidateId = $('#candidatesSelect').val();
    var timeS = performance.now();                              //getting time  ----------------------------->
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(candidateId,fm.split(" at")[0].trim(), fm.split(" at")[1].trim(), { from: App.account }); //cast vote
    }).then(function(result) { 
      console.log((performance.now()-timeS)+" milliseconds --"); //getting time  ---------------------------->
      alert("Voting Completed!");
      
      return App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },

  AddCandidate:  function() {   
    // const name =  $("#name-C").val().replace(/[^a-zA-Z0-9 ]/g, ''); 
    const name =  $("#name-C").val().trim().replace(/(<([^>]+)>)/gi, '').replace(/[^a-zA-Z0-9 ]/g, '');
    const surname = $("#surname-C").val().trim().replace(/(<([^>]+)>)/gi, '').replace(/[^a-zA-Z0-9 ]/g, '');
    const party= $("#party-C").val().trim().replace(/(<([^>]+)>)/gi, '').replace(/[^a-zA-Z0-9 ]/g, '');
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
    const  nonce = crypto.getRandomValues(new Uint32Array(1))[0];
    const phraseUp = "electi"+crypto.randomUUID()+"ons2023_nation"+crypto.randomUUID()+"WideSA"+nonce;

    
   
    try {      
      
      ethereum.request({method: "personal_sign", params: [App.account,  web3.sha3(phraseUp)]}).then(function(result){ //bytes of signture
          
          App.contracts.Election.deployed().then(function(instance) {
              return instance.verify(phraseUp , result, { from: App.account }).then(function(result2) {
                  console.log(result2)
                  if(result2){  //signature valid 
                    adminIn.hide();
                    adminView.show();
                    $("#lastLog1").hide();
                    $("#lastLog2").show();
                    alert("Signed In!");
                  }
                  else{
                    alert("Site restricted to Admin only.");
                  }
                  
                  }).catch(function(err){
                    console.error(err);
                  })
            });
    
      }).catch(function(err){
        console.error(err);
      })
      
      
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
    content.show();
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
                    const candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + party + "</td><td>" + voteCount + "</td></tr>";
                    candidatesResults.append(candidateTemplate);
                  });
                }
                
                return electionInstance.phase();
              }).then(function(currentPhase) {
                    if (currentPhase == "results"){
                      $("#lastSolution").show();
                      electionInstance.getWinner().then(function(myWinner) {
                        electionInstance.numVotes().then(function(numVotes){
                          $("#details").html("Winner: "+myWinner+"<br> Total Election Votes: "+numVotes);

                        // LOOP THROUGH VOTE TRAILS
                        $("#dataTrail").show();
                        var trailBody = $("#vote_trail");
                        trailBody.empty();
                        for (let i= 0; i < numVotes; i++) {
                           electionInstance.votingTrails(i).then(function(trail) {                         
                            var refNumber = trail[0];
                            var trail_date = trail[1];
                            var trail_time = trail[2];
                            var trail_verified = trail[3];
                            var btn;
                              if(trail_verified){
                                btn = `<tr style="word-wrap: normal"><td class="input-wrap"><div class="mb-3"><br><button type="submit" class="btn btn-primary" form="trailer${i}" style="background-color:green; pointer-events: none;" >Verified</button></td>`;
                            }else{
                                btn = `<tr style="word-wrap: normal"><td class="input-wrap"><div class="mb-3"><br><button type="submit" class="btn btn-primary" form="trailer${i}" style=" pointer-events: none;" >Not Verified</button></td>`;
                            }
                            var readData = '<td class="input-wrap"><h5>'+refNumber+'</h5></td><td style="margin-right:10px;" class="input-wrap">'+trail_date+'</td><td style="margin-left:10px;" class="input-wrap">'+trail_time+'</td></tr><br>';                  
                            const candidateTemplate = btn+readData;
                            trailBody.append(candidateTemplate);
                          }).catch(function(err){
                            console.error(err);
                          });
                        }
                        })
                      })
                    }
                    else if (currentPhase == "voting"){
                      electionInstance.getWinner().then(function(myWinner) {
                        electionInstance.numVotes().then(function(numVotes){
                          $("#details").html("Top Runner: "+myWinner+"<br> Total Election Votes: "+numVotes);
                        })
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

  handleOTP: function(){
    const name =  $("#name-reg2").val();
    const surname = $("#surname-reg2").val();
    const person_id= $("#personID-reg2").val();
    const email = $("#email-reg2").val(); 
    const checkOTP = $("#otp2000").val(); 
  
   
    $("#myOTP").fadeTo( "fast" , 0);
    const otpCode= $("#otp-reg").val(); 
 
 
    const result = person_id.replace(/[^a-zA-Z0-9 ]/g, '')?.length || 0;
    const result2 = person_id?.length || 0;

    $.getJSON("ids.json", function(election) {
      var electionInstance;
      const myArray = election.data;
      // Conditions  
        if (result >= 10  &&  result == result2 && JSON.stringify(myArray).includes(web3.sha3(person_id))){ 
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){  
            if ( checkOTP == otpCode){          
                  App.contracts.Election.deployed().then(function(instance){
                    electionInstance = instance;
                    return electionInstance.phase();
                    }).then(function(result){ 
                      if(result =="registration")  {
                        electionInstance.addVoter(person_id, email, name, surname, crypto.randomUUID(), { from: App.account }).then(function(result){ 
                          alert("You have been registered!");
                         
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

  verify_audit: function(){
    var electionInstance;
    const p1_name = "#publicKey1-reg";
    const p2_name = "#publicKey2-reg";
    const publicKey1 =  $(p1_name).val().trim();
    const publicKey2 = $(p2_name).val().trim();   
     
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      
      return electionInstance.verifyVote(publicKey1,publicKey2, {from: App.account});
    }).then(function(result){
     
        if(result){
          alert("Processed");
          window.location.replace("/results")
        }
        else{
          alert("Not Verified");
        }
    }).catch(function(err){
      alert("Not Verified");
      console.error(err);
    });
    
  },

};
$(function() {
 
  $(window).load(function() {
    App.init();  
   
  });
});
