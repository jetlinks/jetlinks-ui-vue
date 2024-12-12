import i18n from "@/locales";
type KeyType = 'HomeView' | 'BindThirdAccount' | 'Subscribe' | 'StationMessage';
export const tabList: { key: KeyType; title: string }[] =  [
    // {
    //   key: 'HomeView',
    //   title: '首页视图',
    // },
    // {
    //   key: 'BindThirdAccount',
    //   title: '绑定第三方账号',
    // },
    {
        key: 'Subscribe',
        title: i18n.global.t('center.data.756829-0'),
    },
    {
        key: 'StationMessage',
        title: i18n.global.t('center.data.756829-1'),
    },
]