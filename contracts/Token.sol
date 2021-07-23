pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Token is ERC1155 {

    constructor() ERC1155("https://raw.githubusercontent.com/thechainn/mytokens/main/metadata/{id}.json"){}

    function mint(uint256 _id) public {
        _mint(msg.sender, _id, 1, "");
    }

    function burn(address _account, uint256 _id, uint256 _amount) public {
        _burn(_account, _id, _amount);
    }

    function setURI(string memory _newuri) public {
        _setURI(_newuri);
    }
}