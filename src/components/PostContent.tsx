'use client';
import Image, { ImageProps } from 'next/image';
import { MDXRemote } from 'next-mdx-remote';

export default function PostContent({ mdxSource }: { mdxSource: any }) {
  return (
    <MDXRemote
      {...mdxSource}
      components={{
        // Markdown `![alt](src)` → Next/Image
        img: (props: ImageProps) => <Image {...props} />,
        // JSX `<Image>` in MDX → Next/Image
        Image: (props: ImageProps) => <Image {...props} />,
      }}
    />
  );
}
