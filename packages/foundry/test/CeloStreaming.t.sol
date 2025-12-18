// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/CeloStreaming.sol";

/**
 * @title CeloStreamingTest
 * @notice Comprehensive security and functionality tests for CeloStreaming
 */
contract CeloStreamingTest is Test {
    CeloStreaming public streaming;
    address public owner;
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    
    uint256 public constant CAP = 100 ether;
    uint256 public constant DURATION = 100 days;

    event AddStream(address indexed recipient, uint256 cap, uint256 duration, address token);
    event Withdraw(address indexed user, uint256 amount, address token);

    function setUp() public {
        owner = address(this);
        streaming = new CeloStreaming();
        
        // Fund the treasury with native CELO
        vm.deal(address(streaming), 1000 ether);
    }

    /**
     * @notice Test 1: Verify Time-Shift math over time
     */
    function test_StreamingMathOverTime() public {
        // 1. Create a stream for Alice
        streaming.addStream(alice, CAP, DURATION, address(0));

        // 2. Warp time forward by 50 days (50% of duration)
        vm.warp(block.timestamp + 50 days);

        // 3. Alice should have exactly 50 ether unlocked
        uint256 available = streaming.unlockedBalance(alice);
        assertEq(available, 50 ether, "50% time should unlock 50% funds");

        // 4. Alice withdraws 10 ether
        vm.prank(alice);
        streaming.withdraw(10 ether);

        // 5. Check 'Time-Shift': Alice should still have 40 ether available 
        // because the timer only moved forward by 10 days worth of value.
        assertEq(streaming.unlockedBalance(alice), 40 ether, "Time-Shift math failed");
    }

    /**
     * @notice Test 2: Verify full stream withdrawal after complete duration
     */
    function test_FullWithdrawalAfterDuration() public {
        streaming.addStream(alice, CAP, DURATION, address(0));

        // Warp to end of stream
        vm.warp(block.timestamp + DURATION);

        // Alice should have full cap available
        assertEq(streaming.unlockedBalance(alice), CAP);

        // Alice withdraws everything
        vm.prank(alice);
        streaming.withdraw(CAP);

        // Balance should be zero now
        assertEq(streaming.unlockedBalance(alice), 0);
    }

    /**
     * @notice Test 3: Verify batch stream addition
     */
    function test_BatchAddStreams() public {
        address[] memory recipients = new address[](3);
        recipients[0] = alice;
        recipients[1] = bob;
        recipients[2] = makeAddr("charlie");

        uint256[] memory caps = new uint256[](3);
        caps[0] = 100 ether;
        caps[1] = 200 ether;
        caps[2] = 300 ether;

        uint256[] memory durations = new uint256[](3);
        durations[0] = 100 days;
        durations[1] = 200 days;
        durations[2] = 300 days;

        address[] memory tokens = new address[](3);
        tokens[0] = address(0);
        tokens[1] = address(0);
        tokens[2] = address(0);

        streaming.batchAddStreams(recipients, caps, durations, tokens);

        // Verify each stream was created
        (uint256 aliceCap,,,) = streaming.streams(alice);
        (uint256 bobCap,,,) = streaming.streams(bob);
        
        assertEq(aliceCap, 100 ether);
        assertEq(bobCap, 200 ether);
    }

    /**
     * @notice Test 4: Revert on insufficient unlocked balance
     */
    function test_RevertOnInsufficientBalance() public {
        streaming.addStream(alice, CAP, DURATION, address(0));

        // Only warp 10 days (10 ether unlocked)
        vm.warp(block.timestamp + 10 days);

        // Try to withdraw 20 ether (more than unlocked)
        vm.prank(alice);
        vm.expectRevert("StreamWeavers: Amount exceeds unlocked balance");
        streaming.withdraw(20 ether);
    }

    /**
     * @notice Test 5: Revert on zero withdrawal
     */
    function test_RevertOnZeroWithdrawal() public {
        streaming.addStream(alice, CAP, DURATION, address(0));
        
        vm.warp(block.timestamp + 10 days);

        vm.prank(alice);
        vm.expectRevert("StreamWeavers: Cannot withdraw zero");
        streaming.withdraw(0);
    }

    /**
     * @notice Test 6: Only owner can add streams
     */
    function test_OnlyOwnerCanAddStream() public {
        vm.prank(alice);
        vm.expectRevert();
        streaming.addStream(bob, CAP, DURATION, address(0));
    }

    /**
     * @notice Test 7: Events are emitted correctly
     */
    function test_EventsEmitted() public {
        vm.expectEmit(true, false, false, true);
        emit AddStream(alice, CAP, DURATION, address(0));
        streaming.addStream(alice, CAP, DURATION, address(0));

        vm.warp(block.timestamp + 50 days);

        vm.prank(alice);
        vm.expectEmit(true, false, false, true);
        emit Withdraw(alice, 10 ether, address(0));
        streaming.withdraw(10 ether);
    }

    /**
     * @notice Test 8: Gas efficiency check
     */
    function test_GasEfficiency() public {
        streaming.addStream(alice, CAP, DURATION, address(0));
        vm.warp(block.timestamp + 50 days);

        vm.prank(alice);
        uint256 gasBefore = gasleft();
        streaming.withdraw(10 ether);
        uint256 gasUsed = gasBefore - gasleft();

        // Verify withdrawal costs less than 80k gas
        assertLt(gasUsed, 80000, "Withdraw function exceeds 80k gas limit");
    }

    /**
     * @notice Test 9: Receive function accepts CELO
     */
    function test_ReceiveCELO() public {
        uint256 balanceBefore = address(streaming).balance;
        
        vm.deal(alice, 10 ether);
        vm.prank(alice);
        (bool success,) = address(streaming).call{value: 5 ether}("");
        
        assertTrue(success);
        assertEq(address(streaming).balance, balanceBefore + 5 ether);
    }
}
