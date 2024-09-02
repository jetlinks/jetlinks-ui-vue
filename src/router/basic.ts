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
