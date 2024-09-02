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
        title: '我的订阅',
    },
    {
        key: 'StationMessage',
        title: '站内信',
    },
]