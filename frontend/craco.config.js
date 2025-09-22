const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // إضافة Polyfills لوحدات Node.js الأساسية
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url"),
        "buffer": require.resolve("buffer")
      };
      
      // إضافة الـ ProviderPlugin لتوفير buffer بشكل تلقائي
      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ]);

      return webpackConfig;
    },
  },
};
