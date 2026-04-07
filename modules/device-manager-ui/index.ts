import { defineAsyncComponent } from 'vue';
import i18n from "@jetlinks-web-core/locales";
import { moduleRegistry } from '@jetlinks-web-core/utils/module-registry';
import registerSetting from './register'

const routerModules = import.meta.glob('./views/**/index.vue')

const getAsyncRoutesMap = () => {
    const modules = {}
    Object.keys(routerModules).forEach(item => {
        const code = item.replace('./views/', '').replace('/index.vue', '')
        const key = `${code}`
        // const key = `${MODULE_CODE}/${code}` // views下不存在多模块时
        modules[key] = routerModules[item]
    })

    return modules
}

const getExtraRoutesMap = () => {
    return {
        'device/Product': {
            children: [
                {
                    code: 'Detail',
                    url: '/detail/:id',
                    name: i18n.global.t('device-manager-ui.index.106686-0'),
                    component: () => import('./views/device/Product/Detail/index.vue')
                },
                {
                    code: 'QuickCreate',
                    url: '/QuickCreate',
                    name: i18n.global.t('device-manager-ui.index.106686-1'),
                    component: () => import('./views/resource/QuickCreate/index.vue')
                }
            ]
        },
        'device/Instance': {
            children: [
                {
                    code: 'Detail',
                    url: '/detail/:id',
                    name: i18n.global.t('device-manager-ui.index.106686-0'),
                    component: () => import('./views/device/Instance/Detail/index.vue')
                }
            ]
        },
        'link/AccessConfig': {
            children: [
                {
                    code: 'Detail',
                    url: '/detail/:id',
                    name: i18n.global.t('device-manager-ui.index.106686-0'),
                    component: () => import('./views/link/AccessConfig/Detail/index.vue')
                }
            ]
        },
        'link/Certificate': {
            children: [
                {
                    code: 'Detail',
                    url: '/detail/:id',
                    name: i18n.global.t('device-manager-ui.index.106686-0'),
                    component: () => import('./views/link/Certificate/Detail/index.vue')
                }
            ]
        },
        'link/Type': {
            children: [
                {
                    code: 'Detail',
                    url: '/detail/:id',
                    name: i18n.global.t('device-manager-ui.index.106686-0'),
                    component: () => import('./views/link/Type/Detail/index.vue')
                }
            ]
        },
        'resource/Resource': {
            children: [
                {
                    code: 'Detail',
                    url: '/detail/:id',
                    name: i18n.global.t('device-manager-ui.index.106686-0'),
                    component: () => import('./views/resource/Resource/Detail/index.vue')
                }
            ]
        }
    }
}

const getComponents = () => {
    return {
    }
}

const register = () => {
    console.log(registerSetting)
    moduleRegistry.register('device-manager-ui', registerSetting)
}


export default {
    getAsyncRoutesMap,
    getExtraRoutesMap,
    getComponents,
    register,
    priority: -100
}
