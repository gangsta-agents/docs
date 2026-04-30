export default defineNuxtConfig({
  extends: ['docus'],

  future: {
    compatibilityVersion: 4,
  },

  site: {
    url: 'https://gangsta.page',
    name: 'Gangsta Agents',
  },

  app: {
    head: {
      meta: [
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://gangsta.page' },
        { property: 'og:site_name', content: 'Gangsta Agents' },
        { property: 'og:title', content: 'Gangsta Agents — Run AI Agents Like the Mob' },
        {
          property: 'og:description',
          content:
            'AI agent development structured like a mafia family. Hierarchy, pipelines, and discipline — enforced. The Don approves every phase. No code ships without a signed contract.',
        },
        { property: 'og:image', content: 'https://gangsta.page/web-app-manifest-512x512.png' },
        { property: 'og:image:width', content: '512' },
        { property: 'og:image:height', content: '512' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Gangsta Agents — Run AI Agents Like the Mob' },
        {
          name: 'twitter:description',
          content:
            'AI agent development structured like a mafia family. Hierarchy, pipelines, and discipline — enforced. The Don approves every phase. No code ships without a signed contract.',
        },
        { name: 'twitter:image', content: 'https://gangsta.page/web-app-manifest-512x512.png' },
      ],
      link: [
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'Gangsta Agents Blog',
          href: '/feed.xml',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-96x96.png',
          sizes: '96x96',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/feed.xml'],
    },
  },

  llms: {
    domain: 'https://gangsta.page',
  },

  content: {
    navigation: {
      fields: ['description', 'icon'],
    },
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-04-01',
})
