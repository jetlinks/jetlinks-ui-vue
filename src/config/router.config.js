// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    icon: '',
    meta: { title: 'menu.home' },
    redirect: '/analysis',
    children: [
      {
        path: '/analysis/:pageNo([1-9]\\d*)?',
        name: 'Analysis',
        component: () => import('@/views/dashboard/Analysis'),
        meta: { title: 'menu.dashboard.analysis', icon: 'dashboard', keepAlive: false, permission: [ 'dashboard' ] }
      },

      // Menulist
      {
        path: '/device',
        name: 'device',
        component: RouteView,
        redirect: '/device/product',
        meta: { title: '设备管理', icon: 'box-plot', permission: [ 'table' ] },
        children: [
          {
            path: '/device/product',
            name: 'DeviceProduct',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/device/product'),
            meta: { title: '产品', keepAlive: true, icon: 'laptop', permission: [ 'table' ] },
            children: [
              {
                path: '/device/product/add',
                name: 'AddProduct',
                hidden: true,
                component: () => import('@/views/device/product/add'),
                meta: { title: '新建产品', keepAlive: true, permission: [ 'table' ] }
              },
              {
                path: '/device/product/save/:id',
                props: true,
                name: 'ProductDetail',
                hidden: true,
                component: () => import('@/views/device/product/save'),
                meta: { title: '产品详情', keepAlive: true, permission: [ 'table' ] }
              }
            ]
          },
          {
            path: '/device/instance',
            name: 'instance',
            component: () => import('@/views/device/instance'),
            hideChildrenInMenu: true,
            meta: { title: '设备', icon: 'desktop', keepAlive: true, permission: [ 'table' ] },
            children: [
              {
                path: '/device/instance/save/:id',
                name: 'InstanceDetail',
                hidden: true,
                component: () => import('@/views/device/instance/editor'),
                meta: { title: '设备详情', keepAlive: true, permission: [ 'table' ] }
              }
            ]
          },
          {
            path: '/device/alarm',
            name: 'deviceAlarm',
            component: () => import('@/views/device/alarmlog'),
            meta: { title: '设备告警', icon: 'alert', keepAlive: true, permission: [ 'table' ] }
          }
        ]
      },
      {
        path: '/network',
        name: 'network',
        component: RouteView,
        meta: { title: '设备接入', icon: 'login', permission: [ 'exception' ] },
        children: [
          {
            path: '/network/certificate',
            name: 'NetworkCertificate',
            component: () => import(/* webpackChunkName: "NetworkCertificate" */ '@/views/network/certificate'),
            meta: { title: '证书管理', icon: 'book', permission: [ 'exception' ] }
          },
          {
            path: '/network/protocol',
            name: 'networkProtocol',
            component: () => import(/* webpackChunkName: "networkProtocol" */ '@/views/network/protocol'),
            meta: { title: '协议管理', icon: 'wallet', permission: [ 'exception' ] }
          },
          {
            path: '/network/type',
            name: 'networkType',
            component: () => import(/* webpackChunkName: "networkType" */ '@/views/network/type'),
            meta: { title: '网络组件', icon: 'deployment-unit', permission: [ 'exception' ] }
          },
          {
            path: '/network/gateway',
            name: 'networkGateway',
            component: () => import(/* webpackChunkName: "networkGateway" */ '@/views/network/gateway'),
            meta: { title: '设备网关', icon: 'cloud-server', permission: [ 'exception' ] }
          }
        ]
      },
      {
        path: '/notice',
        name: 'notice',
        component: RouteView,
        meta: { title: '通知管理', icon: 'message', permission: [ 'exception' ] },
        children: [
          {
            path: '/notice/config',
            name: 'NoticeConfig',
            component: () => import(/* webpackChunkName: "NoticeConfig" */ '@/views/notice/config'),
            meta: { title: '通知配置', icon: 'alert', permission: [ 'exception' ] }
          },
          {
            path: '/notice/template',
            name: 'NoticeTemplate',
            component: () => import(/* webpackChunkName: "NoticeTemplate" */ '@/views/notice/template'),
            meta: { title: '通知模版', icon: 'bell', permission: [ 'exception' ] }
          }
        ]
      },
      {
        path: '/rule-engine',
        name: 'ruleEngine',
        component: RouteView,
        meta: { title: '规则引擎', icon: 'retweet', permission: [ 'exception' ] },
        children: [
          {
            path: '/rule-engine/sqlRule',
            name: 'RuleEngineSqlrule',
            component: () => import(/* webpackChunkName: "RuleEngineSqlrule" */ '@/views/rule-engine/sqlRule'),
            meta: { title: '数据转发', icon: 'rise', permission: [ 'exception' ] }
          }
        ]
      },
      {
        path: '/logger',
        name: 'logger',
        component: RouteView,
        meta: { title: '日志管理', icon: 'calendar', permission: [ 'exception' ] },
        children: [
          {
            path: '/logger/access',
            name: 'LoggerAccess',
            component: () => import(/* webpackChunkName: "LoggerAccess" */ '@/views/logger/access'),
            meta: { title: '证书管理', icon: 'dash', permission: [ 'exception' ] }
          },
          {
            path: '/logger/system',
            name: 'LoggerSystem',
            component: () => import(/* webpackChunkName: "LoggerSystem" */ '@/views/logger/system'),
            meta: { title: '系统日志', icon: 'ordered-list', permission: [ 'exception' ] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        hidden: true,
        meta: { title: '异常页', icon: 'warning', permission: [ 'exception' ] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: [ 'exception' ] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: [ 'exception' ] }
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
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        hidden: true,
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
      }

      // other
      /*
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
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
                name: 'SystemRole',
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
      */
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
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
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
