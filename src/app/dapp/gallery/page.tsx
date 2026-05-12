'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '@/app/contract'
import { fetchMetadata, ipfsToHttp, type NftMetadata } from '@/lib/ipfs'

const MAX_CARDS = 60

export default function GalleryPage() {
  const { data: total, refetch } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'totalSupply',
    query: { refetchInterval: 20000 },
  })
  const totalSupply = (total as bigint | undefined) ?? 0n
  const count = Number(totalSupply > BigInt(MAX_CARDS) ? BigInt(MAX_CARDS) : totalSupply)

  return (
    <section className="mt-6 space-y-4">
      <div className="border rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">NFT 갤러리 (최근 {MAX_CARDS}개)</h2>
            <p className="text-sm text-zinc-500">totalSupply: {totalSupply.toString()}</p>
            <p className="text-sm text-zinc-500">토큰 {count}개</p>
          </div>
          <button
            className="rounded bg-zinc-900 text-white px-3 py-1 text-sm"
            onClick={() => refetch()}
          >
            새로고침
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: count }, (_, i) => Number(totalSupply) - 1 - i)
          .filter((n) => n >= 0)
          .map((tokenId) => (
            <Card key={tokenId} tokenId={tokenId} />
          ))}
      </div>
    </section>
  )
}

function Card({ tokenId }: { tokenId: number }) {
  const { data: tokenURI } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
  })
  const { data: nftOwner } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'ownerOf',
    args: [BigInt(tokenId)],
  })

  const [meta, setMeta] = useState<NftMetadata | null>(null)
  useEffect(() => {
    if (typeof tokenURI === 'string') fetchMetadata(tokenURI).then(setMeta)
  }, [tokenURI])

  return (
    <Link
      href={`/dapp/gallery/${tokenId}`}
      className="block border rounded-2xl overflow-hidden hover:shadow"
    >
      <div className="px-3 py-2 border-b text-sm font-semibold">tokenId #{tokenId}</div>
      {meta?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ipfsToHttp(meta.image)}
          alt={meta.name ?? `tokenId ${tokenId}`}
          className="w-full aspect-square object-cover bg-zinc-100"
        />
      ) : (
        <div className="w-full aspect-square bg-zinc-100" />
      )}
      <div className="p-3 text-sm space-y-1">
        <p className="font-medium">{meta?.name ?? '—'}</p>
        <p className="text-zinc-500">{meta?.description ?? ''}</p>
        <p className="text-xs text-zinc-500">
          owner: <span className="font-mono">{nftOwner ? short(String(nftOwner)) : '—'}</span>
        </p>
        <p className="text-xs text-blue-600 underline">클릭하여 상세보기</p>
      </div>
    </Link>
  )
}

function short(s: string) {
  return `${s.slice(0, 8)}…${s.slice(-7)}`
}
