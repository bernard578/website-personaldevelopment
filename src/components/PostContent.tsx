'use client';

import Image, { type ImageProps } from 'next/image';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import * as React from 'react';

type Props = {
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
};

// Props we expect from MDX for images (Markdown or JSX)
type MDXImgProps = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  quality?: number;
};

function MdxImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  style,
  priority,
  quality,
}: MDXImgProps) {
  if (!src) return null; // nothing to render

  // Ensure a11y-compliant alt; empty string is valid for decorative images
  const altText = alt ?? '';

  // Provide defaults so Next/Image doesn’t complain
  const w = width ?? 1200;
  const h = height ?? 675;

  return (
    <Image
      src={src}
      alt={altText}
      width={w}
      height={h}
      className={className}
      sizes={sizes}
      style={style}
      priority={priority}
      quality={quality}
    />
  );
}

export default function PostContent({ mdxSource }: Props) {
  return (
    <MDXRemote
      {...mdxSource}
      components={{
        // Markdown: ![alt](src)
        img: (props: MDXImgProps) => <MdxImage {...props} />,
        // JSX in MDX: <Image ... />
        Image: (props: MDXImgProps | ImageProps) => (
          <MdxImage
            // allow passing Next/Image props directly from MDX
            {...(props as MDXImgProps)}
          />
        ),
      }}
    />
  );
}
