'use client'

import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { isAddress } from 'viem'
import { contractAddress, contractABI } from '@/app/contract'

export default function LookupPage() {
  const { address } = useAccount()
  const [target, setTarget] = useState('')
  const owner = (target || address) as `0x${string}` | undefined

  const { data: bal } = useReadContract({
    address: contractAddress, abi: contractABI, functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    query: { enabled: !!owner },
  })

  const [tid, setTid] = useState('')
  const tokenId = tid ? BigInt(tid) : undefined
  const { data: ownerOf } = useReadContract({
    address: contractAddress, abi: contractABI, functionName: 'ownerOf',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  })
  const { data: tokenURI } = useReadContract({
    address: contractAddress, abi: contractABI, functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  })

  return (
    <section className="mt-6 space-y-6">
      <div className="border rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">balanceOf (소유 NFT 개수)</h2>
        <input
          className="w-full border rounded px-2 py-1 text-sm font-mono"
          placeholder="0x... (비우면 내 지갑)"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <p className="text-sm">
          {owner && isAddress(owner) ? owner : '주소 없음'} →&nbsp;
          <span className="font-mono">{bal !== undefined ? String(bal) : '—'}</span>
        </p>
      </div>

      <div className="border rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">tokenId 상세 (ownerOf / tokenURI)</h2>
        <input
          className="w-full border rounded px-2 py-1 text-sm font-mono"
          placeholder="tokenId 예: 0"
          value={tid}
          onChange={(e) => setTid(e.target.value.replace(/[^0-9]/g, ''))}
        />
        <p className="text-sm">
          ownerOf: <span className="font-mono">{ownerOf ? String(ownerOf) : '—'}</span>
        </p>
        <p className="text-sm break-all">
          tokenURI: <span className="font-mono">{tokenURI ? String(tokenURI) : '—'}</span>
        </p>
      </div>
    </section>
  )
}
