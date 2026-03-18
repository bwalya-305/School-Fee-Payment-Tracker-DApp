// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/SchoolFeeTracker.sol";

contract DeploySchoolFeeTracker is Script {
    function run() external {
        vm.startBroadcast();
        new SchoolFeeTracker();
        vm.stopBroadcast();
    }
}