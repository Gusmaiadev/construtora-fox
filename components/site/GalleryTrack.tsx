'use client';

import { type ReactNode, useEffect, useRef } from 'react';

interface GalleryTrackProps {
  children: ReactNode;
  className?: string;
}

export function GalleryTrack({ children, className }: GalleryTrackProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = ref.current;
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX;
      scrollLeft = track.scrollLeft;
    };
    const offDown = () => {
      isDown = false;
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      track.scrollLeft = scrollLeft - (e.pageX - startX) * 1.4;
    };

    track.addEventListener('mousedown', onDown);
    track.addEventListener('mouseleave', offDown);
    track.addEventListener('mouseup', offDown);
    track.addEventListener('mousemove', onMove);
    return () => {
      track.removeEventListener('mousedown', onDown);
      track.removeEventListener('mouseleave', offDown);
      track.removeEventListener('mouseup', offDown);
      track.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div ref={ref} className={`gallery-track ${className ?? ''}`.trim()}>
      {children}
    </div>
  );
}
