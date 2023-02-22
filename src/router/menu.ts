export const LoginPath = '/login'

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
        path: '/search',
        component: () => import('@/views/demo/Search.vue')
    },
    {
        path: '/system/Api',
        component: () => import('@/views/system/Apply/Api/index.vue')
    },

    // end: 测试用, 可删除

    // 初始化
    {
      path: '/init-home',
      component: () => import('@/views/init-home/index.vue')
    },

]