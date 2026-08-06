/**
 * Cabeçalhos de segurança aplicados a todas as respostas.
 *
 * Não incluímos Content-Security-Policy aqui: o Next injeta scripts inline
 * para hidratação, o que exigiria `'unsafe-inline'` em script-src e esvaziaria
 * boa parte do ganho. Uma CSP útil depende de nonce por requisição, o que
 * pede middleware — fica como passo separado.
 */
const securityHeaders = [
  // Força HTTPS por 2 anos, inclusive em subdomínios.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Impede que o navegador adivinhe o tipo do arquivo e execute algo indevido.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Bloqueia clickjacking: ninguém embute o site num iframe de outro domínio.
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Envia a URL completa como referrer só dentro do próprio site.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // O site não usa nenhuma dessas APIs; negar evita abuso via script de terceiro.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Não anuncia a versão do Next em cada resposta.
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Tree-shaking mais agressivo desses pacotes pesados: importa só os
    // ícones/gráficos usados, reduzindo o JS do bundle inicial.
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // Painel e API ficam fora dos buscadores por cabeçalho, não por
        // robots.txt — assim o painel não é anunciado publicamente.
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/admin',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
