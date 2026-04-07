import { createApp, h } from 'vue'
import { getToken, LocalStore, setToken } from '@jetlinks-web/utils'
import { TOKEN_KEY_URL } from '@jetlinks-web/constants'
import { crateAxios, request, wsClient } from '@jetlinks-web/core'
import { jumpLogin } from '@jetlinks-web-core/router'
import { notification } from 'ant-design-vue'
import { isSubApp, langKey, PersonalToken, PersonalUrlKey } from '@jetlinks-web-core/utils/consts'
import Relogin from '@jetlinks-web-core/views/relogin/index.vue'
import VerifyDialog from '@jetlinks-web-core/views/verify/index.vue'
import pinia from '@jetlinks-web-core/store'
import i18n from '@jetlinks-web-core/locales'
import andtv from 'ant-design-vue'
import { getPackageConfig, registerModule, getBaseApi, routerFallback } from '@jetlinks-web-core/utils'
import microApp from '@micro-zoe/micro-app'
import { moduleRegistry } from '@jetlinks-web-core/utils/module-registry'
import { useVerifyStore } from '@jetlinks-web-core/store/verify'
import type { VerifyRequiredResult } from '@jetlinks-web-core/api/verify'

/** 非一次性校验通过后缓存的 key/token，供请求头使用（避免拦截器内 pinia 未就绪） */
let verifyHeadersCache: { key: string; token: string } | null = null

/** 用于校验成功后重试原请求的 axios 实例（与拦截器使用同一实例） */
let requestInstanceForRetry: any = null

/**
 * 初始化package
 */
export const initPackages = () => {

    /**
     * 初始化websocket
     */
    let token = getToken();
    let tokenKey = TOKEN_KEY_URL

    if (!token) return

    if (PersonalToken.value) {
        token = PersonalToken.value
        tokenKey = PersonalUrlKey
    }

    const protocol = window.location.protocol.replace('http', 'ws');
    const host = document.location.host;
    const filterHost = host.endsWith('/') ? host.substring(0, host.length - 1) : host;
    const url = `${protocol}${filterHost}${getBaseApi()}/messaging/${token}?${tokenKey}=${token}`;
    // wsClient.setOptions({
    //     onError(message) {
    //         notification.error({
    //             key: 'ws-error',
    //             message: message.message,
    //             style: {
    //                 zIndex: 1090
    //             },
    //         });
    //     }
    // })
    wsClient.initWebSocket(url);
    wsClient.connect()
};

const _handleReconnect = async () => {
    const modalWrapper = document.createElement('div')
    const modalApp = createApp(Relogin).mount(modalWrapper)
    document.body.appendChild(modalWrapper)
    return await modalApp?.open?.()
}

/** 当前校验弹窗 Promise，用于互斥：同一时间只允许一个弹窗，取消后不再自动弹出 */
let currentVerifyPromise: Promise<{ key: string; token: string; disposable: boolean } | null> | null = null

function openVerifyDialog(verifyResult: VerifyRequiredResult): Promise<{ key: string; token: string; disposable: boolean } | null> {
    if (currentVerifyPromise) return currentVerifyPromise
    currentVerifyPromise = new Promise((resolve) => {
        const wrapper = document.createElement('div')
        document.body.appendChild(wrapper)
        const app = createApp({
            render() {
                return h(VerifyDialog, {
                    verifyResult,
                    onSuccess: (payload: { key: string; token: string; disposable: boolean }) => {
                        resolve(payload)
                        setTimeout(() => {
                            app.unmount()
                            wrapper.remove()
                            currentVerifyPromise = null
                        }, 0)
                    },
                    onCancel: () => {
                        resolve(null)
                        setTimeout(() => {
                            app.unmount()
                            wrapper.remove()
                            currentVerifyPromise = null
                        }, 0)
                    }
                })
            }
        })
        app.use(pinia).use(i18n).use(andtv)
        app.mount(wrapper)
    })
    return currentVerifyPromise
}
export const initAxios = () => {
    const config = getPackageConfig()

    let settings = {
          langKey: langKey,
          isCreateTokenRefresh: true,
          tokenExpiration: () => {
              const token = getToken();
              if(!token){
                  clearVerifyCache()
                  jumpLogin()
              }
          },
          handleReconnect: _handleReconnect,
          filter_url: [
              '/system/version',
              '/system/config/front',
              '/authorize/captcha/config',
              '/authorize/captcha/image',
              '/application/sso/bind-code',
              '/authorize/login',
              '/application/',
              '/application/sso/_all',
              '/personal/token/',
              '/verify/captcha/_confirm',
              '/verify/identity/',
              '/user/identity/_me',
          ],
          handleError: (description, key, err: any) => {
              const resp = err?.response
              const data = resp?.data
              const isVerifyRequired =
                  resp?.status === 403 &&
                  (data?.code === 'verify.required' || data?.message === 'error.verify.requred')
              if (isVerifyRequired) {
                  return handleVerifyAndRetry(err)
              }
              // 取消验证时不显示错误提示（检查多个可能的错误来源）
              const errorMessage = err?.message || data?.message || description || ''
              const errorCode = err?.code || data?.code || ''
              if (
                  errorMessage === 'verify_canceled' || 
                  errorMessage?.includes('verify_canceled') ||
                  errorCode === 'verify_canceled' ||
                  errorCode?.includes('verify_canceled') ||
                  String(description)?.includes('verify_canceled')
              ) {
                  return
              }
              if (!err.config?.hiddenError) {
                  notification.error({
                      style: { zIndex: 1040 },
                      key: key as string,
                      message: '',
                      description
                  })
              }
          },
        requestOptions(config: any) {

            let cache = verifyHeadersCache
            if (!cache) {
                try {
                    const raw = localStorage.getItem('jetlinks_verify_cache')
                    if (raw) cache = JSON.parse(raw) as { key: string; token: string }
                } catch {
                    // ignore
                }
            }

            const tenantDomain = location.pathname?.split('/')[1] || localStorage.getItem('X-Tenant-Domain')
            if (tenantDomain && !!import.meta.VITE_APP_ENVIRONMENT) {
                config.headers = config.headers || {}
                config.headers['X-Tenant-Domain'] = tenantDomain
            }
            
            if (cache?.key && cache?.token) {
                config.headers = config.headers || {}
                config.headers['x-verify-key'] = cache.key
                config.headers['x-verify-token'] = cache.token
            }
            return config
        }
      }

      if (isSubApp) { // 获取基座传过来的
          const parentData = (window as any).microApp.getGlobalData()

          if (parentData.axiosSettings) {
              settings = {
                  ...settings,
                  ...parentData.axiosSettings
              }
          }
      }

      if (Object.keys(config?.axiosSettings || {}).length) {
          settings = {
              ...settings,
              ...config.axiosSettings
          }
      }
    crateAxios(settings)
}

