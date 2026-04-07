import i18n from "@jetlinks-web-core/locales";
import registerSetting from './register'
import { name } from './package.json'
import { moduleRegistry } from '@jetlinks-web-core/utils/module-registry'

const routerModules = import.meta.glob('./views/**/index.vue')
const getAsyncRoutesMap = () => {
    const modules = {}
    Object.keys(routerModules).forEach(item => {
        const code = item.replace('./views/', '').replace('/index.vue', '')
        const key = `notice/${code}`
        modules[key] = routerModules[item]
    })

    return modules
}

const getExtraRoutesMap = () => {
    return {
        'notice/Config': {
            children: [
                {
                    code: 'Detail',
                    url: '/Detail/:id',
                    name: i18n.global.t('notify-manager-ui.index.301452-0'),
                    component: () => import('./views/Config/Detail/index.vue')
                }
            ]
        },
        'notice/Template': {
            children: [
                {
                    code: 'Detail',
                    url: '/Detail/:id',
                    name: i18n.global.t('notify-manager-ui.index.301452-0'),
                    component: () => import('./views/Template/Detail/index.vue')
                }
            ]
        }
    }
}

const register = () => {
    moduleRegistry.register(name, registerSetting)
}

export default {
    getAsyncRoutesMap,
    getExtraRoutesMap,
    register,
    priority: -100
}
