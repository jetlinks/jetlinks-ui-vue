import { BlankLayoutPage, BasicLayoutPage } from 'components/Layout'
import { isNoCommunity } from '@/utils/utils'
import Iframe from '../views/iframe/index.vue'

const pagesComponent = import.meta.glob('../views/**/*.vue');

/**
 * 权限信息
 */
export type PermissionInfo = {
  permission: string;
  actions: string[];
};

/**
 * 按钮信息
 */
export type MenuButtonInfo = {
  id: string;
  name: string;
  permissions: PermissionInfo;
  createTime: number;
  describe?: string;
  options: Record<string, any>;
};


export type MenuItem = {
  id: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 编码
   */
  code: string;
  /**
   * 所属应用
   */
  application: string;
  /**
   * 描述
   */
  describe: string;
  /**
   * url，路由
   */
  url: string;
  /**
   * 图标
   */
  icon: string;
  /**
   * 状态, 0为禁用，1为启用
   */
  status: number;
  /**
   * 绑定权限信息
   */
  permissions: PermissionInfo[];
  /**
   * 按钮定义信息
   */
  buttons: MenuButtonInfo[];
  /**
   * 其他配置信息
   */
  options: Record<string, any>;
  /**
   * 父级ID
   */
  parentId: string;
  /**
   * 树结构路径
   */
  path: string;
  /**
   * 排序序号
   */
  sortIndex: number;
  /**
   * 树层级
   */
  level: number;
  createTime: number;
  redirect?: string;
  children?: MenuItem[];
  accessSupport?: { text: string; value: string };
  appId?: string; //应用id
  isShow?: boolean;
  meta?: {
    title?: string
    icon?: string
    [key: string]: any
  },
  component?: any,
  props?: boolean
};

// 额外子级路由
const extraRouteObj = {
  'media/Cascade': {
    children: [
      { code: 'Save', name: '新增' },
      { code: 'Channel', name: '选择通道' },
    ],
  },
  'media/Device': {
    children: [
      { code: 'Save', name: '详情' },
      { code: 'Channel', name: '通道列表' },
      { code: 'Playback', name: '回放' },
    ],
  },
  'rule-engine/Scene': {
    children: [
      { code: 'Save', name: '详情' },
      { code: 'Save2', name: '测试详情' },
    ],
  },
  'rule-engine/Alarm/Configuration': {
    children: [{ code: 'Save', name: '详情' }],
  },
  'device/Firmware': {
    children: [{ code: 'Task', name: '升级任务' }],
  },
  demo: {
    children: [{ code: 'AMap', name: '地图' }],
  },
  'system/Platforms': {
    children: [
      { code: 'Api', name: '赋权' },
      { code: 'View', name: 'Api详情' },
    ],
  },
  'system/DataSource': {
    children: [{ code: 'Management', name: '管理' }],
  },
  'system/Menu': {
    children: [{ code: 'Setting', name: '菜单配置' }],
  },
  'system/Apply': {
    children: [
      { code: 'Api', name: '赋权' },
      { code: 'View', name: 'Api详情' },
      { code: 'Save', name: '详情' },
    ],
  },
  'edge/Device': {
    children: [{ code: 'Remote', name: '远程控制' }],
  },
  'rule-engine/Alarm/Log': {
    children: [{ code: 'Record', name: '处理记录' }]
  }
};

