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
    'system/Role': [{ // 角色管理
      code: 'Detail',
      url: '/Detail/:id',
      name: i18n.global.t('router.extraMenu.260658-0')
    }],
    'system/Menu': [
      {
        code: 'Setting',
        url: '/Setting',
        name: i18n.global.t('router.extraMenu.260658-1')
      },
      {
        code: 'Detail',
        url: '/Detail/:id',
        name: i18n.global.t('router.extraMenu.260658-2')
      },
    ],
    'system/Apply': [
      {
        code: 'Save',
        url: '/Save',
        name: i18n.global.t('router.extraMenu.260658-3')
      },
      {
        code: 'View',
        url: '/View',
        name: i18n.global.t('Apply.index.483342-20')
      },
      {
        code: 'Api',
        url: '/Api',
        name: i18n.global.t('Apply.index.483342-19')
      },
    ],
    'system/Positions': [
      {
        code: 'Detail',
        url: '/Detail/:id',
        name: i18n.global.t('router.extraMenu.260658-3')
      }
    ],
    'system/Department': [
      {
        code: 'positions/Detail',
        url: '/positions/Detail/:id',
        name: '职位详情'
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
  register,
  priority: -100
}
