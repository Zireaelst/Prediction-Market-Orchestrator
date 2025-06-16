/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    
    if (!isServer) {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
    }
    
    // Worker dosyalarını ignore et
    config.module.rules.push({
      test: /\.worker\.js$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext]',
      },
    });

    // Terser ayarlarını değiştir
    config.optimization = {
      ...config.optimization,
      minimizer: config.optimization.minimizer.map((plugin) => {
        if (plugin.constructor.name === 'TerserPlugin') {
          plugin.options.terserOptions = {
            ...plugin.options.terserOptions,
            parse: {
              ...plugin.options.terserOptions.parse,
              ecma: 2020,
            },
            compress: {
              ...plugin.options.terserOptions.compress,
              ecma: 2020,
            },
            mangle: {
              ...plugin.options.terserOptions.mangle,
              safari10: true,
            },
            format: {
              ...plugin.options.terserOptions.format,
              ecma: 2020,
              safari10: true,
            },
          };
        }
        return plugin;
      }),
    };

    return config;
  },
  transpilePackages: ['@rainbow-me/rainbowkit'],
  swcMinify: false, // Terser kullan
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig
