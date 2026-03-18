# 🎓 School Fee Payment Tracker DApp

A full-stack Web3 decentralized application for tracking school fee payments on the Ethereum blockchain. Every payment generates a tamper-proof, on-chain receipt hash that can be independently verified at any time — no middlemen, no trust required.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Smart Contract](#smart-contract)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Frontend Pages](#frontend-pages)
- [Contract on Etherscan](#contract-on-etherscan)
- [License](#license)

---

## Overview

The School Fee Payment Tracker DApp solves a critical transparency problem in educational institutions — the inability to independently verify fee payments without relying on a central authority.

By recording every payment on the Ethereum blockchain, this DApp provides:
- **Immutable proof of payment** via on-chain receipt hashes
- **Transparent fee records** accessible to students, parents, and administrators
- **Trustless verification** — anyone can verify a receipt without contacting the school
- **Secure fund management** with admin-only withdrawal controls

---

## Features

- ✅ **Pay Fees** — Submit fee payments on-chain with a student ID
- ✅ **Receipt Generation** — Every payment generates a unique `keccak256` receipt hash
- ✅ **Verify Receipt** — Look up any receipt hash to confirm payment details
- ✅ **Balance Lookup** — Check total fees paid by any student ID
- ✅ **Transaction History** — View full on-chain payment history for a student
- ✅ **Admin Withdrawal** — School admin can securely withdraw collected fees
- ✅ **Wallet Integration** — RainbowKit + wagmi for seamless wallet connection
- ✅ **Sepolia Testnet** — Deployed and verified on Ethereum Sepolia

---

## Tech Stack

### Smart Contract
| Tool | Purpose |
|---|---|
| Solidity `^0.8.20` | Smart contract language |
| Foundry | Contract development, testing & deployment |
| OpenZeppelin | `Ownable` access control |
| Sepolia Testnet | Deployment network |

### Frontend
| Tool | Purpose |
|---|---|
| Next.js 16 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| wagmi v2 | Ethereum React hooks |
| viem v2 | Ethereum interactions |
| RainbowKit v2 | Wallet connection UI |
| TanStack Query | Async state management |

---

## Project Structure

```
School-Fee-Payment-Tracker-DApp/
│
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Pay Fees page (homepage)
│   ├── verify/page.tsx           # Verify Receipt page
│   ├── balance/page.tsx          # Student Balance Lookup page
│   ├── history/page.tsx          # Transaction History page
│   ├── layout.tsx                # Root layout with providers
│   ├── providers.tsx             # wagmi + RainbowKit providers
│   └── globals.css               # Global styles
│
├── components/                   # Shared React components
│
├── contracts/                    # Foundry project
│   ├── src/
│   │   └── SchoolFeeTracker.sol  # Main smart contract
│   ├── test/
│   │   └── SchoolFeeTracker.t.sol# Contract tests
│   ├── script/
│   │   └── DeploySchoolFeeTracker.s.sol  # Deployment script
│   ├── lib/                      # Forge dependencies
│   └── foundry.toml              # Foundry configuration
│
├── lib/
│   └── contract.ts               # Contract ABI + address config
│
├── public/                       # Static assets
├── types/                        # TypeScript type definitions
├── .env.local                    # Frontend environment variables
└── package.json                  # Node dependencies
```

---

## Smart Contract

**Contract:** `SchoolFeeTracker.sol`
**Network:** Ethereum Sepolia Testnet
**Address:** `0xd139E83fEFc1a54109EC14784e92e268467F8D4A`

### Key Functions

```solidity
// Pay school fees for a student
function payFee(string memory _studentId) external payable

// Get total fees paid by a student
function getStudentTotalPaid(string memory _studentId) external view returns (uint256)

// Verify a receipt hash on-chain
function verifyReceipt(bytes32 _receiptHash) external view returns (string memory, uint256, uint256)

// Admin withdraw collected fees (onlyOwner)
function withdraw() external onlyOwner
```

### Events

```solidity
event FeePaid(address indexed payer, string studentId, uint256 amount, uint256 timestamp, bytes32 receiptHash);
event FundsWithdrawn(address indexed owner, uint256 amount);
```

---

## Getting Started

### Prerequisites

- Node.js `>= 20.9.0`
- [Foundry](https://getfoundry.sh/) installed
- MetaMask or any Web3 wallet
- Sepolia testnet ETH ([faucet](https://sepoliafaucet.com))

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/bwalya-305/School-Fee-Payment-Tracker-DApp.git
cd School-Fee-Payment-Tracker-DApp
```

**2. Install frontend dependencies:**
```bash
npm install
```

**3. Install contract dependencies:**
```bash
cd contracts
git submodule update --init --recursive
```

**4. Set up environment variables** (see [Environment Variables](#environment-variables))

**5. Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xd139E83fEFc1a54109EC14784e92e268467F8D4A
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key
```

Create a `.env` file inside `contracts/` for deployments:

```env
PRIVATE_KEY=0xyour_wallet_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

> ⚠️ Never commit `.env` or `.env.local` to version control.

---

## Running Tests

```bash
cd contracts
forge test -vv
```

Expected output:
```
[PASS] test_SuccessfulPayment() (gas: 138077)
[PASS] test_FailZeroPayment() (gas: 11921)

Suite result: ok. 2 passed; 0 failed; 0 skipped
```

---

## Deployment

**1. Load environment variables:**
```bash
cd contracts
source ../.env
```

**2. Deploy to Sepolia:**
```bash
forge script script/DeploySchoolFeeTracker.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --chain-id 11155111 \
  -vvvv
```

**3. Update your `.env.local`** with the deployed contract address.

---

## Frontend Pages

| Page | Route | Description |
|---|---|---|
| Pay Fees | `/` | Submit a fee payment for a student ID |
| Verify Receipt | `/verify` | Verify a receipt hash on-chain |
| Check Balance | `/balance` | Look up total fees paid by a student |
| Transaction History | `/history` | View full payment history for a student |

---

## Contract on Etherscan

View the verified contract on Sepolia Etherscan:

🔗 [https://sepolia.etherscan.io/address/0xd139E83fEFc1a54109EC14784e92e268467F8D4A](https://sepolia.etherscan.io/address/0xd139E83fEFc1a54109EC14784e92e268467F8D4A)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by <a href="https://github.com/bwalya-305">Mwansa</a></p>
