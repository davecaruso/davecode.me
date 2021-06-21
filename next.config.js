module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|ts)x?$/,
      loader: "@svgr/webpack"
    });
 
    return config;
  }
};