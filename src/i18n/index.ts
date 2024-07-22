import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enUS from 'ant-design-vue/es/locale/en_US';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: window.localStorage.getItem('lang') || 'enUS',
    messages: {
        zhCN,
        enUS,
    },
});

// 导出getLang
export default i18n;
