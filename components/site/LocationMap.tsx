/**
 * Mapa real, via OpenStreetMap.
 *
 * Escolhido em vez do Google Maps porque o embed do Google grava cookies de
 * terceiro — o que tornaria falsa a política de cookies, que afirma não haver
 * rastreador nas páginas públicas. O OSM não usa chave de API nem cookies.
 *
 * `loading="lazy"` mantém o iframe fora do carregamento inicial, e o botão ao
 * lado leva ao Google Maps para quem quer traçar rota.
 */
interface LocationMapProps {
  lat: number;
  lon: number;
  /** Abertura do enquadramento em graus. Menor = mais perto. */
  zoom?: number;
  label: string;
  /** Endereço ou nome usado na busca do Google Maps. */
  query: string;
}

export function LocationMap({ lat, lon, zoom = 0.02, label, query }: LocationMapProps) {
  const bbox = [lon - zoom, lat - zoom * 0.6, lon + zoom, lat + zoom * 0.6].join('%2C');
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div className="mapa">
      <iframe
        src={src}
        title={`Mapa da localização: ${label}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="mapa-rodape">
        <span className="mapa-label">{label}</span>
        <a href={maps} target="_blank" rel="noopener noreferrer" className="mapa-link">
          Abrir no Google Maps <span className="arrow">→</span>
        </a>
      </div>
    </div>
  );
}
