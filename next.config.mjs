/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ung-final-ctf',
  assetPrefix: '/ung-final-ctf/',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
