/** @type {import('next').NextConfig} */
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Desactivar PWA en dev para que no moleste
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {}, // Silence warning about webpack config from next-pwa
};

export default withPWA(nextConfig);
