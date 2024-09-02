import { TOKEN_KEY, BASE_API } from '@jetlinks-web/constants'
import { getToken } from '@jetlinks-web/utils'
import axios from 'axios'
import type {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios'
import { notification as Notification } from 'ant-design-vue'
import type { AxiosResponseRewrite } from '@jetlinks-web/types'
import { jumpLogin } from '@/router'

const SUCCESS_CODE = 200 // 成功代码
const filterUrl: string[] = []

const instance: AxiosInstance = axios.create({
    withCredentials: false,
    timeout: 1000 * 15,
    baseURL: BASE_API
})


const showNotification = (description: string, key?: string | number, show: boolean = true) => {
    if (show) {
        Notification.error({
            key,
            description,
            message: '',
        })
    }
}

const requestFn = (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    // 没有token，并且该接口需要token校验
    if (!token && !filterUrl?.some((url) => config.url?.includes(url))) {
        // 跳转登录页
        jumpLogin()
        return config
    }

    config.headers[TOKEN_KEY] = token

    return config
}

const responseFn = (response: AxiosResponse) => {

    if (response.data instanceof ArrayBuffer) {
        return response
    }

    const {status} = response.data

    // 增加业务接口处理成功判断方式，只需要判断返回参数包含：success为true
    if (
        typeof response.data === 'object' &&
        typeof response.data.success === 'undefined'
    ) {
        response.data.success = status === SUCCESS_CODE
    }

    return response.data
}

const errorHandler = (err: AxiosError<any>) => {
    if (err.response) {
        const {data, status} = err.response
        switch (status) {
            case 400:
            case 403:
            case 500:
                const description = (`${data?.message}`).substring(0, 90)
                showNotification(description, status)
                break;
            case 401:
                showNotification('用户未登录', status)
                jumpLogin()
                break;
            default:
                break;
        }
    } else if (err.response === undefined) {
        const description = err.message.includes('timeout') ? '接口响应超时' : err.message
        showNotification(description)
    }

    return Promise.reject(err)
}

instance.interceptors.request.use(
    requestFn,
    errorHandler
)

instance.interceptors.response.use(
    responseFn,
    errorHandler
)

export const request = {
    post<T = any>(url: string, data: any = undefined, ext?: any) {
        return (instance<any, AxiosResponseRewrite<T>>({
            method: 'POST',
            url,
            data,
            ...ext,
        }))
    },
    postParams<T = any>(url: string, data: any = undefined, params = {}, ext?: any) {
        return instance<any, AxiosResponseRewrite<T>>({
            method: 'POST',
            url,
            data,
            params,
            ...ext,
        })
    },
    get<T = any>(url: string, params: any = undefined, ext?: any) {
        return instance<any, AxiosResponseRewrite<T>>({
            method: 'GET',
            url,
            params,
            ...ext,
        })
    },
    put<T = any>(url: string, data: any = undefined, ext?: any) {
        return instance<any, AxiosResponseRewrite<T>>({
            method: 'PUT',
            url,
            data,
            ...ext,
        })
    },
    patch<T = any>(url: string, data: any = undefined, ext?: any) {
        return instance<any, AxiosResponseRewrite<T>>({
            method: 'patch',
            url,
            data,
            ...ext,
        })
    },
    remove<T = any>(url: string, params: any = undefined, data?: any, ext?: any) {
        return instance<any, AxiosResponseRewrite<T>>({
            method: 'DELETE',
            url,
            params,
            data,
            ...ext,
        })
    },
    getStream(url: string, params?: any) {
        return this.get(url, params, {responseType: 'arraybuffer'})
    },
    postStream(url: string, data: any, params: any) {
        return this.postParams(url, data, params, {responseType: 'arraybuffer'})
    }
}
