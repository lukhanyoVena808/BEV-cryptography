// SPDX-License-Identifier: MIT 
pragma solidity  ^0.8.0;
import "./Election.sol";

contract Attack {
    address public owner;
    Election election;

    constructor() {
        owner = msg.sender;
    }
    
    function attack() public {
        election.addCandidate("MJ", "WFC") ;
    }
}