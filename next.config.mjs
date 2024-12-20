const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = false; // Disable caching to avoid issues
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
