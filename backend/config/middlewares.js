module.exports = [
  'strapi::logger',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        directives: {
          'script-src': ["'self'", "'unsafe-inline'", 'https://x.klarnacdn.net'],
          'image-src': ["'self'", "'unsafe-inline'", 'https://js.playground.klarna.com']
        }
      }
    }
  },
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
]