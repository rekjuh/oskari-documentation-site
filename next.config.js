// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}
module.exports = nextConfig;



/**
 *
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  }

 */