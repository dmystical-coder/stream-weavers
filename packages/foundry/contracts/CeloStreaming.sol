// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CeloStreaming
 * @author StreamWeavers
 * @notice Milestone 1: Foundational Architecture
 * This contract establishes the base for time-based asset distribution on Celo.
 */
contract CeloStreaming is Ownable, ReentrancyGuard {

    // Milestone 2 & 3 will expand this struct
    struct Stream {
        uint256 cap;
        uint256 unlockDuration;
        uint256 lastWithdrawal;
        address tokenAddress; // address(0) for native CELO
    }

    mapping(address => Stream) public streams;

    event FundsReceived(address indexed sender, uint256 amount);
    event AddStream(address indexed recipient, uint256 cap, uint256 duration, address token);

    /**
     * @notice Initializes the contract and sets the deployer as the owner.
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Milestone 1: Fallback function to accept native CELO.
     * This allows the contract to be funded simply by sending CELO to its address.
     */
    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    /**
     * @notice Milestone 1: Helper to check the contract's balance of a specific asset.
     * @param token The address of the ERC20 token, or address(0) for native CELO.
     */
    function getContractBalance(address token) external view returns (uint256) {
        if (token == address(0)) {
            return address(this).balance;
        } else {
            return IERC20(token).balanceOf(address(this));
        }
    }
}
