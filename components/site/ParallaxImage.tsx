'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  /** Fator: 0..1 — 0.35 emula o efeito da home. */
  factor?: number;
  priority?: boolean;
}

export function ParallaxImage({ src, alt, factor = 0.35, priority }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Parallax só no desktop e quando o usuário não pediu "reduzir movimento".
    // No mobile o efeito trava a rolagem — então a imagem fica estática (cobre via height 120%).
    const allowParallax =
      window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!allowParallax) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY * factor;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [factor]);

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '120%' }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
