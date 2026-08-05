import Image from 'next/image';

interface MarqueeProps {
  images: string[];
  /** Segundos para percorrer um ciclo completo — maior = mais lento. */
  duration?: number;
  /** Inverte o sentido da rolagem. */
  reverse?: boolean;
  alt: string;
}

/**
 * Carrossel infinito e automático. A lista é duplicada e a faixa desliza
 * exatamente a largura de uma cópia, então a emenda é invisível.
 */
export function Marquee({ images, duration = 40, reverse, alt }: MarqueeProps) {
  const loop = [...images, ...images];

  return (
    <div className="marquee">
      <div
        className={`marquee-track${reverse ? ' reverse' : ''}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((src, i) => (
          <div className="marquee-item" key={`${src}-${i}`}>
            <Image
              src={src}
              alt={i < images.length ? `${alt} — foto ${i + 1}` : ''}
              width={1600}
              height={1200}
              sizes="(max-width: 800px) 260px, (max-width: 1540px) 30vw, 460px"
              aria-hidden={i >= images.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
