import { BasicLayoutPage, BlankLayoutPage, Iframe } from '@/layout'
import { shallowRef } from 'vue'
import {isArray, isFunction} from "lodash-es";

type Buttons = Array<{ id: string }>

type MenuItem = {
    icon: string,
    name: string
    i18nName: string
    code: string
    url: string
    isShow?: boolean
    buttons?: Buttons
    options?: Record<string, any>,
    meta?: Record<string, any>
}

const hasAppID = (item: { appId?: string, url?: string }): { isApp: boolean, appUrl: string } => {
    return {
        isApp: !!item.appId,
        appUrl: `/${item.appId}${item.url}`
    }
}

const handleButtons = (buttons?: Buttons) => {
    return buttons?.map((b) => b.id) || []
}

const handleMeta = (item: MenuItem, isApp: boolean) => {
  const _meta = item.options?.meta || {}
  return {
    ..._meta,
    ...(item.meta || {}),
    icon: item.icon,
    title: item.i18nName || item.name,
    hideInMenu: item.isShow === false,
    buttons: handleButtons(item.buttons),
    isApp
  }
}

const findComponents = (code: string, level: number, isApp: boolean, components: any, meta: any, hasChildren: false) => {
    const myComponents = components[code]
    if (isApp && !hasChildren) {
      return Iframe
    }

    if (!hasChildren && meta && meta.appName && meta.appUrl) {
      return () => import('../views/mirco/SubAppRedirect/base.vue')
    }

    if (level === 1) { // BasicLayoutPage
        // if (myComponents && !hasChildren) {
        //     return meta?.hasLayout === false ? () => myComponents() : h(BasicLayoutPage, {}, h(defineAsyncComponent(() => myComponents()), {}))
        // }
        return myComponents ? () => myComponents() : shallowRef(BasicLayoutPage)
    } else if (level === 2) { // BlankLayoutPage or components
      return myComponents ? () => myComponents() : BlankLayoutPage
    } else if(myComponents) { // components
        return () => myComponents()
    }
    // return components['demo'] // 开发测试用
    return undefined
}

const hasExtraChildren = (item: MenuItem, extraMenus: any ) => {
    const extraItem = extraMenus[item.code]

    if (!extraItem) return undefined

    const extraRoutes = isArray(extraItem) ? extraItem : extraItem.children
    if (extraItem && extraRoutes) {
        return extraRoutes.map(e => ({
          ...e,
            code: `${item.code}/${e.code}`,
          url: `${item.url}${e.url}`,
          isShow: false
        }))
    }

    return undefined
}

const filterMenuCode = ['account-center']

export const handleMenus = (menuData: any, extraMenus: any, components: any, level: number = 1) => {
    if (menuData && menuData.length) {
        return menuData.filter(item => !filterMenuCode.includes(item.code)).map(item => {
            const { isApp, appUrl } = hasAppID(item) // 是否为第三方程序
            const meta = handleMeta(item, isApp)
            const route: any = {
                path: isApp ? appUrl : `${item.url}`,
                name: isApp ? appUrl : item.code,
                url: isApp ? appUrl : item.url,
                meta: meta,
                children: item.children || []
            }

            const myComponent = item.component ?? findComponents(item.code, level, isApp, components, meta, route.children.length)
            if (level === 1 && !route.children.length && myComponent && isFunction(myComponent)) {
              // 一级菜单，没有子菜单，且有组件，使用组件
              const _path = isApp ? appUrl : `${item.url}`
              const parentPath = _path + '/parent'
              route.name = `${item.code}-parent`
              route.path = parentPath
              route.url = parentPath
              route.component = shallowRef(BasicLayoutPage)
              meta.title = ''
              route.meta = meta
              route.children = [item]
            } else {
              route.component = item.component ?? myComponent

              const extraRoute = hasExtraChildren(item, extraMenus)
              if (extraRoute && !isApp) {
                // 包含额外的子路由

                route.children = [...route.children, ...extraRoute]
              }
            }

            if (route.children && route.children.length) {
              route.children = handleMenus(route.children, extraMenus, components, level + 1)
            }

            const showChildren = route.children?.filter(r => !r.meta?.hideInMenu) || []

            if (route.children && route.children.length && showChildren.length) {
              route.redirect = showChildren[0].path
            }

            return route
        })
    }

    return []
}

export const handleMenusMap = (menuData: any, cb: (data: any) => void) => {
  if (menuData && menuData.length) {
    menuData.forEach(item => {
      cb(item)
      if (item.children) {
        handleMenusMap(item.children, cb)
      }
    })
  }
}

const hideInMenu = (code: string) => {
  return ['account-center', 'message-subscribe'].includes(code)
}

export const handleSiderMenu = (menuData: any) => {
  if (menuData && menuData.length) {
    return menuData.filter((item) => item.isShow !== false).map(item => {
      const { isApp, appUrl } = hasAppID(item) // 是否为第三方程序
      const meta = handleMeta(item, isApp)
      const route: any = {
        path: isApp ? appUrl : `${item.url}`,
        name: isApp ? appUrl : item.code,
        url: isApp ? appUrl : item.url,
        meta: meta,
        children: item.children
      }

      if (route.children && route.children.length) {
        route.children = handleSiderMenu(route.children)
      }

      route.meta.hideInMenu = hideInMenu(item.code)

      return route
    })
  }
  return []
}


export const handleAuthMenu = (menuData: any, cb: (code, buttons) => void) => {
  if (menuData && menuData.length) {
    return menuData.forEach(item => {
      const { code, buttons, children} = item

      if (buttons) {
        cb(code, buttons.map(a => a.id))
      }

      if (children) {
        handleAuthMenu(children, cb)
      }
    })
  }
}
