'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '@/app/contract'
import { fetchMetadata, ipfsToHttp, type NftMetadata } from '@/lib/ipfs'

export default function TokenDetail() {
  const params = useParams<{ tokenId: string }>()
  const tokenId = BigInt(params.tokenId)

  const { data: owner } = useReadContract({
    address: contractAddress, abi: contractABI, functionName: 'ownerOf', args: [tokenId],
  })
  const { data: tokenURI } = useReadContract({
    address: contractAddress, abi: contractABI, functionName: 'tokenURI', args: [tokenId],
  })
  const { data: approved } = useReadContract({
    address: contractAddress, abi: contractABI, functionName: 'getApproved', args: [tokenId],
  })

  const [meta, setMeta] = useState<NftMetadata | null>(null)
  useEffect(() => {
    if (typeof tokenURI === 'string') fetchMetadata(tokenURI).then(setMeta)
  }, [tokenURI])

  return (
    <section className="mt-6 space-y-4">
      <Link href="/dapp/gallery" className="text-sm underline text-zinc-500">
        ← 갤러리로
      </Link>
      <h2 className="text-xl font-semibold">tokenId #{params.tokenId}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-2xl overflow-hidden">
          {meta?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ipfsToHttp(meta.image)}
              alt={meta.name ?? params.tokenId}
              className="w-full aspect-square object-cover bg-zinc-100"
            />
          ) : (
            <div className="w-full aspect-square bg-zinc-100" />
          )}
        </div>
        <div className="space-y-2 text-sm">
          <Row label="name">{meta?.name ?? '—'}</Row>
          <Row label="description">{meta?.description ?? '—'}</Row>
          <Row label="owner">{owner ? String(owner) : '—'}</Row>
          <Row label="approved">{approved ? String(approved) : '없음'}</Row>
          <Row label="tokenURI">{tokenURI ? String(tokenURI) : '—'}</Row>
          <Row label="image">{meta?.image ?? '—'}</Row>
          {meta?.image && (
            <a className="text-blue-600 underline text-sm" href={ipfsToHttp(meta.image)} target="_blank" rel="noreferrer">
              IPFS gateway에서 보기
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <span className="text-zinc-500">{label}</span>
      <span className="font-mono break-all">{children}</span>
    </div>
  )
}
