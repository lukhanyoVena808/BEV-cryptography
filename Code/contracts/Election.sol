pragma solidity >=0.4.22 <0.8.0;

contract Election { 

    // Read/write candidate
    string public candidate; 

    // Constructor
    function Election() public{ 
        candidate = "Candidate 1"; 
    } 
}