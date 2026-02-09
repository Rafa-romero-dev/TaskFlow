import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactCompiler: true,
  turbopack: {},
  async redirects() {
    return [
      {
        source: '/',
        missing: [
          {
            type: 'cookie',
            key: 'session_token',
          },
        ],
        permanent: false,
        destination: '/login',
      },
      {
        source: '/',
        has: [
          {
            type: 'cookie',
            key: 'session_token',
          },
        ],
        permanent: false,
        destination: '/dashboard',
      },
      {
        source: '/login',
        has: [
          {
            type: 'cookie',
            key: 'session_token',
          },
        ],
        permanent: false,
        destination: '/dashboard',
      },
      {
        source: '/dashboard/:path*',
        missing: [
          {
            type: 'cookie',
            key: 'session_token',
          },
        ],
        permanent: false,
        destination: '/login',
      },
    ];
  },
};

export default withPWA(nextConfig);