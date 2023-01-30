const pagesComponent = import.meta.glob('../views/system/**/*.vue', { eager: true });
import { BlankLayoutPage, BasicLayoutPage } from 'components/Layout'

type ExtraRouteItem = {
  code: string
  name: string
  url?: string
}
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
};


const resolveComponent = (name: any) => {
  // TODO 暂时用system进行测试
  const importPage = pagesComponent[`../views/${name}/index.vue`];
  // if (!importPage) {
  //   throw new Error(`Unknown page ${name}. Is it located under Pages with a .vue extension?`);
  // }

  //@ts-ignore
  return !importPage ? BlankLayoutPage :  importPage.default
  // return importPage.default
}

const findChildrenRoute = (code: string, url: string): ExtraRouteItem[] => {
  if (extraRouteObj[code]) {
    return extraRouteObj[code].children.map((route: ExtraRouteItem) => {
      return {
        url: `${url}/${route.code}`,
        code: route.code,
        name: route.name
      }
    })
  }
  return []
}

export function filterAsnycRouter(asyncRouterMap: any, parentCode = '', level = 1) {
  return asyncRouterMap.map((route: any) => {

    route.path = `${route.url}`
    route.meta = {
      icon: route.icon,
      title: route.name
    }

    // 查看是否有隐藏子路由
    route.children = route.children && route.children.length ? [...route.children, ...findChildrenRoute(route.code, route.url)] : findChildrenRoute(route.code, route.url)

    // TODO 查看是否具有详情页
    // route.children = [...route.children, ]

    if (route.children && route.children.length) {
      route.component = () => level === 1 ? BasicLayoutPage : BlankLayoutPage
      route.children = filterAsnycRouter(route.children, `${parentCode}/${route.code}`, level + 1)
      route.redirect = route.children[0].url
    } else {
      route.component = resolveComponent(route.code);
    }
    console.log(route.code, route)
    return route
  })
}