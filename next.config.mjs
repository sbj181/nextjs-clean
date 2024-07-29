/** @type {import('next').NextConfig} */
const config = {
  images: { 
    domains: ['cdn.sanity.io', 'youtube.com', 'i.ytimg.com', 'via.placeholder.com', 'nimjgfnsewiwhahvelsw.supabase.co'],
    remotePatterns: [
      { hostname: 'cdn.sanity.io' }
    ] 
  },
}

export default config
