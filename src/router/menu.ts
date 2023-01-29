export const LoginPath = '/login'
import { BasicLayoutPage, BlankLayoutPage } from '@/components/Layout'

export default [
    // {
    //     path: '/iot',
    //     redirect: '/iot/device',
    //     meta: {
    //         title: '物联网',
    //         icon: 'EditOutlined'
    //     },
    //     component: BasicLayoutPage,
    //     children: [
    //         {
    //             path: '/iot/device',
    //             redirect: '/iot/device/instance',
    //             meta: {
    //                 title: '设备管理',
    //                 icon: 'EditOutlined'
    //             },
    //             component: BlankLayoutPage,
    //             children: [
    //                 {
    //                     path: '/iot/device/instance',
    //                     component: () => import('@/views/demo/Search.vue'),
    //                     meta: {
    //                         title: '设备'
    //                     },
    //                 },
    //                 {
    //                     path: '/iot/device/instance2',
    //                     component: () => import('@/views/demo/Search.vue'),
    //                     meta: {
    //                         title: '设备2'
    //                     },
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     path: '/iot2',
    //     redirect: '/iot2/device',
    //     meta: {
    //         title: '物联网2'
    //     },
    //     component: BasicLayoutPage,
    //     children: [
    //         {
    //             path: '/iot2/device',
    //             redirect: '/iot2/device/instance',
    //             meta: {
    //                 title: '设备管理2'
    //             },
    //             component: BlankLayoutPage,
    //             children: [
    //                 {
    //                     path: '/iot2/device/instance',
    //                     component: () => import('@/views/demo/Search.vue'),
    //                     meta: {
    //                         title: '设备2'
    //                     },
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     path: '/init-home',
    //     component: () => import('@/view/init-home/index.vue')
    // },
    {
        path: LoginPath,
        name: 'login',
        component: () => import('@/views/user/Login/index.vue')
    },
    // {
    //   path: '/initsetting',
    //   component: () => import('@/view/Login/initSet.vue')
    // }

    // start: 测试用, 可删除
    // {
    //     path: '/login',
    //     component: () => import('@/views/user/Login/index.vue')
    // },
    // {
    //     path: '/demo',
    //     component: () => import('@/views/demo/index.vue')
    // },
    // {
    //     path: '/account/center/bind',
    //     component: () => import('@/views/account/Center/bind/index.vue')
    // },
    // {
    //     path: '/iot/home',
    //     component: () => import('@/views/home/index.vue')
    // },
    // {
    //     path: '/table',
    //     component: () => import('@/views/demo/table/index.vue')
    // },
    // {
    //     path: '/form',
    //     component: () => import('@/views/demo/Form.vue')
    // },
    // {
    //     path: '/search',
    //     component: () => import('@/views/demo/Search.vue')
    // },
    // {
    //     path: '/notice/Config',
    //     component: () => import('@/views/notice/Config/index.vue')
    // },
    // {
    //     path: '/notice/Config/detail/:id',
    //     component: () => import('@/views/notice/Config/Detail/index.vue')
    // },
    // {
    //     path: '/notice/Template',
    //     component: () => import('@/views/notice/Template/index.vue')
    // },
    // {
    //     path: '/notice/Template/detail/:id',
    //     component: () => import('@/views/notice/Template/Detail/index.vue')
    // },
    // // end: 测试用, 可删除
    //
    // // 设备管理
    // {
    //     path: '/device/Instance',
    //     component: () => import('@/views/device/Instance/index.vue')
    // },
    // // link 运维管理
    // {
    //     path: '/link/log',
    //     component: () => import('@/views/link/Log/index.vue')
    // },
    // {
    //     path: '/link/certificate',
    //     component: () => import('@/views/link/Certificate/index.vue')
    // },
    // {
    //     path: '/link/certificate/detail/add',
    //     component: () => import('@/views/link/Certificate/Detail/index.vue')
    // },
    // {
    //     path: '/link/accessConfig',
    //     component: () => import('@/views/link/AccessConfig/index.vue')
    // },
    // {
    //     path: '/link/accessConfig/detail/add',
    //     component: () => import('@/views/link/AccessConfig/Detail/index.vue')
    // },
    // // system 系统管理
    // {
    //     path:'/system/Basis',
    //     component: ()=>import('@/views/system/Basis/index.vue')
    // },
    // {
    //     path:'/system/api',
    //     component: ()=>import('@/views/system/apiPage/index.vue')
    // },
    // {
    //     path:'/system/Role',
    //     component: ()=>import('@/views/system/Role/index.vue')
    // },
    // {
    //     path:'/system/Role/detail/:id',
    //     component: ()=>import('@/views/system/Role/Detail/index.vue')
    // },
    // {
    //     path:'/system/Permission',
    //     component: ()=>import('@/views/system/Permission/index.vue')
    // },
    // // 初始化
    {
      path: '/init-home',
      component: () => import('@/views/init-home/index.vue')
    },
    // // 物联卡 iot-card
    // {
    //   path: '/iot-card/Home',
    //   component: () => import('@/views/iot-card/Home/index.vue')
    // },
    // {
    //   path: '/iot-card/Dashboard',
    //   component: () => import('@/views/iot-card/Dashboard/index.vue')
    // },
    // // 北向输出
    // {
    //     path: '/northbound/DuerOS',
    //     component: () => import('@/views/northbound/DuerOS/index.vue')
    // },
    // {
    //     path: '/northbound/AliCloud',
    //     component: () => import('@/views/northbound/AliCloud/index.vue')
    // },
    //
    // // 产品分类
    // {
    //   path: '/iot/device/Category',
    //     component: () => import('@/views/device/Category/index.vue')
    // }
]