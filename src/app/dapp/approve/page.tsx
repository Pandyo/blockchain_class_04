'use client'

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { isAddress } from 'viem'
import { contractAddress, contractABI } from '@/app/contract'
import { TxStatus } from '@/app/_components/TxStatus'

export default function ApprovePage() {
  const { isConnected, address } = useAccount()
  const [to, setTo] = useState('')
  const [tid, setTid] = useState('')
  const tokenId = tid ? BigInt(tid) : undefined

  const { data: approved } = useReadContract({
    address: contractAddress, abi: contractABI, functionName: 'getApproved',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  })

  const { writeContract, data: hash, isPending } = useWriteContract()

  function doApprove() {
    if (!isAddress(to) || tokenId === undefined) return
    writeContract({
      address: contractAddress, abi: contractABI, functionName: 'approve',
      args: [to as `0x${string}`, tokenId],
    })
  }

  // 전체 위임
  const [op, setOp] = useState('')
  const [opOn, setOpOn] = useState(true)
  const { data: allFor } = useReadContract({
    address: contractAddress, abi: contractABI, functionName: 'isApprovedForAll',
    args: address && isAddress(op) ? [address, op as `0x${string}`] : undefined,
    query: { enabled: !!address && isAddress(op) },
  })
  const { writeContract: writeAll, data: hashAll, isPending: pendingAll } = useWriteContract()
  function doSetAll() {
    if (!isAddress(op)) return
    writeAll({
      address: contractAddress, abi: contractABI, functionName: 'setApprovalForAll',
      args: [op as `0x${string}`, opOn],
    })
  }

  return (
    <section className="mt-6 space-y-4">
      <div className="border rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">approve (특정 tokenId 승인)</h2>
        <input
          className="w-full border rounded px-2 py-1 text-sm font-mono"
          placeholder="대리인 주소 0x..."
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          className="w-full border rounded px-2 py-1 text-sm font-mono"
          placeholder="tokenId"
          value={tid}
          onChange={(e) => setTid(e.target.value.replace(/[^0-9]/g, ''))}
        />
        <p className="text-sm">
          현재 getApproved:&nbsp;
          <span className="font-mono">{approved ? String(approved) : '—'}</span>
        </p>
        <button
          className="rounded bg-zinc-900 text-white px-3 py-1 text-sm disabled:opacity-40"
          disabled={!isConnected || !isAddress(to) || tokenId === undefined || isPending}
          onClick={doApprove}
        >
          approve 실행
        </button>
        <TxStatus hash={hash} />
      </div>

      <div className="border rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">setApprovalForAll (전체 위임)</h2>
        <input
          className="w-full border rounded px-2 py-1 text-sm font-mono"
          placeholder="operator 주소 0x..."
          value={op}
          onChange={(e) => setOp(e.target.value)}
        />
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={opOn} onChange={(e) => setOpOn(e.target.checked)} />
          승인 ON / 해제는 체크 해제
        </label>
        <p className="text-sm">
          현재 isApprovedForAll:&nbsp;
          <span className="font-mono">{allFor === undefined ? '—' : String(allFor)}</span>
        </p>
        <button
          className="rounded bg-zinc-900 text-white px-3 py-1 text-sm disabled:opacity-40"
          disabled={!isConnected || !isAddress(op) || pendingAll}
          onClick={doSetAll}
        >
          setApprovalForAll 실행
        </button>
        <TxStatus hash={hashAll} />
      </div>
    </section>
  )
}
