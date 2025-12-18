// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/CeloStreaming.sol";

/**
 * @title DeployCeloStreaming
 * @notice Deployment script for CeloStreaming to Celo mainnet/testnet
 * @dev Run with: forge script script/DeployCeloStreaming.s.sol:DeployCeloStreaming --rpc-url celo --broadcast --verify
 */
contract DeployCeloStreaming is Script {
    function run() external {
        // Load the deployer's private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy CeloStreaming contract
        CeloStreaming streaming = new CeloStreaming();

        // Log the deployed address
        console.log("CeloStreaming deployed to:", address(streaming));
        console.log("Deployer (Owner):", msg.sender);

        vm.stopBroadcast();
    }
}