//
// const resolveComponent = (name: any) => {
//   const importPage = pagesComponent[`../views/${name}/index.vue`];
//   console.log(importPage)
//   if (!importPage) {
//     return undefined
//   } else {
//     const res = () => importPage()
//     return res
//   }
//   //@ts-ignore
// }
//
// const findChildrenRoute = (code: string, url: string, routes: any[] = []): MenuItem[] => {
//   if (extraRouteObj[code]) {
//     const extraRoutes = extraRouteObj[code].children.map((route: MenuItem) => {
//       return {
//         url: `${url}/${route.code}`,
//         code: `${code}/${route.code}`,
//         name: route.name,
//         isShow: false
//       }
//     })
//     return [...routes, ...extraRoutes]
//   }
//   return routes
// }
//
// const findDetailRouteItem = (code: string, url: string): Partial<MenuItem> | null => {
//   const detailComponent = resolveComponent(`${code}/Detail`)
//   if (detailComponent) {
//     return {
//       url: `${url}/detail/:id`,
//       code: `${code}/Detail`,
//       component: detailComponent,
//       name: '详情信息',
//       isShow: false
//     }
//   }
//   return null
// }
//
// const findDetailRoutes = (routes: any[]): any[] => {
//   const newRoutes: any[] = []
//   routes.forEach((route: any) => {
//     newRoutes.push(route)
//     const detail = findDetailRouteItem(route.code, route.url)
//     if (detail) {
//       newRoutes.push(detail)
//     }
//   })
//   return newRoutes
// }
//
// const filterMenus = ['device/DashBoard']
// export const filterCommunityMenus = (menuData: any[]) => {
//   return menuData.filter(item => {
//     if (item.children) {
//       item.children = filterCommunityMenus(item.children)
//     }
//     return !filterMenus.includes(item.code)
//   })
// }
//
// export const findCodeRoute = (asyncRouterMap: any[]) => {
//   const routeMeta = {}
//
//   function getDetail(code: string, url: string) {
//     const detail = findDetailRouteItem(code, url)
//     if (!detail) return
//
//     routeMeta[(detail as MenuItem).code] = {
//       path: detail.url,
//       title: detail.name,
//       parentName: code,
//       buttons: detail.buttons?.map((b: any) => b.id) || []
//     }
//   }
//
//   function findChildren(data: any[], code: string = '') {
//     data.forEach(route => {
//       routeMeta[route.code] = {
//         path: route.url || route.path,
//         title: route.meta?.title || route.name,
//         parentName: code,
//         buttons: route.buttons?.map((b: any) => b.id) || []
//       }
//       const otherRoutes = extraRouteObj[route.code]
//
//       if (otherRoutes) {
//         otherRoutes.children.map((item: any) => {
//           const _code = `${route.code}/${item.code}`
//           const url = `${route.url}/${item.code}`
//           routeMeta[_code] = {
//             path: `${route.url}/${item.code}`,
//             title: item.name,
//             parentName: route.code,
//             buttons: item.buttons?.map((b: any) => b.id) || []
//           }
//           getDetail(_code, url)
//         })
//       }
//       const _code = route.appId ? `/${route.appId}${route.url}` : route.code
//       if (!route.appId) {
//         getDetail(_code, route.url)
//       } else {
//         routeMeta[_code] = {
//           path: `/${route.appId}${route.url}`,
//           title: route.name,
//           parentName: code,
//           buttons: []
//         }
//       }
//       if (route.children) {
//         findChildren(route.children, _code)
//       }
//     })
//   }
//
//   findChildren(asyncRouterMap)
//
//   return routeMeta
// }
//
// export function filterAsyncRouter(asyncRouterMap: any, parentCode = '', level = 1): { menusData: any, silderMenus: any } {
//   const _asyncRouterMap = cloneDeep(asyncRouterMap)
//   const menusData: any[] = []
//   const silderMenus: any[] = []
//   _asyncRouterMap.forEach((route: any) => {
//     const hasAppId = route.appId
//     const _route: any = {
//       path:  hasAppId ? `/${route.appId}${route.url}` : `${route.url}`,
//       name: hasAppId ? `/${route.appId}${route.url}` : route.code,
//       url: hasAppId ? `/${route.appId}${route.url}` : route.url,
//       meta: {
//         icon: route.icon,
//         title: route.name,
//         hideInMenu: route.isShow === false,
//         buttons: route.buttons?.map((b: any) => b.id) || [],
//         isApp: hasAppId,
//       },
//     }
//
//     const silder = { ..._route }
//     // 查看是否有隐藏子路由
//     route.children = findChildrenRoute(route.code, route.url, route.children)
//     route.children = findDetailRoutes(route.children)
//     if (route.children && route.children.length) {
//       // TODO 查看是否具有详情页
//       const { menusData: _menusData, silderMenus: _silderMenus } = filterAsyncRouter(route.children, `${parentCode}/${route.code}`, level + 1)
//       _route.children = _menusData
//       silder.children = _silderMenus
//       const showChildren = _route.children.some((r: any) => !r.meta.hideInMenu)
//
//       if (showChildren && _route.children.length) {
//         _route.component = level === 1 ? BasicLayoutPage : BlankLayoutPage
//         _route.redirect = _route.children[0].url
//       } else {
//         const myComponent = resolveComponent(route.code)
//         // _route.component = myComponent ? myComponent : BlankLayoutPage;
//         if (!!myComponent) {
//           _route.component = myComponent;
//           _route.children.map((r: any) => menusData.push(r))
//           delete _route.children
//         } else {
//           _route.component = BlankLayoutPage
//         }
//       }
//     } else {
//       if (hasAppId) {
//         _route.component = route.component || resolveComponent('iframe')
//       } else {
//         _route.component = route.component || resolveComponent(route.code) || BlankLayoutPage
//       }
//     }
//     menusData.push(_route)
//     silderMenus.push(silder)
//   })
//   return {
//     menusData,
//     silderMenus,
//   }
// }

