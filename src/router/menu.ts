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
        path: '/account/center/bind',
        component: () => import('@/views/account/Center/bind/index.vue')
    },
    {
        path: '/iot/home',
        component: () => import('@/views/home/index.vue')
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
        path: '/notice/Config',
        component: () => import('@/views/notice/Config/index.vue')
    },
    {
        path: '/notice/Config/detail/:id',
        component: () => import('@/views/notice/Config/Detail/index.vue')
    },
    {
        path: '/notice/Template',
        component: () => import('@/views/notice/Template/index.vue')
    },
    {
        path: '/notice/Template/detail/:id',
        component: () => import('@/views/notice/Template/Detail/index.vue')
    },
    // end: 测试用, 可删除

    // 设备管理
    {
        path: '/device/Instance',
        component: () => import('@/views/device/Instance/index.vue')
    },
    {
        path: '/device/Instance/detail/:id',
        component: () => import('@/views/device/Instance/detail.vue')
    },
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
        path: '/link/accessConfig',
        component: () => import('@/views/link/AccessConfig/index.vue')
    },
    {
        path: '/link/accessConfig/detail/add',
        component: () => import('@/views/link/AccessConfig/Detail/index.vue')
    },
    // system 系统管理
    {
        path:'/system/Basis',
        component: ()=>import('@/views/system/Basis/index.vue')
    },
    {
        path:'/system/api',
        component: ()=>import('@/views/system/apiPage/index.vue')
    },
    {
        path:'/system/Role',
        component: ()=>import('@/views/system/Role/index.vue')
    },
    {
        path:'/system/Role/detail/:id',
        component: ()=>import('@/views/system/Role/Detail/index.vue')
    },
    {
        path:'/system/Permission',
        component: ()=>import('@/views/system/Permission/index.vue')
    },
    // 初始化
    {
      path: '/init-home',
      component: () => import('@/views/init-home/index.vue')
    },
    // 物联卡 iot-card
    {
      path: '/iot-card/Home',
      component: () => import('@/views/iot-card/Home/index.vue')
    },
    {
      path: '/iot-card/Dashboard',
      component: () => import('@/views/iot-card/Dashboard/index.vue')
    },
    {
      path: '/iot-card/CardManagement',
      component: () => import('@/views/iot-card/CardManagement/index.vue')
    },
    // 北向输出
    {
        path: '/northbound/DuerOS',
        component: () => import('@/views/northbound/DuerOS/index.vue')
    },
    {
        path: '/northbound/AliCloud',
        component: () => import('@/views/northbound/AliCloud/index.vue')
    },

    // 产品分类 
    {
      path: '/iot/device/Category',
        component: () => import('@/views/device/Category/index.vue')
    } ,
    // 产品
     {
      path: '/iot/device/Product',
      component: () => import('@/views/device/Product/index.vue')
     }
]