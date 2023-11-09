export const LoginPath = '/user/login'
export const InitHomePath = '/init-home'
export const AccountCenterBindPath = '/account/center/bind'
export const InitLicense = '/init-license'
export const NotificationSubscriptionCode = 'message-subscribe'
export const NotificationRecordCode = 'account/NotificationRecord'
export const OauthPath = '/oauth'
export const VideoSharePath = '/media/device/Share'

export const AccountMenu = {
    path: '/account',
    component: () => import('@/components/Layout/BasicLayoutPage.vue'),
    redirect: '/account/center',
    name: 'account',
    code: 'account',
    meta: {
        title: '个人中心',
        icon: '',
        hideInMenu: true
    },
    children: [
        {
            path: '/account/center',
            name: 'account/center',
            code: 'account/center',
            meta: {
                title: '个人中心',
                icon: '',
                hideInMenu: true
            },
            component: () => import('@/views/account/Center/index.vue')
        },
        // {
        //     path: '/account/NotificationSubscription',
        //     name: 'account/NotificationSubscription',
        //     code: 'account/NotificationSubscription',
        //     meta: {
        //         title: '通知订阅',
        //         icon: '',
        //         hideInMenu: false
        //     },
        //     component: () => import('@/views/account/NotificationSubscription/index.vue')
        // },
        // {
        //     path: '/account/NotificationRecord',
        //     name: 'account/NotificationRecord',
        //     code: 'account/NotificationRecord',
        //     meta: {
        //         title: '通知记录',
        //         icon: '',
        //         hideInMenu: false
        //     },
        //     component: () => import('@/views/account/NotificationRecord/index.vue')
        // },
    ]
}

export default [
    { path: '/*', redirect: '/' },
    {
        path: LoginPath,
        component: () => import('@/views/user/Login/index.vue')
    },
    {
        path: AccountCenterBindPath,
        component: () => import('@/views/account/Center/bind/index.vue')
    },
    {
        path: InitHomePath, // 初始化
        component: () => import('@/views/init-home/index.vue')
    },
    {
        path: InitLicense,
        component: () => import('@/views/system/License/index.vue')
    },
    {
        path: OauthPath,
        meta: {
            title: '授权页'
        },
        component: () => import('@/views/oauth/index.vue')
    },
    {
        path: '/oauth/wechat',
        meta: {
            title: '微信授权页'
        },
        component: () => import('@/views/oauth/WeChat.vue')
    },
    {
        path: VideoSharePath,
        component: () => import('@/views/media/Device/Channel/Share/index.vue')
    },
    AccountMenu,
]
