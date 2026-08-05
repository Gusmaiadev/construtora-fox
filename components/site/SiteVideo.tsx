'use client';

import { useEffect, useRef } from 'react';

interface SiteVideoProps {
  src: string;
  /** Frame estático exibido antes do play — evita "buraco" no carregamento. */
  poster: string;
  /** Fator 0..1 — quando definido, replica o parallax do ParallaxImage. */
  factor?: number;
  /** 'auto' para vídeos acima da dobra; 'metadata' adia o download. */
  preload?: 'auto' | 'metadata' | 'none';
  /** Descrição acessível; sem ela o vídeo é tratado como decorativo. */
  label?: string;
}

export function SiteVideo({ src, poster, factor, preload = 'metadata', label }: SiteVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !factor) return;
    // Parallax só no desktop e quando o usuário não pediu "reduzir movimento".
    const allowParallax =
      window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!allowParallax) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(0, ${window.scrollY * factor}px, 0)`;
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Com "reduzir movimento" o vídeo fica no poster, sem tocar.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Toca apenas enquanto está na tela — economiza banda e bateria.
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      style={
        factor
          ? { position: 'absolute', inset: 0, width: '100%', height: '120%' }
          : { width: '100%', height: '100%' }
      }
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload={preload}
        aria-hidden={label ? undefined : true}
        aria-label={label}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}
