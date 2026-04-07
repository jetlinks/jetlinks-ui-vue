import type { RouteRecordRaw } from 'vue-router'
import { RouteSecurityLevel } from './types'

export const USER_CENTER_ROUTE: RouteRecordRaw = {
  path: '/account',
  name: 'Account',
  redirect: '/account/center',
  component: () => import('@jetlinks-web-core/layout/BasicLayoutPage.vue'),
  meta: {
    title: '个人中心',
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
      component: () => import('@jetlinks-web-core/views/account/center/index.vue')
    }
  ]
}

export const LOGIN_ROUTE: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  // @ts-ignore
  component: () => import('@jetlinks-web-core/views/login/index.vue'),
  meta: {
    title: '登录页',
    security: RouteSecurityLevel.PUBLIC
  }
}

export const EDGE_TOKEN_ROUTE: RouteRecordRaw = {
  path: '/edge/token/:id',
  name: 'EdgeToken',
  meta: {
    title: 'token失效'
  },
  component: () => import('@jetlinks-web-core/views/TokenJump/index.vue')
}

export const AccountCenterBind: RouteRecordRaw = {
  path: '/account/center/bind',
  name: 'AccountCenterBind',
  meta: {
    title: '第三方',
    security: RouteSecurityLevel.PUBLIC
  },
  component: () => import('@jetlinks-web-core/views/account/center/bind/index.vue')
}

/** 身份验证结果页（邮箱/手机验证链接跳转后展示） */
export const IdentityResultRoute: RouteRecordRaw = {
  path: '/identity-result',
  name: 'identity-result',
  meta: {
    title: '验证结果',
    hideInMenu: true
  },
  component: () => import('@jetlinks-web-core/views/account/identity-result/index.vue')
}

export const OAuth2: RouteRecordRaw = {
  path: '/oauth',
  name: 'Oauth',
  meta: {
    title: '授权页',
    security: RouteSecurityLevel.PUBLIC
  },
  component: () => import('@jetlinks-web-core/views/oauth/index.vue')
}

export const INIT_HOME: RouteRecordRaw = {
  path: '/init-home',
  name: 'init-home',
  component: () => import('@jetlinks-web-core/views/init-home/index.vue'),
  meta: {
    title: '初始化'
  }
}

export const OAuthWechat: RouteRecordRaw = {
  path: '/oauth/wechat',
  name: 'OAuthWechat',
  meta: {
    title: '微信授权页'
  },
  component: () => import('@jetlinks-web-core/views/oauth/WeChat.vue')
}

export const AUTHORIZE_ROUTE: RouteRecordRaw = {
  path: '/share/authorize',
  name: 'Authorize',
  component: () => import('@jetlinks-web-core/views/share/authorize/index.vue'),
  meta: {
    title: '授权认证',
    security: RouteSecurityLevel.PUBLIC
  }
}

export const Demo: RouteRecordRaw = {
  path: '/demo',
  name: 'Demo',
  redirect: '/demo/center',
  component: () => import('@jetlinks-web-core/layout/BasicLayoutPage.vue'),
  children: [
    {
      path: '/demo/center',
      name: 'DemoCenter',
      meta: {
        title: 'Demo'
      },
      component: () => import('@jetlinks-web-core/views/demo/index.vue')
    }
  ],
  meta: {
    title: 'Demo'
  }
}
//
// export const Scene: RouteRecordRaw = {
//   path: '/scene',
//   name: 'Scene',
//   redirect: '/scene/center',
//   children: [
//     {
//       path: '/scene/center',
//       name: 'SceneCenter',
//       meta: {
//         title: '场景商城'
//       },
//       component: () => import('@jetlinks-web-core/views/scene/index.vue')
//     },
//     {
//       path: '/scene/center/detail',
//       name: 'SceneCenterDetail',
//       meta: {
//         title: '场景商城详情'
//       },
//       component: () => import('@jetlinks-web-core/views/scene/Detail.vue')
//     }
//   ],
//   meta: {
//     title: '场景商城'
//   }
// }
