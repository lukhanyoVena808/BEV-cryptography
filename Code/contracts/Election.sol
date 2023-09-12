pragma solidity >=0.5.0;

contract Election { 

    struct voter {
        uint personal_id; //their personal id
        bool hasVoted; //have they voted
        address public_Address; //public address to wallet
        string email; //email address for communication
        string name; //name of voter 
        string surname; 
        bool isRegistered;
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
    mapping(address => bool) public voters;

    // Store Candidates Count
    uint public candidatesCount;

    // Constructor
    address public admin;

    constructor() public { 
        admin = msg.sender;
        addCandidate("Candidate 1", "EEF"); 
        addCandidate("Candidate 2", "ABC");
        addCandidate("Candidate 3", "BA");
    } 

       // Add a candidate
    function addCandidate (string memory _name, string memory _party) private {
        require(msg.sender == admin);
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _party, 0);
    }

    // voting function, all accounts can vote
    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;
    }
}