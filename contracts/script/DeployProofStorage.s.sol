//SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ProofStorage} from "../src/ProofStorage.sol";

contract DeployProofStorage is Script {
    function run() external {
        //Get private key from .env
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);
        ProofStorage proofStorage = new ProofStorage();
        vm.stopBroadcast();
        console.log("ProofStorage deployed at:", address(proofStorage));
    }
}