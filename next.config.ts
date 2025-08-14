// next.config.ts
import withMDX from '@next/mdx';
import type { NextConfig } from 'next';

import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/api/media/**' },
      { protocol: 'https', hostname: 'osobnirazvoj.hr', pathname: '/api/media/**' },
    ],
  },
} satisfies NextConfig

// Make sure you wrap your `nextConfig`
// with the `withPayload` plugin
export default withPayload(nextConfig) 


// 1️⃣ Create the MDX plugin with your options
const mdxPlugin = withMDX({
  extension: /\.mdx?$/,        // enable .md and .mdx
});

/*
// 2️⃣ Define your Next.js config
const nextConfig: NextConfig = {
  // Let Next.js pick up MDX files as pages/route segments
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // ...any other Next.js options you have
};

// 3️⃣ Export the wrapped config
export default mdxPlugin(nextConfig);
*/
