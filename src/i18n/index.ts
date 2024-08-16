import { createI18n } from 'vue-i18n'
import zh from './locale/zh.json'
import en from './locale/en.json'

const messages = {
    en,
    zh,
}
const language = (navigator.language || 'en').toLocaleLowerCase() // 这是获取浏览器的语言
// const language = ('zh').toLocaleLowerCase() // 这是获取浏览器的语言
const i18n = createI18n({
    locale: 'en', // 首先从缓存里拿，没有的话就用浏览器语言，
    fallbackLocale: 'en', // 设置备用语言
    messages,
    legacy: false
})


export default i18n


