import type { NextConfig } from 'next'

// IPFS 게이트웨이에서 이미지 로드를 허용
const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.mypinata.cloud' },
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: 'gateway.pinata.cloud' },
    ],
  },
}
export default config
