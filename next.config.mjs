/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Tree-shaking mais agressivo desses pacotes pesados: importa só os
    // ícones/gráficos usados, reduzindo o JS do bundle inicial.
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
};

export default nextConfig;
