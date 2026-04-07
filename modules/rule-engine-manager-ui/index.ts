import i18n from "@jetlinks-web-core/locales";
import registerSetting from './register'
import { name } from './package.json'
import { moduleRegistry } from '@jetlinks-web-core/utils/module-registry'

const routerModules = import.meta.glob('./views/**/index.vue')
const getAsyncRoutesMap = () => {
    const modules = {}
    Object.keys(routerModules).forEach(item => {
        const code = item.replace('./views/', '').replace('/index.vue', '')
        const key = `rule-engine/${code}`
        modules[key] = routerModules[item]
    })

    return modules
}

const getExtraRoutesMap = () => {
    return {
        'rule-engine/Scene': {
            children: [
                {
                    code: 'Save',
                    url: '/Save',
                    name: i18n.global.t('rule-engine-manager-ui.index.102627-0'),
                    component: () => import('./views/Scene/Save/index.vue')
                }
            ]
        },
        'rule-engine/Alarm/Configuration': {
            children: [
                {
                    code: 'Save',
                    url: '/Save',
                    name: i18n.global.t('rule-engine-manager-ui.index.102627-1'),
                    component: () => import('./views/Alarm/Configuration/Save/index.vue')
                }
            ]
        },
        'rule-engine/Alarm/Log': {
            children: [
                {
                    code: 'Record',
                    url: '/Record',
                    name: i18n.global.t('rule-engine-manager-ui.index.102627-2'),
                    component: () => import('./views/Alarm/Log/Record/index.vue')
                },
                {
                    code: 'Detail',
                    url: '/Detail/:id',
                    name: i18n.global.t('rule-engine-manager-ui.index.102627-1'),
                    component: () => import('./views/Alarm/Log/Detail/index.vue')
                }
            ]
        },
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
