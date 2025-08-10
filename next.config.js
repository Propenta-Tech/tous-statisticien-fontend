/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration des images
  images: {
    domains: [
      'api.tous-statisticien.net',
      'localhost',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_FREEMOPAY_APP_KEY: process.env.NEXT_PUBLIC_FREEMOPAY_APP_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirections
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/student',
        permanent: false,
      },
      {
        source: '/auth',
        destination: '/auth/login',
        permanent: false,
      },
    ];
  },

  // Configuration du compilateur
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },

  // Désactivé les rewrites pour éviter l'erreur avec undefined
  // Les appels API se feront directement vers l'URL backend
  poweredByHeader: false,

  // Configuration TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configuration ESLint
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
