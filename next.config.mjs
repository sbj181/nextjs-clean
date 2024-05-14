/** @type {import('next').NextConfig} */
const config = {
  images: { 
    domains: ['cdn.sanity.io', 'via.placeholder.com'],
    remotePatterns: [
      { hostname: 'cdn.sanity.io' }
    ] 
  },
}

export default config
