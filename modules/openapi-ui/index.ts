import i18n from "@jetlinks-web-core/locales";

const routerModules = import.meta.glob('./views/**/index.vue')
import { getModuleRoutesMap } from '@jetlinks-web/utils'
import { moduleRegistry } from '@jetlinks-web-core/utils/module-registry'
import registerSetting from './register'
import { name } from './package.json'

/**
 * 额外子路由是独立于菜单管理之外的页面，比如详情，新增表单页；它们需要挂载在指定路由下。
 * @return
 * {
 *  'device/Product': {
 *    children: [
 *      {
 *          code: 'Detail',
 *          url: '/detail/:id',
 *          name: i18n.global.t('device-manager-ui.index.106686-0'),
 *          component: () => import('./views/device/Product/Detail/index.vue')
 *      }
 *    ]
 *  }
 * }
 */
const getExtraRoutesMap = () => {
  return {
    'system/api-group': [
      {
        code: 'Detail',
        url: '/Detail/:id',
        name: i18n.global.t('ApiGroup.router.123456-0'),
        component: () => import('./views/system/api-group/Detail/index.vue')
      }
    ],
    'system/api-manage': [
      {
        code: 'Detail',
        url: '/detail/:id',
        name: 'API接口详情',
        component: () => import('./views/system/api-manage/detail.vue')
      }
    ],
    'system/application': [
      {
        code: 'Save',
        url: '/Save',
        name: '应用保存',
        component: () => import('./views/system/application/Save/index.vue')
      },
      {
        code: 'Detail',
        url: '/Detail/:id',
        name: '应用详情',
        component: () => import('./views/system/application/Detail/index.vue')
      },
      {
        code: 'Grant',
        url: '/Grant/:id',
        name: '应用赋权',
        component: () => import('./views/system/application/Grant/index.vue')
      }
    ]
  }
}

const getComponents = () => ({})

const register = () => {
  moduleRegistry.register(name, registerSetting)
}

export default {
  getAsyncRoutesMap: () => getModuleRoutesMap(routerModules),
  getExtraRoutesMap,
  getComponents,
  register
}
