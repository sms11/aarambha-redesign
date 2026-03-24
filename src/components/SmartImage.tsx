import Image, { ImageProps } from 'next/image';

/**
 * A wrapper around next/image that automatically uses unoptimized mode
 * for MinIO URLs (private IPs that Next.js image optimizer blocks).
 */
export default function SmartImage(props: ImageProps) {
  const src = typeof props.src === 'string' ? props.src : '';
  const isPrivateUrl = src.includes('localhost') || src.includes('127.0.0.1');

  return <Image {...props} unoptimized={isPrivateUrl || props.unoptimized} />;
}
