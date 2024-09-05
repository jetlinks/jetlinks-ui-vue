import { createI18n } from 'vue-i18n'

import zhCn from './lang/zh.json'
import enUS from './lang/en.json'


const messages = {
  zh: zhCn,
  en: enUS,
}

const language = (navigator.language || 'en').toLocaleLowerCase() // 这是获取浏览器的语言

const i18n = createI18n({
  silentTranslationWarn: true,
  locale: localStorage.getItem('lang') || language.split('-')[0] || 'en',
  fallbackLocale: language,
  messages,
  legacy: false
})

export default i18n
