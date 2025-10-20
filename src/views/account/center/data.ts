import i18n from "@/locales";

type KeyType = 'HomeView' | 'BindThirdAccount' | 'Subscribe' | 'StationMessage' | 'PersonalToken';
export const tabList: { key: KeyType; title: string }[] = [
    {
        key: 'HomeView',
        title: i18n.global.t('center.data.756829-2'),
    },
    {
        key: 'BindThirdAccount',
        title: i18n.global.t('center.data.756829-3'),
    },
    {
        key: 'Subscribe',
        title: i18n.global.t('center.data.756829-0'),
    },
    {
        key: 'StationMessage',
        title: i18n.global.t('center.data.756829-1'),
    },
    {
      key: 'PersonalToken',
      title: i18n.global.t('center.data.756829-4'),
    },
]
