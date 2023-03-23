import axios from 'axios'
import {BASE_API_PATH, TOKEN_KEY} from '@/utils/variable'
import { notification as Notification  } from 'ant-design-vue'
import router from '@/router'
import { LoginPath } from '@/router/menu'
import {LocalStore} from "@/utils/comm";
import type { AxiosInstance, AxiosResponse } from 'axios'

interface AxiosResponseRewrite<T = any[]> extends AxiosResponse<T, any> {
    result: T
    success: boolean
}

export const SUCCESS_CODE = 200 // 成功代码

export const request = axios.create({
    withCredentials: false,
    baseURL: BASE_API_PATH,
    timeout: 1000 * 60 * 5
})

/**
 * POST method request
 * @param {String} url
 * @param {Object} [data]
 * @param {String} responseType 如果接口是需要导出文件流，那么responseType = 'blob'
 * @param {Object|String} [ext] 扩展参数，如果是配置headers，ext对象内包含headers对象，如下
 * {
        headers: {'Content-Type': 'text/plain;charset=UTF-8'},
    }
 * @returns {AxiosInstance}
 */
export const post = function<T>(url: string, data = {}, params = {}, ext={}) {
    ext = typeof ext === 'string' ? { responseType: ext } : ext
    return request<any, AxiosResponseRewrite<T>>({
        ...ext,
        params,
        method: 'POST',
        url,
        data
    })
}

/**
 * put method request
 * @param {String} url
 * @param {Object} [data]
 * @returns {AxiosInstance}
 */
export const put = function<T>(url: string, data = {},) {
    return request<any, AxiosResponseRewrite<T>>({
        method: 'PUT',
        url,
        data
    })
}

/**
 * patch method request
 * @param {String} url
 * @param {Object} [data]
 * @returns {AxiosInstance}
 */
export const patch = function<T>(url: string, data = {}) {
    return request<any, AxiosResponseRewrite<T>>({
        method: 'PATCH',
        url,
        data
    })
}
/**
 * GET method request
 * @param {String} url
 * @param {Object} [params]
 * @param {Object} [ext] 扩展参数
 * @returns {AxiosInstance}
 */
export const get = function<T>(url: string, params = {},  ext?: any) {
    return request<any, AxiosResponseRewrite<T>>({
        method: 'GET',
        url,
        params,
        ...ext
    })
}

/**
 * DELETE method request
 * @param {String} url
 * @param {Object} [params]
 * @param {Object} [ext] 扩展参数
 * @returns {AxiosInstance}
 */
export const remove = function<T>(url: string, params = {}, ext?: any) {
    return request<any, AxiosResponseRewrite<T>>({
        method: 'DELETE',
        url,
        params,
        ...ext
    })
}

/**
 * 获取文件流
 * @param {String} url
 * @param {Object} [params]
 * @return {*}
 */
export const getStream = function(url: string, params = {}) {
    return get<any>(url, params, {
        responseType: 'arraybuffer' // 设置请求数据类型，返回blob可解析类型
    })
}

export const postStream = function(url: string, data={}, params = {}) {
    return post<any>(url, data, params, {
        responseType: 'arraybuffer' // 设置请求数据类型，返回blob可解析类型
    })
}

/**
 * 异常拦截处理器
 * @param {Object} error
 * @returns {Promise<never>}
 */
const errorHandler = (error: any) => {
    if (error.response) {
        const data = error.response.data
        const status = error.response.status
        if (status === 403) {
            Notification.error({
                key: '403',
                message: 'Forbidden',
                description: (data.message + '').substr(0, 90)
            })

            setTimeout(() => {
                router.push({
                    name: 'Exception403'
                })
            }, 0)
        } else if (status === 500) {
            Notification.error({
                key: '500',
                message: 'Server Side Error',
                description: (data.message + '').substr(0, 90)
            })
        } else if (status === 400) {
            Notification.error({
                key: '400',
                message: 'Request Error',
                description: (data.message + '').substr(0, 90)
            })
        } else if (status === 401) {
            Notification.error({
                key: '401',
                message: 'Unauthorized',
                description: '用户未登录'
            })
            setTimeout(() => {
                debugger
                router.push({
                    path: LoginPath
                })
            }, 0)
        }
    } else if (error.response === undefined) {
        Notification.error({
            message: error.message,
            description: (error.stack + '').substr(0, 90)
        })
    }
    return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
    // 如果 token 存在
    // 让每个请求携带自定义 token 请根据实际情况自行修改
    const token = LocalStore.get(TOKEN_KEY)
    // const token = store.$state.tokenAlias
    if (!token) {
        setTimeout(() => {
            router.replace({
                path: LoginPath
            })
        }, 0)
        return config
    }

    config.headers![TOKEN_KEY] = token

    return config
}, errorHandler)

/**
 * response interceptor
 */
request.interceptors.response.use(response => {
    if (response.data instanceof ArrayBuffer) {
        return response
    } else {
        const { status, message } = response.data
        // 增加业务接口处理成功判断方式，只需要判断返回参数包含：success为true
        if (typeof response.data === 'object' && typeof response.data.success === 'undefined') {
            response.data.success = status === SUCCESS_CODE
        }

        // 统一显示异常业务信息
        if (status !== SUCCESS_CODE && message) {
            Notification.error({
                message: 'Server Errors: ' + status,
                description: message
            })
        }
        // 如果返回的的是文件流，那么return值则为response
        if (response.headers['content-type'] === 'application/octet-stream; charset=UTF-8' || response.headers['content-type'] === 'application/vnd.ms-excel;charset=UTF-8') {
            return response.data
        } else {
            return response.data
        }
    }
}, errorHandler)

export default {
    request: axios,
    post,
    get,
    patch,
    put,
    remove,
    getStream,
    postStream
}