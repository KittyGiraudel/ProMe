import { defineRouting } from 'next-intl/routing'

const routeDefinitions = {
  home: { pathname: '/', localized: { en: '/', fr: '/' } },
  about: { pathname: '/about', localized: { en: '/about', fr: '/a-propos' } },
  biome: {
    pathname: '/biomes/[biome]',
    localized: { en: '/biomes/[biome]', fr: '/biomes/[biome]' },
  },
  characters: {
    pathname: '/characters',
    localized: { en: '/characters', fr: '/personnages' },
  },
  newCharacter: {
    pathname: '/characters/new',
    localized: { en: '/characters/new', fr: '/personnages/nouveau' },
  },
  character: {
    pathname: '/characters/[id]',
    localized: { en: '/characters/[id]', fr: '/personnages/[id]' },
  },
  faq: { pathname: '/faq', localized: { en: '/faq', fr: '/faq' } },
  npcGenerator: {
    pathname: '/generators/npc',
    localized: { en: '/generators/npc', fr: '/generateurs/pnj' },
  },
  npc: {
    pathname: '/generators/npc/[id]',
    localized: { en: '/generators/npc/[id]', fr: '/generateurs/pnj/[id]' },
  },
  villageGenerator: {
    pathname: '/generators/village',
    localized: { en: '/generators/village', fr: '/generateurs/village' },
  },
  village: {
    pathname: '/generators/village/[id]',
    localized: {
      en: '/generators/village/[id]',
      fr: '/generateurs/village/[id]',
    },
  },
  login: { pathname: '/login', localized: { en: '/login', fr: '/connexion' } },
  privacy: {
    pathname: '/privacy',
    localized: { en: '/privacy', fr: '/confidentialite' },
  },
  settings: {
    pathname: '/settings',
    localized: { en: '/settings', fr: '/parametres' },
  },
} as const

const pathnames = Object.fromEntries(
  Object.values(routeDefinitions).map(route => [
    route.pathname,
    route.localized,
  ])
) as Parameters<typeof defineRouting>[0]['pathnames']

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'en',
  pathnames,
})

export const routes = routeDefinitions
export type RouteName = keyof typeof routes
