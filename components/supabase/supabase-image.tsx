"use client";

import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import { useState } from "react";

// Vercel Blob image loader
export function blobImageLoader({ src, width, quality }: ImageLoaderProps) {
  // If src is already a full URL, use it directly
  if (src.startsWith("http://") || src.startsWith("https://")) {
    const url = new URL(src);
    url.searchParams.set("w", width.toString());
    if (quality) {
      url.searchParams.set("q", quality.toString());
    }
    return url.href;
  }

  // Otherwise, construct the Vercel Blob URL
  const blobUrl = process.env.NEXT_PUBLIC_BLOB_URL;
  if (!blobUrl) {
    // Fallback to using src as-is
    return src;
  }
  return `${blobUrl}/${src}?w=${width}&q=${quality || 75}`;
}

export function SupabaseImage({
  placeholder,
  signed,
  src,
  ...props
}: Omit<ImageProps, "src" | "placeholder"> & {
  src?: string | StaticImport | null;
  signed?: "true" | "false";
  placeholder?: boolean;
}) {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  if (!src || showPlaceholder) {
    if (!placeholder) {
      return null;
    }
    return (
      <Image
        {...props}
        alt={props.alt || "Image"}
        src={"/images/placeholder.png"}
      />
    );
  }

  // For signed URLs or full URLs, use direct loading
  if (
    signed === "true" ||
    (typeof src === "string" && src.startsWith("http"))
  ) {
    return (
      <Image
        {...props}
        src={src}
        key={Date.now()}
        alt={props.alt || "Image"}
        unoptimized
        onError={() => setShowPlaceholder(true)}
      />
    );
  }

  return (
    <Image
      {...props}
      key={Date.now()}
      alt={props.alt || "Image"}
      loader={blobImageLoader}
      src={src}
      onError={() => setShowPlaceholder(true)}
    />
  );
}
