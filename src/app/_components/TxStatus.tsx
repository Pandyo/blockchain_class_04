'use client'

import { useWaitForTransactionReceipt } from 'wagmi'

export function TxStatus({ hash }: { hash?: `0x${string}` }) {
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash })
  if (!hash) return null
  return (
    <p className="text-xs text-zinc-500">
      tx:&nbsp;
      <a
        className="underline font-mono"
        target="_blank"
        rel="noreferrer"
        href={`https://sepolia.etherscan.io/tx/${hash}`}
      >
        {hash.slice(0, 10)}…
      </a>
      {' · '}
      {isLoading ? '채굴 대기' : isSuccess ? '✅ 완료' : isError ? '❌ 실패' : '대기'}
    </p>
  )
}
