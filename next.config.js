module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|ts)x?$/,
      loader: "@svgr/webpack"
    });
 
    return config;
  },
  async redirects() {
    return [
      {
        source: '/name-painter-invite',
        destination: 'https://discord.com/oauth2/authorize?client_id=604738745224134675&scope=bot+applications.commands&permissions=268504064',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Powered-By',
            value: 'chocolate; https://davecode.me/donate',
          },
        ],
      },
    ]
  },
  // 
};