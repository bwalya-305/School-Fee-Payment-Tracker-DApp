// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SchoolFeeTracker {
    address public admin;

    struct Receipt {
        string studentId;
        uint256 amount;
        uint256 timestamp;
        bool exists;
    }

    // Mapping from transaction hash to Receipt data
    mapping(bytes32 => Receipt) public receipts;
    // Mapping to keep track of total paid by a student ID
    mapping(string => uint256) public balancePaid;

    event FeePaid(address indexed payer, string studentId, uint256 amount, uint256 timestamp, bytes32 receiptHash);

    constructor() {
        admin = msg.sender;
    }

    // Function to pay fees
    function payFees(string memory _studentId) public payable {
        require(msg.value > 0, "Payment must be greater than 0");

        // Create a unique receipt hash based on the transaction
        bytes32 receiptHash = keccak256(abi.encodePacked(msg.sender, _studentId, msg.value, block.timestamp));

        receipts[receiptHash] = Receipt({
            studentId: _studentId,
            amount: msg.value,
            timestamp: block.timestamp,
            exists: true
        });

        balancePaid[_studentId] += msg.value;

        emit FeePaid(msg.sender, _studentId, msg.value, block.timestamp, receiptHash);
    }

    // Function to verify a receipt via its hash
    function verifyReceipt(bytes32 _receiptHash) public view returns (string memory, uint256, uint256) {
        require(receipts[_receiptHash].exists, "Receipt does not exist");
        Receipt memory r = receipts[_receiptHash];
        return (r.studentId, r.amount, r.timestamp);
    }
}