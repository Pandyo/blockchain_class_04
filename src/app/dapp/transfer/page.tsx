'use client'

import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { isAddress } from 'viem'
import { contractAddress, contractABI } from '@/app/contract'
import { TxStatus } from '@/app/_components/TxStatus'

export default function TransferPage() {
  const { isConnected } = useAccount()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [tid, setTid] = useState('')
  const [safe, setSafe] = useState(true)
  const { writeContract, data: hash, isPending } = useWriteContract()

  function doTransfer() {
    if (!isAddress(from) || !isAddress(to) || !tid) return
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: safe ? 'safeTransferFrom' : 'transferFrom',
      args: [from as `0x${string}`, to as `0x${string}`, BigInt(tid)],
    })
  }

  return (
    <section className="mt-6 space-y-4">
      <div className="border rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">소유권 이전 (transferFrom / safeTransferFrom)</h2>
        <p className="text-xs text-zinc-500">
          현재 연결된 지갑이 소유자이거나 사전에 approve를 받은 경우에만 실행 가능합니다.
        </p>
        <input
          className="w-full border rounded px-2 py-1 text-sm font-mono"
          placeholder="from 0x..."
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          className="w-full border rounded px-2 py-1 text-sm font-mono"
          placeholder="to 0x..."
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          className="w-full border rounded px-2 py-1 text-sm font-mono"
          placeholder="tokenId"
          value={tid}
          onChange={(e) => setTid(e.target.value.replace(/[^0-9]/g, ''))}
        />
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={safe} onChange={(e) => setSafe(e.target.checked)} />
          safeTransferFrom 사용 (체크 해제 시 transferFrom)
        </label>
        <button
          className="rounded bg-zinc-900 text-white px-3 py-1 text-sm disabled:opacity-40"
          disabled={!isConnected || !isAddress(from) || !isAddress(to) || !tid || isPending}
          onClick={doTransfer}
        >
          실행
        </button>
        <TxStatus hash={hash} />
      </div>
    </section>
  )
}
