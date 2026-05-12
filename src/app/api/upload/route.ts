// 서버 사이드: 클라이언트의 NFT 메타데이터 + 이미지 파일을 Pinata에 업로드한다.
// 클라이언트는 multipart/form-data 로 file, name, description 를 보낸다.
// Pinata JWT는 서버에서만 사용 (PINATA_JWT 환경변수, .env.local 또는 Vercel Env).
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

async function pinataFetch(path: string, body: FormData | string, isJson = false) {
  const res = await fetch(`https://api.pinata.cloud${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
      ...(isJson ? { 'Content-Type': 'application/json' } : {}),
    },
    body,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Pinata error ${res.status}: ${text}`)
  }
  return res.json() as Promise<{ IpfsHash: string }>
}

export async function POST(req: Request) {
  try {
    if (!process.env.PINATA_JWT) {
      return NextResponse.json({ error: 'PINATA_JWT 미설정' }, { status: 500 })
    }

    const form = await req.formData()
    const file = form.get('file') as File | null
    const name = (form.get('name') as string) || 'My NFT'
    const description = (form.get('description') as string) || 'Minted from my dApp'

    if (!file) {
      return NextResponse.json({ error: 'file 필드 필요' }, { status: 400 })
    }

    // 1) 이미지 업로드
    const imgForm = new FormData()
    imgForm.append('file', file, file.name)
    const img = await pinataFetch('/pinning/pinFileToIPFS', imgForm)
    const imageCid = img.IpfsHash
    const imageUri = `ipfs://${imageCid}`

    // 2) 메타데이터 JSON 업로드
    const metadata = {
      name,
      description,
      image: imageUri,
      attributes: [],
    }
    const meta = await pinataFetch(
      '/pinning/pinJSONToIPFS',
      JSON.stringify({ pinataContent: metadata }),
      true,
    )
    const tokenURI = `ipfs://${meta.IpfsHash}`

    return NextResponse.json({ tokenURI, imageUri, metadata })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'unknown' }, { status: 500 })
  }
}
