import { createI18n } from 'vue-i18n'

import zhCn from './lang/zh.json'
import enUS from './lang/en.json'

const zhFiles = import.meta.glob('../modules/*/locales/lang/zh.json', {eager: true})
const enFiles = import.meta.glob('../modules/*/locales/lang/en.json', {eager: true})

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
