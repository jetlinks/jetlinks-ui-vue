interface RouteRecordItem {

}

export const USER_CENTER_ROUTE: RouteRecordItem = {
  path: "/account",
  name: "Account",
  redirect: "/account/center",
  component: () => import("@/layout/BasicLayoutPage.vue"),
  meta: {
    title: "个人中心",
    hideInMenu: true,
  },
  children: [
    {
      path: "/account/center",
      name: "account/center",
      meta: {
        title: "基本设置",
        icon: "",
        hideInMenu: false,
      },
      component: () => import("@/views/account/center/index.vue"),
    },
    // {
    //   path: AccountCenterBindPath,
    //   name: "account/center/bind",
    //   component: () => import("@/views/account/center/bind/index.vue"),
    // },
  ],
};

export const LOGIN_ROUTE: RouteRecordItem = {
  path: "/login",
  name: "Login",
  // @ts-ignore
  component: () => import("@/views/login/index.vue"),
  meta: {
    title: "登录页",
  },
};

export const NOT_FIND_ROUTE: RouteRecordItem = {
  path: "/:pathMatch(.*)",
  name: "error",
  component: () => import("@/views/Error/404.vue"),
  meta: {
    title: "404",
  },
};

export const INIT_HOME: RouteRecordItem = {
  path: '/init-home',
  name: 'init-home',
  component: () => import("@/views/init-home/index.vue"),
  meta: {
    title: "初始化",
  },
}

export const EDGE_TOKEN_ROUTE: RouteRecordItem = {
  path: '/edge/token/:id',
  meta: {
    title: 'token失效'
  },
  component: () => import('@/views/TokenJump/index.vue')
};

export const AccountCenterBind = {
  path: '/account/center/bind',
  meta: {
    title: '第三方'
  },
  component: () => import("@/views/account/center/bind/index.vue"),
}

export const OAuth2 = {
  path: '/oauth',
  meta: {
    title: '授权页'
  },
  component: () => import('@/views/oauth/index.vue')
}

export const OAuthWechat = {
  path: '/oauth/wechat',
    meta: {
    title: '微信授权页'
  },
  component: () => import('@/views/oauth/WeChat.vue')
}