function is403VerifyRequired(err: any): VerifyRequiredResult {
    const resp = err?.response
    const data = resp?.data
    return {
        type: data.result.type,
        key: data.result.key,
        disposable: !!data.result.disposable
    }
}

function handleVerifyAndRetry(err: any): Promise<any> {
    const verifyResult = is403VerifyRequired(err)
    const failedConfig = err?.config ?? err?.response?.config
    const doRetry = (ax: any, retryConfig: any): Promise<any> => {
        if (typeof ax === 'function') return Promise.resolve(ax(retryConfig))
        if (ax && typeof ax.request === 'function') return Promise.resolve(ax.request(retryConfig))
        if (ax && typeof ax === 'object' && typeof (ax as any).default?.request === 'function') return Promise.resolve((ax as any).default.request(retryConfig))
        const method = (retryConfig.method || 'get').toLowerCase()
        const url = retryConfig.url || retryConfig.baseURL
        if (ax && url && typeof ax[method] === 'function') {
            const args = method === 'get' ? [url, retryConfig] : [url, retryConfig.data ?? retryConfig.params, retryConfig]
            return Promise.resolve(ax[method](...args))
        }
        return Promise.reject(new Error('no request instance'))
    }
    const tryRetry = (retryConfig: any): Promise<any> => {
        const instance = requestInstanceForRetry ?? request
        if (instance) return Promise.resolve(instance).then((ax) => doRetry(ax, retryConfig))
        return import('@jetlinks-web/core').then((m) => doRetry(m.request, retryConfig))
    }
    return openVerifyDialog(verifyResult).then((payload) => {
        if (!payload) return Promise.reject(new Error('verify_canceled'))
        if (!failedConfig) return Promise.reject(err)
        if (!payload.disposable) {
            const verifyStore = useVerifyStore()
            verifyStore.setCache(payload.key, payload.token)
            verifyHeadersCache = { key: payload.key, token: payload.token }
        }
        const headers = { ...(failedConfig.headers || {}), 'x-verify-key': payload.key, 'x-verify-token': payload.token }
        const retryConfig = { ...failedConfig, headers }
        return tryRetry(retryConfig)
    })
}

/** 登出/跳转登录前清理校验缓存，避免下一用户复用上一用户的 verify key/token */
export function clearVerifyCache() {
    verifyHeadersCache = null
    try {
        useVerifyStore().clearCache()
    } catch {
        // ignore (store 可能未就绪)
    }
}

export const loadMicroApp = () => {
    (window as any).microApp?.addDataListener((data: any) => {

        if (data.token) {
            setToken(data.token)
        }

        if (data.appId) {
            LocalStore.set('appId', data.appId)
        }
    }, true)

    if (!isSubApp) { // 不是子应用
        microApp.setGlobalData({
            api: {
                moduleRegistry,
                onTabSaveSuccess: (id: string, url: string, options?: Record<string, any>) => {
                    const tabInstance = window.open(url) as WindowProxy
                    (tabInstance as any).onTabSaveSuccess = (_sourceId: string, value: any) => {
                        if (_sourceId === id) {
                            options?.onSuccess?.(value)
                        }
                    }
                },
                onTabSaveSuccessBack: (id: string,data?: any) => {
                    (window as any).onTabSaveSuccess(id, data)
                    setTimeout(() => window.close(), 300)
                },
                routerFallback: routerFallback
            }
        })
    }
}

// 支持多模块注册
registerModule()
