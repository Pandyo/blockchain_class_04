'use client'

import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { isAddress } from 'viem'
import { contractAddress, contractABI } from '@/app/contract'
import { TxStatus } from '@/app/_components/TxStatus'

export default function MintPage() {
  const { address, isConnected } = useAccount()
  const [to, setTo] = useState('')
  const [name, setName] = useState('My NFT')
  const [desc, setDesc] = useState('Minted from my dApp')
  const [file, setFile] = useState<File | null>(null)
  const [tokenURI, setTokenURI] = useState('')
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  const { writeContract, data: hash, isPending } = useWriteContract()

  async function upload() {
    setErr('')
    if (!file) return setErr('이미지 파일을 선택하세요')
    const form = new FormData()
    form.append('file', file)
    form.append('name', name)
    form.append('description', desc)
    setUploading(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'upload failed')
      setTokenURI(data.tokenURI)
    } catch (e: any) {
      setErr(e.message ?? 'upload error')
    } finally {
      setUploading(false)
    }
  }

  function mint() {
    if (!tokenURI) return setErr('먼저 IPFS에 업로드하세요')
    const target = (to || address) as `0x${string}` | undefined
    if (!target || !isAddress(target)) return setErr('수신 주소 확인')
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'safeMint',
      args: [target, tokenURI],
    })
  }

  return (
    <section className="mt-6 space-y-4">
      <div className="border rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">새 NFT 민팅 (safeMint)</h2>
        <p className="text-xs text-zinc-500">
          1) 이미지/메타데이터를 Pinata IPFS에 업로드한 뒤, 2) 컨트랙트의 safeMint를 호출합니다.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            className="border rounded px-2 py-1 text-sm"
            placeholder="NFT 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border rounded px-2 py-1 text-sm"
            placeholder="설명"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <button
          className="rounded bg-zinc-900 text-white px-3 py-1 text-sm disabled:opacity-40"
          disabled={!file || uploading}
          onClick={upload}
        >
          {uploading ? '업로드 중…' : 'Pinata에 업로드'}
        </button>
        {tokenURI && (
          <p className="text-xs break-all">tokenURI: <span className="font-mono">{tokenURI}</span></p>
        )}
        <div className="border-t pt-3 space-y-2">
          <input
            className="w-full border rounded px-2 py-1 text-sm font-mono"
            placeholder="to 주소 (비우면 내 지갑)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <button
            className="rounded bg-zinc-900 text-white px-3 py-1 text-sm disabled:opacity-40"
            disabled={!isConnected || !tokenURI || isPending}
            onClick={mint}
          >
            safeMint 실행
          </button>
          <TxStatus hash={hash} />
          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>
      </div>
    </section>
  )
}
