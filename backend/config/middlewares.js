module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'strapi::security'
],
{
  settings: {
    security: {
      contentSecurityPolicy: {
        directives: {
          'default-src': ['self'],
          'script-src': ['self', 'https://x.klarnacdn.net'],
          'script-src-elem': ["'self'", 'https://x.klarnacdn.net'],
          'frame-src': ['none'],
        },
      },
    },
  }
};