// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CeloStreaming
 * @author StreamWeavers
 * @notice Milestone 3: Continuous Withdrawal Logic
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
    event Withdraw(address indexed user, uint256 amount, address token);

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

    /**
     * @notice Milestone 2: Create or Update a stream for a specific recipient.
     * @param _recipient The address that will be able to withdraw funds.
     * @param _cap The total amount of tokens/CELO available for the full duration.
     * @param _unlockDuration The time in seconds it takes for the full cap to be available.
     * @param _tokenAddress The contract address of the asset (address(0) for CELO).
     */
    function addStream(
        address _recipient, 
        uint256 _cap, 
        uint256 _unlockDuration, 
        address _tokenAddress
    ) external onlyOwner {
        require(_recipient != address(0), "StreamWeavers: Invalid recipient");
        require(_cap > 0, "StreamWeavers: Cap must be greater than 0");
        require(_unlockDuration > 0, "StreamWeavers: Duration must be greater than 0");

        // Storing the individual parameters in the mapping
        // We set lastWithdrawal to the current block.timestamp so the stream starts "now"
        streams[_recipient] = Stream({
            cap: _cap,
            unlockDuration: _unlockDuration,
            lastWithdrawal: block.timestamp,
            tokenAddress: _tokenAddress
        });

        emit AddStream(_recipient, _cap, _unlockDuration, _tokenAddress);
    }

    /**
     * @notice Milestone 2: Batch Add Streams (Efficiency Enhancement)
     * Allows the owner to set up multiple contributors in one transaction.
     */
    function batchAddStreams(
        address[] calldata _recipients,
        uint256[] calldata _caps,
        uint256[] calldata _durations,
        address[] calldata _tokens
    ) external onlyOwner {
        require(_recipients.length == _caps.length && _caps.length == _durations.length && _durations.length == _tokens.length, "StreamWeavers: Length mismatch");
        
        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "StreamWeavers: Invalid recipient");
            require(_caps[i] > 0, "StreamWeavers: Cap must be greater than 0");
            require(_durations[i] > 0, "StreamWeavers: Duration must be greater than 0");

            streams[_recipients[i]] = Stream({
                cap: _caps[i],
                unlockDuration: _durations[i],
                lastWithdrawal: block.timestamp,
                tokenAddress: _tokens[i]
            });

            emit AddStream(_recipients[i], _caps[i], _durations[i], _tokens[i]);
        }
    }

    /**
     * @notice Milestone 3: Calculate the current withdrawable balance for a user.
     * @param _user The address of the stream recipient.
     * @return The amount of tokens/CELO currently unlocked.
     */
    function unlockedBalance(address _user) public view returns (uint256) {
        Stream memory stream = streams[_user];
        if (stream.cap == 0) return 0;

        uint256 timeElapsed = block.timestamp - stream.lastWithdrawal;
        
        // Formula: (Cap * TimeElapsed) / TotalDuration
        // We multiply before dividing to maintain maximum precision in Solidity
        uint256 unlocked = (stream.cap * timeElapsed) / stream.unlockDuration;
        
        // Safety: Ensure we never return more than the total cap
        return unlocked > stream.cap ? stream.cap : unlocked;
    }

    /**
     * @notice Milestone 3: The 'Time-Shift' Withdrawal mechanism.
     * @param _amount The amount the user wishes to withdraw.
     */
    function withdraw(uint256 _amount) external nonReentrant {
        Stream storage stream = streams[msg.sender];
        require(stream.cap > 0, "StreamWeavers: No active stream");

        uint256 available = unlockedBalance(msg.sender);
        require(_amount <= available, "StreamWeavers: Amount exceeds unlocked balance");
        require(_amount > 0, "StreamWeavers: Cannot withdraw zero");

        // THE TIME-SHIFT MATH
        // We move the 'lastWithdrawal' timestamp forward by the amount of time 
        // that 'bought' the amount being withdrawn.
        // TimeToShift = (AmountTaken * TotalDuration) / TotalCap
        uint256 timeToShift = (_amount * stream.unlockDuration) / stream.cap;
        stream.lastWithdrawal += timeToShift;

        // Perform the asset transfer
        if (stream.tokenAddress == address(0)) {
            require(address(this).balance >= _amount, "StreamWeavers: Insufficient CELO in treasury");
            (bool success, ) = payable(msg.sender).call{value: _amount}("");
            require(success, "StreamWeavers: CELO transfer failed");
        } else {
            require(
                IERC20(stream.tokenAddress).balanceOf(address(this)) >= _amount, 
                "StreamWeavers: Insufficient tokens in treasury"
            );
            bool success = IERC20(stream.tokenAddress).transfer(msg.sender, _amount);
            require(success, "StreamWeavers: Token transfer failed");
        }

        emit Withdraw(msg.sender, _amount, stream.tokenAddress);
    }
}
