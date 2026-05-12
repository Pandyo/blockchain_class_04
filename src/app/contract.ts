import type { Abi } from 'viem'

export const contractAddress =
  '0x93f8dddd876c7dBE3323723500e83E202A7C96CC' as const

/** ERC721 + Enumerable + URIStorage + Ownable + safeMint */
export const contractABI: Abi = [
  // ──── 읽기 ─────────────────────────────────────────────────
  { type: 'function', stateMutability: 'view', name: 'name', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', stateMutability: 'view', name: 'symbol', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', stateMutability: 'view', name: 'totalSupply', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', stateMutability: 'view', name: 'owner', inputs: [], outputs: [{ type: 'address' }] },
  {
    type: 'function', stateMutability: 'view', name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function', stateMutability: 'view', name: 'ownerOf',
    inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'address' }],
  },
  {
    type: 'function', stateMutability: 'view', name: 'tokenURI',
    inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'string' }],
  },
  {
    type: 'function', stateMutability: 'view', name: 'tokenByIndex',
    inputs: [{ name: 'index', type: 'uint256' }], outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function', stateMutability: 'view', name: 'tokenOfOwnerByIndex',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function', stateMutability: 'view', name: 'getApproved',
    inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'address' }],
  },
  {
    type: 'function', stateMutability: 'view', name: 'isApprovedForAll',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function', stateMutability: 'view', name: 'supportsInterface',
    inputs: [{ name: 'interfaceId', type: 'bytes4' }], outputs: [{ type: 'bool' }],
  },

  // ──── 쓰기 ─────────────────────────────────────────────────
  {
    type: 'function', stateMutability: 'nonpayable', name: 'safeMint',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'uri', type: 'string' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function', stateMutability: 'nonpayable', name: 'approve',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function', stateMutability: 'nonpayable', name: 'setApprovalForAll',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    outputs: [],
  },
  {
    type: 'function', stateMutability: 'nonpayable', name: 'transferFrom',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function', stateMutability: 'nonpayable', name: 'safeTransferFrom',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },

  // ──── 이벤트 ───────────────────────────────────────────────
  {
    type: 'event', name: 'Transfer',
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event', name: 'Approval',
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'approved', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event', name: 'ApprovalForAll',
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'operator', type: 'address' },
      { indexed: false, name: 'approved', type: 'bool' },
    ],
    anonymous: false,
  },
]
