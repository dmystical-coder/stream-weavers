// CeloStreaming Contract Configuration
// Deployed on Celo mainnet

export const CELO_STREAMING_ADDRESS = '0x172204c832dc1934c18e2393eaaa2007823dc282' as const;

export const CELO_STREAMING_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  { inputs: [], name: 'ReentrancyGuardReentrantCall', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'cap', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'duration', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'token', type: 'address' },
    ],
    name: 'AddStream',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'FundsReceived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'token', type: 'address' },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '_recipient', type: 'address' },
      { internalType: 'uint256', name: '_cap', type: 'uint256' },
      { internalType: 'uint256', name: '_unlockDuration', type: 'uint256' },
      { internalType: 'address', name: '_tokenAddress', type: 'address' },
    ],
    name: 'addStream',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: '_recipients', type: 'address[]' },
      { internalType: 'uint256[]', name: '_caps', type: 'uint256[]' },
      { internalType: 'uint256[]', name: '_durations', type: 'uint256[]' },
      { internalType: 'address[]', name: '_tokens', type: 'address[]' },
    ],
    name: 'batchAddStreams',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'getContractBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'streams',
    outputs: [
      { internalType: 'uint256', name: 'cap', type: 'uint256' },
      { internalType: 'uint256', name: 'unlockDuration', type: 'uint256' },
      { internalType: 'uint256', name: 'lastWithdrawal', type: 'uint256' },
      { internalType: 'address', name: 'tokenAddress', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'unlockedBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
] as const;
