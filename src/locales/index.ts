import { createI18n } from 'vue-i18n'

import zhCn from './lang/zh-CN'
import enUS from './lang/en-US'

export const defaultLang = 'zh-CN'

const messages = {
  'zh-CN': {
    ...zhCn,
  },
  'en-US': {
    ...enUS,
  },
}

const i18n = createI18n({
  silentTranslationWarn: true,
  locale: defaultLang,
  fallbackLocale: defaultLang,
  messages,
})

export default i18n
