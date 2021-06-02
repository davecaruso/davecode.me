const withPlugins = require('next-compose-plugins');

let config = withPlugins([
  // implements `pages.ts` behavior
  require('./plugins/custom-pages'),

  // file loader for images
  [require('next-images'), {
    inlineImageLimit: false,
    fileExtensions: ["jpg", "jpeg", "png", "gif", "ico", "webp", "jp2", "avif"]
  }],
], {
  reactStrictMode: true,
  future: {
    webpack5: true,
    strictPostcssConfiguration: true,
    excludeDefaultMomentLocales: true,
  },
});

let c;
module.exports = (...a) => c || (c = config(...a));
