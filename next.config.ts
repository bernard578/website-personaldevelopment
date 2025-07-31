// next.config.ts
import withMDX from '@next/mdx';
import type { NextConfig } from 'next';

// 1️⃣ Create the MDX plugin with your options
const mdxPlugin = withMDX({
  extension: /\.mdx?$/,        // enable .md and .mdx
});

// 2️⃣ Define your Next.js config
const nextConfig: NextConfig = {
  // Let Next.js pick up MDX files as pages/route segments
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // ...any other Next.js options you have
};

// 3️⃣ Export the wrapped config
export default mdxPlugin(nextConfig);
