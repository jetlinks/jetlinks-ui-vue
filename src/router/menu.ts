export const LoginPath = '/login'

export const AccountMenu = {
    path: '/account',
    component: () => import('@/components/Layout/BasicLayoutPage.vue'),
    redirect: '/account/center',
    name: 'account',
    meta: {
        title: '个人中心',
        icon: '',
        hideInMenu: true
    },
    children: [
        {
            path: '/account/center',
            name: 'account/center',
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
    // start: 测试用, 可删除
    {
        path: '/login',
        component: () => import('@/views/user/Login/index.vue')
    },
    {
        path: '/demo',
        component: () => import('@/views/demo/index.vue')
    },
    {
        path: '/account/center/bind',
        component: () => import('@/views/account/Center/bind/index.vue')
    },
    {
        path: '/table',
        component: () => import('@/views/demo/table/index.vue')
    },
    {
        path: '/form',
        component: () => import('@/views/demo/Form.vue')
    },
    {
        path: '/system/Api',
        component: () => import('@/views/system/Platforms/index.vue')
    },
    // end: 测试用, 可删除

    // 初始化
    {
      path: '/init-home',
      component: () => import('@/views/init-home/index.vue')
    },

]