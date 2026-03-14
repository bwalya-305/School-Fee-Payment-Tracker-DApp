// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {SchoolFeeTracker} from "../src/SchoolFeeTracker.sol";

contract SchoolFeeTrackerTest is Test {
    SchoolFeeTracker public tracker;
    address public student = makeAddr("student");

    function setUp() public {
        tracker = new SchoolFeeTracker();
    }

    function test_SuccessfulPayment() public {
        // Give the student some ETH
        vm.deal(student, 10 ether);

        // Act as the student
        vm.prank(student);
        tracker.payFee{value: 1 ether}("STU-001");

        // Assert: Check if the balance was recorded correctly
        assertEq(tracker.getStudentTotalPaid("STU-001"), 1 ether);
        
        console.log("Payment recorded successfully for STU-001");
    }

    function test_FailZeroPayment() public {
        vm.prank(student);
        // This should fail because we require value > 0
        vm.expectRevert("Fee must be greater than zero");
        tracker.payFee{value: 0}("STU-001");
    }
}