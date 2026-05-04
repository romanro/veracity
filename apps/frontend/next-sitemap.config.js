/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://new.cyberpravda.dev',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: true,
  exclude: ['/server-sitemap.xml'],
  i18n: {
    locales: ['en', 'ru', 'es'],
    defaultLocale: 'en',
  },
};
