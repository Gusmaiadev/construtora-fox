'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Atraso d1=.12s, d2=.24s, d3=.36s, d4=.48s (estilo do site original). */
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible || !ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  const delayClass = delay ? ` d${delay}` : '';
  const cls = `reveal${visible ? ' in' : ''}${delayClass} ${className}`.trim();

  return (
    <Tag ref={ref} className={cls} style={style}>
      {children}
    </Tag>
  );
}
