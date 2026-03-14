// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SchoolFeeTracker} from "../src/SchoolFeeTracker.sol";

contract DeploySchoolFeeTracker is Script {
    function run() external returns (SchoolFeeTracker) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);

        SchoolFeeTracker tracker = new SchoolFeeTracker();

        vm.stopBroadcast();

        console.log("SchoolFeeTracker deployed at:", address(tracker));
        console.log("Owner:", tracker.owner());

        return tracker;
    }
}