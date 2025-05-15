import { createI18n } from 'vue-i18n'
import type { Locale } from 'vue-i18n';
import {langKey} from "@/utils/consts";
import { getLang } from './loader'

const mainModules = import.meta.glob('./lang/*.json', {eager: true})

const language = (navigator.language || 'en').toLocaleLowerCase() // 这是获取浏览器的语言

const i18n = createI18n({
  legacy: false,
  silentTranslationWarn: true,
  locale: localStorage.getItem(langKey) || language.split('-')[0] || 'en',
  fallbackLocale: language,
})

async function loadLocalesMapFromDir(regexp: RegExp) {
  const langModules = await getLang()

  const modules = Object.assign({}, mainModules, langModules)
  const localesRaw: Record<Locale, Record<string, () => Promise<unknown>>> = {};
  for (const path in modules) {
    const match = path.match(regexp);
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

  for (const localesRawKey in localesRaw) { // 因异步操作，需要动态添加message
    i18n.global.mergeLocaleMessage(localesRawKey, localesRaw[localesRawKey]);
  }
    console.log(localesRaw)
}
loadLocalesMapFromDir(/([^/]*)\.json$/);

export default i18n
