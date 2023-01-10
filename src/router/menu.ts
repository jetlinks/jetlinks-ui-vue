export const LoginPath = '/login'

export default [
    // {
    //     path: '/',
    //     redirect: LoginPath
    // },
    // {
    //     path: '/init',
    //     component: () => import('@/view/InitPage.vue')
    // },
    // {
    //     path: LoginPath,
    //     name: 'login',
    //     component: () => import('@/view/Login/index.vue')
    // },
    // {
    //   path: '/initsetting',
    //   component: () => import('@/view/Login/initSet.vue')
    // }

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
        path: '/bind',
        component: () => import('@/views/account/Center/bind/index.vue')
    },
    {
        path: '/iot/home',
        component: () => import('@/views/iot/home/index.vue')
    },
    {
        path: '/table',
        component: () => import('@/views/table/index.vue')
    },
    // end: 测试用, 可删除

    // link 运维管理
    {
        path: '/link/log',
        component: () => import('@/views/link/Log/index.vue')
    },
    {
        path: '/link/certificate',
        component: () => import('@/views/link/Certificate/index.vue')
    },
    {
        path: '/link/certificate/detail/add',
        component: () => import('@/views/link/Certificate/Detail/index.vue')
    },
    {
        path: '/link/accessConfig/detail/add',
        component: () => import('@/views/link/AccessConfig/Detail/index.vue')
    },
]