// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTStore {
    struct Listing {
        address seller;
        address nft;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    Listing[] public listings;

    event Listed(uint256 indexed listingId, address nft, uint256 tokenId, uint256 price);
    event Sold(uint256 indexed listingId, address buyer);

    function list(address nft, uint256 tokenId, uint256 price) external {
        IERC721(nft).transferFrom(msg.sender, address(this), tokenId);
        listings.push(Listing(msg.sender, nft, tokenId, price, true));
        emit Listed(listings.length - 1, nft, tokenId, price);
    }

    function buy(uint256 listingId) external payable {
        Listing storage l = listings[listingId];
        require(l.active, "not active");
        require(msg.value == l.price, "wrong price");

        l.active = false;
        IERC721(l.nft).transferFrom(address(this), msg.sender, l.tokenId);
        (bool ok, ) = l.seller.call{value: msg.value}("");
        require(ok, "transfer failed");

        emit Sold(listingId, msg.sender);
    }

    function getAllListings() external view returns (Listing[] memory) {
        return listings;
    }
}
