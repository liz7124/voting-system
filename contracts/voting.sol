// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract voting {
  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  struct Voter {
    bool voted; // true when voter has voted
    bool validated; //true when voter has registered and passed verification process
  }

  mapping(address => Voter) public voters;
  mapping(uint => Candidate) public candidates;

  uint public candCounter;
  uint public voterCounter;

  constructor() {
    addCandidate("Contestant 1"); //fot testing
    addCandidate("Contestant 2"); //testing
    registerVoter(0x6828934Ab026a2C1295Fa75716D9B1B0344092DE); //for testing
  }

  event votedEvent(uint indexed _candId);
  event registrationSuccess(address _voterAddr);

  modifier voterMustNotExist(address _voter) {
    require(!voters[_voter].validated,"voter already registered");
    _;
  }

  modifier voterMustExist(address _voter) {
    require(voters[_voter].validated,"voter registered in the system");
    _;
  }

  function addCandidate (string memory _name) private {
    candCounter++;
    candidates[candCounter] = Candidate(candCounter,_name,0);
  }

  /*function registerVoter(string memory _name, bytes memory signature) public {
    bytes32 hash = keccak256(abi.encodePacked(_name));
    address signer = recover(hash, signature);
    //check signature and check voter hasn't registered before
    if (signer == msg.sender && !voters[msg.sender].validated) {
      voterCounter++;
      voters[msg.sender] = Voter(false,true);
    }
  }*/

  function registerVoter(address addr) public {
  //voterMustNotExist(msg.sender)
    voterCounter++;
    voters[addr] = Voter(false,true);

    emit registrationSuccess(addr);
  }

  //login
  function getVoter(int nounce, bytes memory signature) public voterMustExist(msg.sender) view returns(bool) {
    bytes32 messagehash = keccak256(abi.encodePacked(nounce));
    address signer = recover(messagehash, signature);
    //check signature and check voter is registered before
    if (signer == msg.sender && voters[msg.sender].validated) {
      return(true);
    } else {
      return(false);
    }
  }

  function vote (uint _candId) public {
    //require a registered and valid voters
    require(voters[msg.sender].validated);
    //require voters haven't voted before
    require(!voters[msg.sender].voted);
    //vote a valid candidate
    require(_candId > 0 && _candId <= candCounter);

    voters[msg.sender].voted = true;
    candidates[_candId].voteCount++;

    emit votedEvent(_candId);
  }

  /**
  * @dev Recover signer address from a message by using their signature
  * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
  * @param signature bytes signature, the signature is generated using web3.eth.sign()
  */
  function recover(bytes32 hash, bytes memory signature) public pure returns (address) {
      bytes32 r;
      bytes32 s;
      uint8 v;

      // Check the signature length
      if (signature.length != 65) {
          return (address(0));
      }

      // Divide the signature in r, s and v variables
      // ecrecover takes the signature parameters, and the only way to get them
      // currently is to use assembly.
      // solium-disable-next-line security/no-inline-assembly
      assembly {
          r := mload(add(signature, 0x20))
          s := mload(add(signature, 0x40))
          v := byte(0, mload(add(signature, 0x60)))
      }

      // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
      if (v < 27) {
          v += 27;
      }

      // If the version is correct return the signer address
      if (v != 27 && v != 28) {
          return (address(0));
      } else {
          // solium-disable-next-line arg-overflow
          return ecrecover(hash, v, r, s);
      }
  }
}
