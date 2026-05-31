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
  navbar:  { color: '/logo/logo_transparent.png',                     bw: '/logo/black_logo_text_transparent.png' },
  footer:  { color: '/logo/logo_transparent.png',                     bw: '/logo/black_logo_text_transparent.png' },
  hero:    { color: '/logo/logo_transparent.png',                     bw: '/logo/black_logo_text_transparent.png' },
  drawer:  { color: '/logo/logo_transparent.png',                     bw: '/logo/black_logo_text_transparent.png' },
};

const DIMENSION_MAP: Record<LogoContext, { width: number; height: number }> = {
  navbar:  { width: 220, height: 60 },
  footer:  { width: 200, height: 56 },
  hero:    { width: 180, height: 180 },
  drawer:  { width: 200, height: 56 },
};

const CLASS_MAP: Record<LogoContext, string> = {
  navbar:  'h-10 md:h-12 w-auto object-contain',
  footer:  'h-12 md:h-14 w-auto object-contain',
  hero:    'w-32 h-32 md:w-44 md:h-44 object-contain mx-auto',
  drawer:  'h-10 w-auto object-contain',
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
