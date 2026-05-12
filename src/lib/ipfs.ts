/** ipfs:// → 게이트웨이 URL로 변환 */
export function ipfsToHttp(uri?: string | null) {
  if (!uri) return ''
  if (uri.startsWith('ipfs://')) {
    return `https://gateway.pinata.cloud/ipfs/${uri.slice('ipfs://'.length)}`
  }
  return uri
}

export type NftMetadata = {
  name?: string
  description?: string
  image?: string
  attributes?: unknown
}

/** tokenURI에서 메타데이터 JSON을 fetch한다. (브라우저) */
export async function fetchMetadata(tokenURI: string): Promise<NftMetadata | null> {
  try {
    const url = ipfsToHttp(tokenURI)
    if (!url) return null
    const res = await fetch(url)
    if (!res.ok) return null
    return (await res.json()) as NftMetadata
  } catch {
    return null
  }
}