import { shallowRef } from 'vue'

type Buttons = Array<{ id: string }>

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
  return {
    icon: item.icon,
    title: item.name,
    hideInMenu: item.isShow === false,
    buttons: handleButtons(item.buttons),
    isApp
  }
}

const findComponents = (code: string, level: number, isApp: boolean, components: any) => {
  const myComponents = components[code]
  if (level === 1) { // BasicLayoutPage
    return myComponents ? () => myComponents() : BasicLayoutPage
  } else if (level === 2) { // BlankLayoutPage or components
    return myComponents ? () => myComponents() : BlankLayoutPage
  } else if (isApp){ // iframe
    return () => Iframe
  } else if(myComponents) { // components
    return () => myComponents()
  }
  // return components['demo'] // 开发测试用
  return undefined
}

const hasExtraChildren = (item: MenuItem, extraMenus: any ) => {
  const extraItem = extraMenus[item.code]
  if (extraItem) {
    return extraItem.children.map(e => ({
      ...e,
      url: `${item.url}${e.url}`,
      isShow: false
    }))
  }

  return undefined
}

export const getAsyncRoutesMap = () => {
  const modules = {}
  Object.keys(pagesComponent).forEach(item => {
    const code = item.replace('../views/', '').replace('/index.vue', '')
    modules[code] = pagesComponent[item]
  })
  return modules
}

const findDetailRouteItem = (item: any, components: any) => {
  const { code, url } = item
  const detailComponent = components[`${item.code}/Detail`]
  if (detailComponent) {
    return [{
      url: `${url}/detail/:id`,
      code: `${code}/Detail`,
      component: detailComponent,
      name: '详情信息',
      isShow: false
    }]
  }
  return []
}

export const handleMenus = (menuData: any[], components: any, level: number = 1) => {
  if (menuData && menuData.length) {
    return menuData.map(item => {
      const { isApp, appUrl } = hasAppID(item) // 是否为第三方程序
      const meta = handleMeta(item, isApp)
      const route: any = {
        path: isApp ? appUrl : `${item.url}`,
        name: isApp ? appUrl : item.code,
        url: isApp ? appUrl : item.url,
        meta: meta,
        children: item.children
      }

      route.component = findComponents(item.code, level, isApp, components)
      const extraRoute = hasExtraChildren(item, extraRouteObj)
      const detail_components = findDetailRouteItem(item, components)


      if (extraRoute && !isApp) { // 包含额外的子路由
        route.children = route.children ? [...route.children, ...extraRoute] : extraRoute
      }

      if (detail_components.length) {
        route.children = route.children ? route.children.concat(detail_components) : detail_components
      }

      if (route.children && route.children.length) {
        route.children = handleMenus(route.children, components, level + 1)
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

export const handleMenusMap = (menuData: any[], cb: (data: any) => void) => {
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

export const handleSiderMenu = (menuData: any[]) => {
  if (menuData && menuData.length) {
    return menuData.map(item => {
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


export const handleAuthMenu = (menuData: any[], cb: (code: any, buttons: any[]) => void) => {
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