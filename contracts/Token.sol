pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Token is ERC1155 {

    constructor() ERC1155(""){}

    function mint(uint256 _id) public {
        _mint(msg.sender, _id, 1, "");
    }
}