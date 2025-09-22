const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // إضافة Polyfills لوحدات Node.js الأساسية
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert/"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url/"),
        "buffer": require.resolve("buffer/")
      };
      
      // إضافة الـ ProviderPlugin لتوفير buffer و process بشكل تلقائي
      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: 'process/browser.js', // <-- التصحيح هنا بإضافة .js
          Buffer: ['buffer', 'Buffer'],
        }),
      ]);

      // تجاهل التحذيرات المتعلقة بـ source-map-loader
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      return webpackConfig;
    },
  },
};
