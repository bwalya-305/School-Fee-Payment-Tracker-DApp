// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SchoolFeeTracker
 * @dev Tracks school fee payments with on-chain receipt proof
 */
contract SchoolFeeTracker is Ownable {

    // ─── Structs ────────────────────────────────────────────────────────────
    struct Receipt {
        string  studentId;
        uint256 amount;
        uint256 timestamp;
        bool    exists;
    }

    // ─── State Variables ─────────────────────────────────────────────────────
    mapping(string  => uint256)  private _studentBalances;
    mapping(bytes32 => Receipt)  public  receipts;

    // ─── Events ──────────────────────────────────────────────────────────────
    event FeePaid(
        address indexed payer,
        string          studentId,
        uint256         amount,
        uint256         timestamp,
        bytes32         receiptHash
    );
    event FundsWithdrawn(address indexed owner, uint256 amount);

    // ─── Constructor ─────────────────────────────────────────────────────────
    constructor() Ownable(msg.sender) {}

    // ─── External / Public Functions ─────────────────────────────────────────

    /**
     * @dev Pay school fees for a student. Generates a unique receipt hash.
     * @param _studentId The student's unique identifier string
     */
    function payFee(string memory _studentId) external payable {
        require(msg.value > 0, "Fee must be greater than zero");
        require(bytes(_studentId).length > 0, "Student ID cannot be empty");

        bytes32 receiptHash = keccak256(
            abi.encodePacked(msg.sender, _studentId, msg.value, block.timestamp)
        );

        require(!receipts[receiptHash].exists, "Duplicate receipt");

        receipts[receiptHash] = Receipt({
            studentId : _studentId,
            amount    : msg.value,
            timestamp : block.timestamp,
            exists    : true
        });

        _studentBalances[_studentId] += msg.value;

        emit FeePaid(msg.sender, _studentId, msg.value, block.timestamp, receiptHash);
    }

    /**
     * @dev Returns total amount paid by a specific student.
     * @param _studentId The student's unique identifier string
     */
    function getStudentTotalPaid(string memory _studentId) external view returns (uint256) {
        return _studentBalances[_studentId];
    }

    /**
     * @dev Verifies a receipt hash and returns its details.
     * @param _receiptHash The keccak256 hash of the receipt
     */
    function verifyReceipt(bytes32 _receiptHash)
        external
        view
        returns (string memory studentId, uint256 amount, uint256 timestamp)
    {
        require(receipts[_receiptHash].exists, "Receipt does not exist");
        Receipt memory r = receipts[_receiptHash];
        return (r.studentId, r.amount, r.timestamp);
    }

    /**
     * @dev Allows the school admin to withdraw all collected fees.
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        emit FundsWithdrawn(owner(), balance);
    }
}