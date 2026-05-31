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
  navbar:  { width: 260, height: 70 },
  footer:  { width: 250, height: 68 },
  hero:    { width: 220, height: 220 },
  drawer:  { width: 240, height: 64 },
};

const CLASS_MAP: Record<LogoContext, string> = {
  navbar:  'h-12 md:h-14 w-auto object-contain',
  footer:  'h-14 md:h-16 w-auto object-contain',
  hero:    'w-36 h-36 md:w-52 md:h-52 object-contain mx-auto',
  drawer:  'h-12 w-auto object-contain',
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
