import { createRouter, createWebHashHistory } from 'vue-router'
import menus, { AccountCenterBindPath, InitHomePath, LoginPath, OauthPath } from './menu'
import { cleanToken, getToken } from '@/utils/comm'
import { useUserInfo } from '@/store/userInfo'
import { useSystem } from '@/store/system'
import NotFindPage from '@/views/404.vue'
import { useMenuStore } from 'store/menu'

const router = createRouter({
  history: createWebHashHistory(),
  routes: menus,
  scrollBehavior(to, form, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

const filterPath = [ InitHomePath ]
const noTokenPath = [ AccountCenterBindPath, OauthPath ]

router.beforeEach((to, from, next) => {
  // TODO 切换路由取消请求
  const token = getToken()
  console.log(to.path, noTokenPath.includes(to.path))
  if (noTokenPath.includes(to.path)) {
    next()
  } else if (token) {
    if (to.path === LoginPath) {
      next({ path: '/' })
    } else {
      const userInfo = useUserInfo()
      const system = useSystem()
      const menu = useMenuStore()
      if (!Object.keys(menu.menus).length && !filterPath.includes(to.path)) {
        userInfo.getUserInfo().then(() => {
          system.getSystemVersion().then((menuData: any[]) => {
            menuData.forEach(r => {
              router.addRoute('base', r)
            })
            router.addRoute('base',{
              path: '/:pathMatch(.*)',
              name: 'error',
              component: () => NotFindPage
            })

            next({ ...to, replace: true })
          })
        }).catch(() => {
          cleanToken()
          next({ path: LoginPath })
        })
      } else {
        next()
      }
    }

  } else {
    if (to.path === LoginPath) {
      next()
    } else {
      next({ path: LoginPath })
    }
  }
})

export default router