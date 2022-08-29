// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

contract SimpleNft is ERC721Enumerable {
  constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

  function mint(address to) external {
    _safeMint(to, totalSupply());
  }
}
