// eslint-disable-next-line
import { UserLayout, BasicLayout, PageView, BlankLayout } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/analysis',
        hideChildrenInMenu: true,
        component: RouteView,
        meta: { title: 'menu.dashboard', keepAlive: true, icon: 'bar-chart' },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: 'menu.dashboard.analysis', keepAlive: false }
          }
        ]
      },

      // system
      {
        path: '/system',
        redirect: '/system/user',
        component: RouteView,
        meta: { title: '系统设置', icon: 'setting', permission: ['user', 'role', 'permission', 'dictionary', 'admin'] },
        children: [
          {
            path: '/system/user',
            name: 'SystemUser',
            component: () => import('@/views/form/basicForm'),
            meta: { title: '用户管理', keepAlive: true, permission: ['user', 'admin'] }
          },
          {
            path: '/system/permission',
            name: 'SystemPermission',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: '权限管理', keepAlive: true, permission: ['permission', 'admin'] }
          },
          {
            path: '/system/open-api',
            name: 'SystemOpenApi',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: 'OpenApi客户端', keepAlive: true, permission: ['open-api', 'admin'] }
          },
          {
            path: '/system/org',
            name: 'SystemOrg',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: '机构管理', keepAlive: true, permission: ['dimension', 'admin'] }
          },
          {
            path: '/system/role',
            name: 'SystemRole',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: '角色管理', keepAlive: true, permission: ['dimension', 'admin'] }
          },
          {
            path: '/system/config',
            name: 'SystemConfig',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: '系统配置', keepAlive: true, permission: ['system-config', 'admin'] }
          }
        ]
      },

      // device
      {
        path: '/device',
        name: 'Device',
        component: RouteView,
        redirect: '/device/protocol',
        meta: { title: '设备管理', icon: 'usb', permission: ['device-product', 'device-instance', 'admin'] },
        children: [
          {
            path: '/device/protocol',
            name: 'DeviceProtocol',
            component: () => import('@/views/list/TableList'),
            meta: { title: '协议管理', keepAlive: true, permission: ['protocol-supports', 'admin'] }
          },
          {
            path: '/device/product',
            name: 'DeviceProduct',
            component: () => import('@/views/list/BasicList'),
            meta: { title: '设备型号', keepAlive: true, permission: ['device-product', 'admin'] }
          },
          {
            hidden: true,
            path: '/device/product/save/:id',
            name: 'DeviceSave',
            component: () => import('@/views/list/CardList'),
            meta: { title: '编辑设备型号', keepAlive: true }
          },
          {
            hidden: true,
            path: '/device/product/add',
            name: 'DeviceAdd',
            component: () => import('@/views/list/search/SearchLayout'),
            meta: { title: '添加设备型号', keepAlive: true }
          },
          {
            path: '/device/instance',
            name: 'DeviceInstance',
            component: () => import('@/views/list/search/SearchLayout'),
            meta: { title: '设备实例', keepAlive: true, permission: ['device-instance', 'admin'] }
          },
          {
            hidden: true,
            path: '/device/instance/save/:id',
            name: 'DeviceInstanceSave',
            component: () => import('@/views/list/search/SearchLayout'),
            meta: { title: '设备详情', keepAlive: true }
          },
          {
            hidden: true,
            path: '/device/instance/add',
            name: 'DeviceInstanceAdd',
            component: () => import('@/views/list/search/SearchLayout'),
            meta: { title: '添加设备实例', keepAlive: true }
          },
          {
            path: '/device/gateway',
            name: 'DeviceGateway',
            component: () => import('@/views/list/search/SearchLayout'),
            meta: { title: '网关设备', keepAlive: true, permission: ['device-gateway', 'admin'] }
          },
          {
            path: '/device/location',
            name: 'DeviceLocation',
            component: () => import('@/views/list/search/SearchLayout'),
            meta: { title: '地理位置', keepAlive: true, permission: ['geo-manager', 'admin'] }
          },
          {
            path: '/device/firmware',
            name: 'DeviceFirmware',
            component: () => import('@/views/list/search/SearchLayout'),
            meta: { title: '固件升级', keepAlive: true, permission: ['firmware-manager', 'admin'] }
          },
          {
            hidden: true,
            path: '/device/firmware/save/:id',
            name: 'DeviceFirmwareSave',
            component: () => import('@/views/list/search/SearchLayout'),
            meta: { title: '固件详情', keepAlive: true }
          }
        ]
      },

      // network
      {
        path: '/network',
        name: 'Network',
        component: RouteView,
        redirect: '/network/certificate',
        meta: { title: '网络组件', icon: 'appstore', permission: ['certificate', 'network-config', 'device-gateway', 'admin'] },
        children: [
          {
            path: '/network/certificate',
            name: 'NetworkCertificate',
            component: () => import('@/views/profile/basic'),
            meta: { title: '证书管理', icon: 'book', permission: ['certificate', 'admin'] }
          },
          {
            path: '/network/type',
            name: 'NetworkType',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: '组件管理', icon: 'flag', permission: ['network-config', 'admin'] }
          },
          {
            path: '/network/gateway',
            name: 'NetworkGateway',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: '设备网关', icon: 'thunderbolt', permission: ['device-gateway', 'admin'] }
          }
        ]
      },

      // notice
      {
        path: '/notice',
        name: 'Notice',
        component: RouteView,
        redirect: '/notice/config',
        meta: { title: '通知管理', icon: 'sound', permission: ['notifier', 'template', 'admin'] },
        children: [
          {
            path: '/notice/config',
            name: 'NoticeConfig',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: '通知配置', icon: 'setting', keepAlive: false, hiddenHeaderContent: true, permission: ['notifier', 'admin'] }
          },
          {
            path: '/notice/template',
            name: 'NoticeTemplate',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: '通知模版', icon: 'tags', keepAlive: false, hiddenHeaderContent: true, permission: ['template', 'admin'] }
          }
        ]
      },

      // logger
      {
        path: '/logger',
        name: 'Logger',
        component: RouteView,
        redirect: '/logger/access',
        meta: { title: '日志管理', icon: 'wallet', permission: ['system-logger', 'access-logger', 'admin'] },
        children: [
          {
            path: '/logger/access',
            name: 'LogAccess',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '访问日志', icon: 'ordered-list', permission: ['access-logger', 'admin'] }
          },
          {
            path: './logger/system',
            name: 'LogSystem',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '系统日志', icon: 'bars', permission: ['system-logger', 'admin'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: [ 'exception' ] }
          }
        ]
      },

      // account
      {
        hidden: true,
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: '个人中心', keepAlive: true, permission: [ 'user' ] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: [ 'user' ] }
              }
            ]
          }
        ]
      },

      // demo
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '组件示例', icon: 'slack', permission: [ 'template' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'template' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'template' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRoleDemo',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/LoginJet')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
