// SPDX-License-Identifier: MIT 
pragma solidity  ^0.8.0;
import "./EllipticCurve.sol";
import "@openzeppelin/contracts/utils/Strings.sol";



contract Election { 

    struct voter {
        bytes32 personal_id; //their personal id
        bool hasVoted; //have they voted
        address public_Address; //public address to wallet
        string email; //email address for communication
        string name; //name of voter 
        string surname; 
        string refNUm; 
        bool isRegistered;
        uint256 PrivateKey;
        bool  isVerifiedUser;
        uint position;
    }
 
    struct votingRecords{
        string ref;
        string voteDate;
        string voteTime;
        bool isVerified;
    }

    


     // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }
    //ECC CONSTANTS - SECPTIC256
    uint256 private constant GX = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
    uint256 private constant GY = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;
    uint256 private constant AA = 0;
    uint256 private constant BB = 7;
    uint256 private constant PP = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;

    // Read/write candidate
    mapping(uint => Candidate) public candidates;

    // Store accounts that have voted
    mapping(address => voter) private voters;

    mapping(uint => votingRecords) public votingTrails;

    // Stores encyrted ID'S
    mapping(bytes32 => address) private verifier;
    mapping(uint => address) private recorder;

    mapping(bytes32 => bool) private adminSignatures; //saves history of Admin signature to curb Signature Replay Attack


    // Store Candidates Count
    uint public candidatesCount;

    // Stores Election phase
    string public phase;

    uint private minimum_candidates =2;
    uint private minVotes = 2;

    // Store number of voters
    uint public votersCount;

    //number of total votes
    uint public numVotes;

    string[3] phases = ["registration" , "voting", "results"];
    uint private phasePointer;

    // Admin is set once, when contract is deployed. Also saves gas fees
    address private admin;

    constructor(){ 
        admin = msg.sender; //the deployer of the contract is the admin
        phase="Election has not started";
    } 

    modifier onlyAdmin(){
		require(msg.sender==admin, "Only Admin can perform this function");
		_;
	}

       // Add a candidate
    function addCandidate (string memory _name, string memory _party) onlyAdmin public {
        require(phasePointer<=0, "Cannot add candidates during voting process");
        candidatesCount ++;
        candidates[candidatesCount] = Candidate({
            id: candidatesCount, 
            name: _name,
            party: _party, 
            voteCount: 0
            });
    }


     // Add a voter
    function addVoter (string memory _personal_id, string memory _email, string memory _name, string memory _surname, string memory _ref) public {
            require(msg.sender != admin, "Admin Cannot register"); //require that the user is not registered
            address _pAdress = msg.sender; 
            bytes32 encrypt_id = keccak256_encrypt(_personal_id);  //encrypt personal id
            voter storage user = voters[_pAdress];
            require(!user.isRegistered, "The public address already in use"); //require that the user is not registered

            //require that personal_id is not already in use
            require(verifier[encrypt_id] == 0x0000000000000000000000000000000000000000, "Personal ID already in use");
            recorder[votersCount] = _pAdress;
            voters[_pAdress] = voter( {personal_id: encrypt_id, 
                            hasVoted:false, 
                            public_Address:_pAdress,
                            email: _email, 
                            name:_name, 
                            surname: _surname, 
                            refNUm: _ref,
                            isRegistered:true,
                            PrivateKey:0,
                            isVerifiedUser:false,
                            position:0
                    });
            
           
            verifier[encrypt_id] = _pAdress;
            votersCount ++;
            
    }

    //get voter details to display to voter
    function getVoter() public view returns(string memory, string memory, string memory, string memory, bool, bool, bool){
            return(voters[msg.sender].name, voters[msg.sender].surname, voters[msg.sender].email, 
            voters[msg.sender].refNUm, voters[msg.sender].isRegistered, voters[msg.sender].hasVoted, voters[msg.sender].isVerifiedUser);             
    }

    //returns true if voter registered
    function isVoter_Registered() public view returns (bool){
        return voters[msg.sender].isRegistered;
    }

    
  // https://stackoverflow.com/questions/73555009/how-to-generate-random-words-in-solidity-based-based-on-a-string-of-letters/73557284#73557284
  function random() public view returns (uint) {
        return uint (keccak256(abi.encodePacked (block.timestamp, msg.sender, address(this))));
     }

     //returns true if voter registered
    function has_Voted() public view returns (bool){
        return voters[msg.sender].hasVoted;
    }

    // voting function, all accounts can vote
    function vote (uint _candidateId, string memory _date, string memory _time) public {

        //must be registered to vote
        require(voters[msg.sender].isRegistered, "Only registered users can vote");

        // require that they haven't voted before
        require(!voters[msg.sender].hasVoted, "Already Voted"); 
        
        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender].hasVoted = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++; //add vote to candidate

        voters[msg.sender].PrivateKey = random();  //CREATE PRIVATE KEY *****
    
        votingTrails[numVotes] = votingRecords({ //keep record of vote
                                                ref:voters[msg.sender].refNUm,
                                                voteDate:_date,
                                                voteTime:_time,
                                                isVerified:false
                                         });
        voters[msg.sender].position = numVotes; //store position of vote
        numVotes++; //increase vote count
        
    }

    //Return voter keys
     function copyKeys() public view returns(string memory, string memory){
            (uint256 p1, uint256 p2) = EllipticCurve.ecMul(voters[msg.sender].PrivateKey,GX,GY,AA,PP); 
            while(!EllipticCurve.isOnCurve(p1, p2, AA, BB, PP)){ //If points returned are not on the curve, iterate again
                 (p1, p2) = EllipticCurve.ecMul(voters[msg.sender].PrivateKey,GX,GY,AA,PP); 
            }
            return (Strings.toString(p1), Strings.toString(p2));          
    }
 
    //verify vote
    function verifyVote(uint _key1, uint _key2) public{
                 //must be registered to vote
        require(voters[msg.sender].isRegistered, "Only registered users can vote");

        // require that they haven't voted before
        require(voters[msg.sender].hasVoted, "Already Voted");

        require(!voters[msg.sender].isVerifiedUser, "Voter already voted");

        (uint256 p1, uint256 p2) = EllipticCurve.ecMul(voters[msg.sender].PrivateKey,GX,GY,AA,PP); //creating public keys from the user address

        if(p1==_key1 && _key2==p2 ){ //public keys match
            votingTrails[voters[msg.sender].position].isVerified = true;
            voters[msg.sender].isVerifiedUser = true;
        }
    }

    // start election
    function startElection() onlyAdmin public {
            require(phasePointer!=1 && phasePointer!=2, "Voting in progress");
            phasePointer = 0;
            phase = phases[phasePointer]; //contract is deployed in the registration phase
    
    }

    //change election phase
    function changePhase() onlyAdmin public {
        phasePointer++;
        if (phasePointer <3) {
            if(phasePointer == 1){ //from registration to voting
                require(votersCount>candidatesCount, "Not Enough Voters"); //3 VOTES, 2 CANDIDATES
                require(candidatesCount>=minimum_candidates, "Not Enough Candidates"); //MINIMUM OF 2 CANDIDATES
                phase = phases[phasePointer];
            }
             if(phasePointer == 2){ //from voting to results
                require(numVotes>=minVotes, "Not Enough Votes"); //MINIMUM OF 2 VOTES
                phase = phases[phasePointer];
            }            
        } else {
            phase = "Election ended";
        }

    }


    //hash function
    function keccak256_encrypt(string memory text) public pure returns (bytes32) {
        return keccak256(abi.encode(text));
    }

    function getWinner() public view returns(string memory) {
        uint winner = 1;
        uint voterS = candidates[1].voteCount;
        for (uint index = 2; index <=  candidatesCount; index++) {
            if(candidates[index].voteCount > voterS){
                winner = index;
                voterS = candidates[index].voteCount;
                }
        }
        return (candidates[winner].name);

    }


    //<----------------------------------- Verifies signed message -------------------------------->
    function verify (string memory _message, bytes memory _sig, uint _nonce) onlyAdmin public returns (bool) {
        bytes32 hash_SMS = getHash(_message, _nonce);
        require(!adminSignatures[hash_SMS], "Has been executed"); //must be a new signature
        bytes32 ethSignedMessageHash = getEthSignedHash(hash_SMS);
        adminSignatures[hash_SMS] = true;
        return recover(ethSignedMessageHash, _sig) == admin;
    }
    
    //has a tring
    function getHash (string memory sms, uint _nonce) public pure returns (bytes32){
        return keccak256(abi.encodePacked(sms, _nonce));
    }


    function getEthSignedHash (bytes32 sms) public pure returns (bytes32){
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", sms));
    }


    //recover account of original signer of message
    function recover(bytes32 _ethSignedMessageHash, bytes memory _sig) public pure returns (address){
            (bytes32 r, bytes32 s, uint8 v) = _split(_sig); //split signature into params
            return ecrecover(_ethSignedMessageHash, v, r, s); //returns the address of the signer given the signed message
    }

    function _split(bytes memory _sig) internal pure returns (bytes32 r, bytes32 s, uint8 v){
            require(_sig.length == 65, "invalid signature length");

            assembly {
                r := mload(add(_sig, 32))  //skip first 32-byetes as they hold the length
                s := mload(add(_sig, 64))
                v := byte(0, mload(add(_sig, 96)))

            }
    }

    //<----------------------------------- ECC CRYPTOGRAPHY -------------------------------->

}