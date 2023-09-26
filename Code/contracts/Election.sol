// SPDX-License-Identifier: MIT 
pragma solidity  >=0.5.16;
import "./Secp256k1.sol";

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
        uint256 PublicKey1;
        uint256 PublicKey2;
        uint256 PrivateKey;
        uint voterPosition;
    }


     // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    // Read/write candidate
    mapping(uint => Candidate) public candidates;

    // Store accounts that have voted
    mapping(address => voter) public voters;

     // Stores encyrted ID'S
    mapping(bytes32 => address) public verifier;
    mapping(uint => address) public recorder;
     mapping(string => uint256) public ellipter;

    // Store Candidates Count
    uint public candidatesCount;

    //Secp256k1
    Secp256k1 Secp256k1_Address = new Secp256k1();

    // Stores Election phase
    string public phase;

    // Store number of voters
    uint public votersCount;

    //number of total votes
    uint public numVotes;

    //random number counter
    uint random_counter;

    // Stores current time
    uint public timeNow;

    string[3] phases = ["registration" , "voting", "results"];
    uint public phasePointer;

    // Admin is set once, when contract is deployed. Also saves gas fees
    address private admin;
    uint256 public votingStart;  //start of phase
    uint256 public votingEnd; //end of phase

    constructor() public { 
        admin = msg.sender;
        phase="Election has not started";
    } 

    modifier onlyAdmin(){
		require(msg.sender==admin, "Only Admin can perform this function");
		_;
	}

       // Add a candidate
    function addCandidate (string memory _name, string memory _party) onlyAdmin public {
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
                            PublicKey1:0,
                            PublicKey2:0,
                            PrivateKey:0,
                            voterPosition: votersCount
                    });
            votersCount ++;
            verifier[encrypt_id] = _pAdress;
            
    }

    function getVoter() public view returns(string memory, string memory, string memory, string memory, bool, bool){
            return(voters[msg.sender].name, voters[msg.sender].surname, voters[msg.sender].email, voters[msg.sender].refNUm, voters[msg.sender].isRegistered, voters[msg.sender].hasVoted);             
    }

    //returns true if voter registered
    function isVoter_Registered() public view returns (bool){
        return voters[msg.sender].isRegistered;
    }

     //returns true if voter registered
    function has_Voted() public view returns (bool){
        return voters[msg.sender].hasVoted;
    }

    // voting function, all accounts can vote
    function vote (uint _candidateId) public {

        //must be registered to vote
        require(voters[msg.sender].isRegistered, "Only registered users can vote");

        // require that they haven't voted before
        require(!voters[msg.sender].hasVoted, "Already Voted"); 
        

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender].hasVoted = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        voters[msg.sender].PrivateKey = Secp256k1_Address.invMod(random(), random());
        // adjustTime();
        numVotes++;

    }

  // https://stackoverflow.com/questions/73555009/how-to-generate-random-words-in-solidity-based-based-on-a-string-of-letters/73557284#73557284
  function random() private returns (uint) {
        random_counter++;
        // sha3 and now have been deprecated
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, random_counter)));
        // convert hash to integer
        
    }


    // start election
    function startElection() onlyAdmin public {
            phasePointer = 0;
            phase = phases[phasePointer]; //contract is deployed in the registration phase
            // startTime();
    }

    //change election phase
    function changePhase() onlyAdmin public {
        phasePointer++;
        if (phasePointer <3) {
            phase = phases[phasePointer];
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
    function verify (string memory _message, bytes memory _sig) public view returns (bool) {
        bytes32 hash_SMS = getHash(_message);
        bytes32 ethSignedMessageHash = getEthSignedHash(hash_SMS);
        return recover(ethSignedMessageHash, _sig) == admin;
    }
    
    //has a tring
    function getHash (string memory sms) public pure returns (bytes32){
        return keccak256(abi.encodePacked(sms));
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

}