export const LoginPath = '/login'
export const InitHomePath = '/init-home'
export const AccountCenterBindPath = '/account/center/bind'

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
                title: '基本设置',
                icon: '',
                hideInMenu: false
            },
            component: () => import('@/views/account/Center/index.vue')
        },
        {
            path: '/account/NotificationSubscription',
            name: 'account/NotificationSubscription',
            code: 'account/NotificationSubscription',
            meta: {
                title: '通知订阅',
                icon: '',
                hideInMenu: false
            },
            component: () => import('@/views/account/NotificationSubscription/index.vue')
        },
        {
            path: '/account/NotificationRecord',
            name: 'account/NotificationRecord',
            code: 'account/NotificationRecord',
            meta: {
                title: '通知记录',
                icon: '',
                hideInMenu: false
            },
            component: () => import('@/views/account/NotificationRecord/index.vue')
        },
    ]
}

export default [
    { path: '/*', redirect: '/'},
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

]