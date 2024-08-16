import { createI18n } from 'vue-i18n'
import zh from './locale/zh.json'
import en from './locale/en.json'

const messages = {
    en,
    zh,
}
// 获取浏览器界面语言，默认语言
let currentLanguage = navigator.language;
// currentLanguage = 'zh-CH';
// 如果本地缓存记录了语言环境，则使用本地缓存
let lsLocale = localStorage.getItem('locale') || ''
if (lsLocale) {
    currentLanguage = lsLocale
}

const i18n = createI18n({
    locale:currentLanguage, // 首先从缓存里拿，没有的话就用浏览器语言，
    fallbackLocale: 'zh', // 设置备用语言
    messages,
    legacy: false
})


export default i18n


