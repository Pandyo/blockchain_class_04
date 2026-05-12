'use client'

import { useAccount, useChainId, useConnect, useDisconnect } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function WalletBadge() {
  const { address, isConnected, status } = useAccount()
  const chainId = useChainId()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="flex items-center justify-between border rounded-2xl px-4 py-3 bg-zinc-50">
      <div className="text-sm">
        <p>
          네트워크: chainId={chainId}{' '}
          {chainId === sepolia.id ? '(권장: Sepolia 11155111)' : '(Sepolia로 전환 필요)'}
        </p>
        <p>지갑: {isConnected ? short(address!) : '연결 안 됨'}</p>
      </div>
      {isConnected ? (
        <button
          className="rounded bg-zinc-900 text-white px-3 py-1 text-sm"
          onClick={() => disconnect()}
        >
          연결 해제
        </button>
      ) : (
        <button
          className="rounded bg-zinc-900 text-white px-3 py-1 text-sm disabled:opacity-40"
          disabled={status === 'connecting' || status === 'reconnecting'}
          onClick={() => connect({ connector: connectors[0] })}
        >
          지갑 연결
        </button>
      )}
    </div>
  )
}

function short(s: string, n = 6) {
  return `${s.slice(0, n)}…${s.slice(-4)}`
}
