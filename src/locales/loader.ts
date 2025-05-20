import type {Locale} from "vue-i18n";

const mainModules = import.meta.glob('./lang/*.json', {eager: true})
const langModules = import.meta.glob('../modules/*/locales/lang/*.json', {eager: true})

export const getLang = async () => {
  const modulesMap = {}
  const modulesFiles = import.meta.glob('../modules/*/locales/lang/*.json', {eager: true})

  return Object.assign(modulesMap, modulesFiles)
}

export async function loadLocalesMapFromDir() {

  const modules = Object.assign({}, mainModules, langModules)
  const localesRaw: Record<Locale, Record<string, any>> = {};
  for (const path in modules) {
    const match = path.match(/([^/]*)\.json$/);
    if (match) {
      const [_, locale] = match;
      if (locale) {
        if (!localesRaw[locale]) {
          localesRaw[locale] = {};
        }
        if (modules[path]) {
          localesRaw[locale] = Object.assign(localesRaw[locale], modules[path]?.default);
        }
      }
    }
  }
  return localesRaw
}
