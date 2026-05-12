import Link from 'next/link'

export default function Home() {
  return (
    <section className="space-y-6 mt-6">
      <p className="text-zinc-600">
        ERC-721 표준 기능을 테스트하는 데모 dApp입니다. 좌측 상단의 탭을 통해 갤러리, 조회,
        민팅, 승인, 전송, 인터페이스 확인 페이지를 사용할 수 있습니다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          ['/dapp/gallery', '갤러리', '최근 발행된 NFT를 카드로 보여줍니다.'],
          ['/dapp/lookup', '조회', '내 잔액 · tokenId 별 상세를 조회합니다.'],
          ['/dapp/mint', '민팅', 'Pinata IPFS 업로드 후 safeMint 실행.'],
          ['/dapp/approve', '승인', 'approve / setApprovalForAll'],
          ['/dapp/transfer', '전송', 'transferFrom · safeTransferFrom'],
          ['/dapp/interfaces', '인터페이스', 'ERC-165 supportsInterface'],
        ].map(([href, title, desc]) => (
          <Link
            key={href}
            href={href}
            className="block border rounded-2xl p-4 hover:shadow-sm transition"
          >
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-zinc-500 mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
