pragma solidity >=0.5.0;

contract Election { 

    struct voter {
        bytes32 personal_id; //their personal id
        bool hasVoted; //have they voted
        address public_Address; //public address to wallet
        string email; //email address for communication
        string name; //name of voter 
        string surname; 
        bool isRegistered;
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

    // Store Candidates Count
    uint public candidatesCount;

    // Store Candidates Count
    uint public votersCount;

    // Admin is set once, when contract is deployed. Also saves gas fees
    address public admin;

    constructor() public { 
        admin = msg.sender;
        addCandidate("Candidate 1", "EEF"); 
        addCandidate("Candidate 2", "ABC");
        addCandidate("Candidate 3", "BA");
        addCandidate("Candidate 4", "NFP");
    } 

    modifier onlyAdmin(){
		require(msg.sender==admin, "Only Admin can perform this function");
		_;
	}

       // Add a candidate
    function addCandidate (string memory _name, string memory _party) onlyAdmin public {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _party, 0);
    }

          // Add a voter
    function addVoter (string memory _personal_id, string memory _email, string memory _name, string memory _surname) public {
            address _pAdress = msg.sender; 
            bytes32 encrypt_id = keccak256_encrypt(_personal_id);  //encrypt personal id
            voter storage user = voters[_pAdress];
            require(!user.isRegistered, "The public address already in use"); //require that the user is not registered

            //require that personal_id is not already in use
            require(verifier[encrypt_id] == 0x0000000000000000000000000000000000000000, "Personal ID already in use");
            votersCount ++;
            voters[_pAdress] = voter( {personal_id: encrypt_id, 
                            hasVoted:false, 
                            public_Address:_pAdress,
                            email: _email, 
                            name:_name, 
                            surname: _surname, 
                            isRegistered:true,
                            voterPosition: votersCount
                    });
            verifier[encrypt_id] = _pAdress;
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
        //where is the data saved
        //describe everything fully-> break it down
    }


    //hash function
    function keccak256_encrypt(string memory text) public pure returns (bytes32) {
        return keccak256(abi.encode(text));
    }

    //<----------------------------------- Verifies signed message -------------------------------->
    function verify (address _signer, string memory _message, bytes memory _sig) public pure returns (bool) {
        bytes32 hash_SMS = getHash(_message);
        bytes32 ethSignedMessageHash = getEthSignedHash(hash_SMS);
        return recover(ethSignedMessageHash, _sig) == _signer;

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
            return ecrecover(_ethSignedMessageHash, v, r,s); //returns the address of the signer given the signed message
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