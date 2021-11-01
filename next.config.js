/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  '@react-three/fiber',
  'three',
]);

module.exports = withTM({ trailingSlash: false });
