'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTheme } from '@/lib/theme';

type LogoContext = 'navbar' | 'footer' | 'hero' | 'drawer';

interface ThemedLogoProps {
  context?: LogoContext;
  className?: string;
  width?: number;
  height?: number;
}

const LOGO_MAP: Record<LogoContext, { color: string; bw: string }> = {
  navbar:  { color: '/logo/logo_transparent.png',            bw: '/logo/black_logo.png' },
  footer:  { color: '/logo/logo_transparent.png',            bw: '/logo/black_logo.png' },
  hero:    { color: '/logo/logo_transparent.png',            bw: '/logo/black_logo.png' },
  drawer:  { color: '/logo/logo_transparent.png',            bw: '/logo/black_logo.png' },
};

const DIMENSION_MAP: Record<LogoContext, { width: number; height: number }> = {
  navbar:  { width: 160, height: 48 },
  footer:  { width: 160, height: 48 },
  hero:    { width: 128, height: 128 },
  drawer:  { width: 140, height: 44 },
};

const CLASS_MAP: Record<LogoContext, string> = {
  navbar:  'h-8 w-auto object-contain',
  footer:  'h-10 w-auto object-contain',
  hero:    'w-24 h-24 md:w-32 md:h-32 object-contain mx-auto',
  drawer:  'h-8 w-auto object-contain',
};

export default function ThemedLogo({
  context = 'navbar',
  className,
  width,
  height,
}: ThemedLogoProps) {
  const { theme } = useTheme();
  const [imgError, setImgError] = useState(false);

  const src = imgError
    ? '/logo/logo_transparent.png'
    : LOGO_MAP[context][theme];
  const dims = DIMENSION_MAP[context];
  const cls = className ?? CLASS_MAP[context];

  return (
    <Image
      src={src}
      alt="RallyVerse"
      width={width ?? dims.width}
      height={height ?? dims.height}
      className={cls}
      priority={context === 'navbar' || context === 'hero'}
      onError={() => setImgError(true)}
    />
  );
}
