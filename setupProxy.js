// Create this file at the root of your project (same level as package.json)
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.e-pet-adopt.site:8000',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '', // remove /api prefix when forwarding
      },
    })
  );
};