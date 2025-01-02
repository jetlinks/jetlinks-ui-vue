import { createI18n } from 'vue-i18n'
import type { Locale } from 'vue-i18n';

import zhCn from './lang/zh.json'
import enUS from './lang/en.json'

const zhFiles = import.meta.glob('../modules/*/locales/lang/zh.json', {eager: true})
const enFiles = import.meta.glob('../modules/*/locales/lang/en.json', {eager: true})

const mainModules = import.meta.glob('./lang/*.json', {eager: true})
const modules = import.meta.glob('../modules/*/locales/lang/*.json', {eager: true});

const allModules = Object.assign({}, mainModules, modules)

const localesMap = loadLocalesMapFromDir(/([^/]*)\.json$/, allModules);

console.log(localesMap)

function loadLocalesMapFromDir(regexp: RegExp, modules: Record<string, () => Promise<any>>) {
  const localesRaw: Record<Locale, Record<string, () => Promise<unknown>>> = {};
  const localesMap: Record<Locale, any> = {};
  for (const path in modules) {
    const match = path.match(regexp);
    if (match) {
      const [_, locale, fileName] = match;
      if (locale && fileName) {
        if (!localesRaw[locale]) {
          localesRaw[locale] = {};
        }
        if (modules[path]) {
          localesRaw[locale][fileName] = modules[path];
        }
      }
    }
  }

  // Convert raw locale data into async import functions
  for (const [locale, files] of Object.entries(localesRaw)) {
    localesMap[locale] = async () => {
      const messages: Record<string, any> = {};
      for (const [fileName, importFn] of Object.entries(files)) {
        messages[fileName] = ((await importFn()) as any)?.default;
      }
      return { default: messages };
    };
  }

  return localesMap;
}
Object.keys(zhFiles).forEach((key) => {
    const result = (zhFiles[key] as any)?.default
    Object.assign(zhCn, result)
})

Object.keys(enFiles).forEach((key) => {
  const result = (enFiles[key] as any)?.default
  Object.assign(enUS, result)
})

const messages = {
  zh: zhCn,
  en: enUS,
}

const language = (navigator.language || 'en').toLocaleLowerCase() // 这是获取浏览器的语言

const i18n = createI18n({
  legacy: false,
  silentTranslationWarn: true,
  locale: localStorage.getItem('lang') || language.split('-')[0] || 'en',
  fallbackLocale: language,
  messages,
})

export default i18n
