pragma solidity >=0.5.0;

contract Election { 

    struct voter {
        string personal_id; //their personal id
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

        // Store accounts that have voted
    mapping(uint => address) public positions;

    // Store Candidates Count
    uint public candidatesCount;

    // Store Candidates Count
    uint public votersCount;

    // Constructor
    address public admin;

    constructor() public { 
        admin = msg.sender;
        addCandidate("Candidate 1", "EEF"); 
        addCandidate("Candidate 2", "ABC");
        addCandidate("Candidate 3", "BA");
        addCandidate("Candidate 4", "NFP");
    } 

       // Add a candidate
    function addCandidate (string memory _name, string memory _party) private {
        require(msg.sender == admin, "Only Admin can add a candidate");
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _party, 0);
    }

          // Add a candidate
    function addVoter (string memory _personal_id, string memory _email, string memory _name, string memory _surname) public {
            address _pAdress = msg.sender; 
            voter storage user = voters[_pAdress];
            require(!user.isRegistered); //require that the user is not registered
            votersCount ++;
            voters[_pAdress] = voter( {personal_id: _personal_id, 
                            hasVoted:false, 
                            public_Address:_pAdress,
                            email: _email, 
                            name:_name, 
                            surname: _surname, 
                            isRegistered:true,
                            voterPosition: votersCount
                    });
            positions[votersCount] = _pAdress;
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
}