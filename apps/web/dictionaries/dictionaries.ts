import 'server-only'

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
}

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['en']>>

export const getDictionary = async (locale: 'en') => dictionaries[locale]()
