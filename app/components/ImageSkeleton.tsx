'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ImageSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  priority?: boolean;
}

export default function ImageSkeleton({
  src,
  alt,
  className = '',
  objectFit = 'cover',
  priority = false,
}: ImageSkeletonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-200 ${className}`}
    >
      {/* Imagen optimizada con Next.js Image - Carga inmediata sin lazy loading */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
        quality={100}
        priority={true}
        className="w-full h-full"
        style={{
          objectFit: objectFit,
        }}
      />
    </div>
  );
}
