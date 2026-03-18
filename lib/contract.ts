export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const CONTRACT_ABI = [
  {
    name: 'payFee',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: '_studentId', type: 'string' }],
    outputs: [],
  },
  {
    name: 'getStudentTotalPaid',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_studentId', type: 'string' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'verifyReceipt',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_receiptHash', type: 'bytes32' }],
    outputs: [
      { name: 'studentId', type: 'string' },
      { name: 'amount',    type: 'uint256' },
      { name: 'timestamp', type: 'uint256' },
    ],
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'FeePaid',
    type: 'event',
    inputs: [
      { name: 'payer',       type: 'address', indexed: true },
      { name: 'studentId',   type: 'string',  indexed: false },
      { name: 'amount',      type: 'uint256', indexed: false },
      { name: 'timestamp',   type: 'uint256', indexed: false },
      { name: 'receiptHash', type: 'bytes32', indexed: false },
    ],
  },
] as const;
