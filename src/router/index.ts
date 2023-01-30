import { createRouter, createWebHashHistory } from 'vue-router'
import menus, { LoginPath } from './menu'
import { cleanToken, getToken } from '@/utils/comm'
import { useUserInfo } from '@/store/userInfo'
import { useSystem } from '@/store/system'

const router = createRouter({
  history: createWebHashHistory(),
  routes: menus
})

const filterPath = [
  '/form',
  '/search'
]

router.beforeEach((to, from, next) => {
  // TODO 切换路由取消请求
  const isFilterPath = filterPath.includes(to.path)
  if (isFilterPath) {
    next()
  } else {
    const token = getToken()
    if (token) {
      if (to.path === LoginPath) {
        next({ path: '/' })
      } else {
        const userInfo = useUserInfo()
        const system = useSystem()

        if (!userInfo.userInfos.username) {
          userInfo.getUserInfo().then(() => {
            system.getSystemVersion().then((menuData: any[]) => {
              menuData.forEach(r => {
                router.addRoute('main', r)
              })
              const redirect = decodeURIComponent((from.query.redirect as string) || to.path)
              if(to.path === redirect) {
                next({ ...to, replace: true })
              } else {
                next({ path: redirect })
              }
            })
          }).catch(() => {
            console.log('userInfo', userInfo)
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
  }
})

export default router