// SPDX-License-Identifier: MIT;
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint public totalWaves;
    mapping(address => uint) public waveCount;
    struct WaveInfo {
        address account;
        uint timestamp;
        string tweet;
    }

    WaveInfo[] public waveStore;
    mapping(address => string) public username;
    mapping(string => bool) public usernameIsPresent;

    constructor() {
        console.log("Hello, I'm WavePortal smart contract");
    }

    modifier validUsername(string memory name) {
        require(!usernameIsPresent[name], "Username already exists!");
        _;
    }

    function wave(string memory message) public {
        totalWaves++;
        waveCount[msg.sender]++;
        waveStore.push(WaveInfo({
            account: msg.sender,
            timestamp: block.timestamp,
            tweet: message
        }));
        console.log("%s has waved", msg.sender);
    }

    function getTotalWaves() public view returns(uint) {
        console.log("total waves: %d", totalWaves);
        return totalWaves;
    }

    function getWaveCount(address user) public view returns(uint) {
        console.log("%s waved %d times", user, waveCount[user]);
        return waveCount[user];
    }

    function setUsername(string memory name) public validUsername(name) {
        username[msg.sender] = name;
        usernameIsPresent[name] = true;
    }

    function getUsername(address addr) public view returns(string memory) {
        return username[addr];
    }

    function getWaveInfo(uint index) public view returns(WaveInfo memory) {
        return waveStore[index];
    }
    
    function award(address payable _receiver) public payable {
        _receiver.transfer(msg.value);
    }

}
