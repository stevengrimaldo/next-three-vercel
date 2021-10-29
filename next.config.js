const path = require('path')
const withTM = require('next-transpile-modules')([
  '@react-three/fiber',
  'three',
]);

module.exports = withTM({
  trailingSlash: false,
  webpack: (config, _) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@libs': path.resolve('./packages/libs'),
      '@global': path.resolve('./packages/global'),
      '@pages': path.resolve('./pages'),
    }
    return config
  },
});
