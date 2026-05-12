'use client'

import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '@/app/contract'

const KNOWN: Record<string, string> = {
  '0x01ffc9a7': 'ERC165',
  '0x80ac58cd': 'ERC721',
  '0x5b5e139f': 'ERC721Metadata',
  '0x780e9d63': 'ERC721Enumerable',
}

export default function InterfacesPage() {
  const [iid, setIid] = useState('0x80ac58cd')
  const valid = /^0x[0-9a-fA-F]{8}$/.test(iid)
  const { data: ok } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'supportsInterface',
    args: valid ? [iid as `0x${string}`] : undefined,
    query: { enabled: valid },
  })

  return (
    <section className="mt-6 space-y-4">
      <div className="border rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">ERC-165 supportsInterface (표준 지원 여부)</h2>
        <label className="text-xs text-zinc-500 block">interfaceId (bytes4 hex)</label>
        <input
          className="w-full border rounded px-2 py-1 text-sm font-mono"
          value={iid}
          onChange={(e) => setIid(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {Object.entries(KNOWN).map(([id, label]) => (
            <button
              key={id}
              className={`px-2 py-1 text-sm rounded-full border ${iid === id ? 'bg-zinc-900 text-white' : ''}`}
              onClick={() => setIid(id)}
            >
              {label} ({id})
            </button>
          ))}
        </div>
        <p className="text-sm">
          supportsInterface(interfaceId):&nbsp;
          <span className="font-mono font-semibold">{ok === undefined ? '—' : String(ok)}</span>
        </p>
      </div>
    </section>
  )
}
