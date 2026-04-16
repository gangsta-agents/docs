export default defineAppConfig({
  docus: {
    title: 'Gangsta',
    description: 'Spec-Driven Development for AI Agents — The Framework that runs like organized crime.',
    url: 'https://gangsta.page',
    image: '/og-image.png',
    github: {
      owner: 'kucherenko',
      repo: 'gangsta',
      branch: 'main',
      root: 'skills',
      edit: true,
      contributors: false,
    },
    aside: {
      level: 1,
      collapsed: false,
    },
    colorMode: 'system',

    footer: {
      credits: {
        icon: 'i-lucide-shield',
        text: 'Omerta. Or else.',
        href: '/',
      },
    },
    socials: {
      github: 'https://github.com/kucherenko/gangsta',
    },
    toc: {
      title: 'On this page',
      bottom: {
        title: 'Community',
        links: [
          {
            icon: 'i-simple-icons-github',
            label: 'Star on GitHub',
            to: 'https://github.com/kucherenko/gangsta',
          },
        ],
      },
    },
  },
  header: {
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg',
      alt: 'Gangsta',
    },
    title: 'GANGSTA',
  },
  ui: {
    colors: {
      primary: 'amber',
      secondary: 'amber',
      neutral: 'zinc',
    },
  },
})