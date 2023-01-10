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
        path: '/iot/home',
        component: () => import('@/views/iot/home/index.vue')
    },
    // end: 测试用, 可删除
]