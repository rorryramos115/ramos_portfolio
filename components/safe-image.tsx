"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";

type SafeImageProps = ImageProps & {
  /** Rendered instead of the image if it fails to load. */
  fallback?: React.ReactNode;
};

/** next/image that degrades gracefully when an asset is missing. */
export function SafeImage({ fallback = null, alt, ...props }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const src = typeof props.src === "string" ? props.src : null;

  if (src !== null && failedSrc === src) return <>{fallback}</>;

  return (
    <Image
      {...props}
      alt={alt}
      onError={(e) => {
        if (src !== null) setFailedSrc(src);
        props.onError?.(e);
      }}
    />
  );
}
