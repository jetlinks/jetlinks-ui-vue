import axios from 'axios'
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable'
import { notification as Notification } from 'jetlinks-ui-components'
import router from '@/router'
import { LoginPath } from '@/router/menu'
import { cleanToken, getToken, LocalStore } from '@/utils/comm'
import type { AxiosInstance, AxiosResponse } from 'axios'

interface AxiosResponseRewrite<T = any[]> extends AxiosResponse<T, any> {
  result: T
  success: boolean
}

export const SUCCESS_CODE = 200 // 成功代码

const filterApiUrl = ['/system/version', '/system/config/front', '/authorize/captcha/config', '/application/sso/_all', '/authorize/captcha/image', '/application/sso/bind-code', '/authorize/login']

export const request = axios.create({
  withCredentials: false,
  baseURL: BASE_API_PATH,
  timeout: 1000 * 15
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
export const post = function <T>(url: string, data = {}, params = {}, ext = {}) {
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
export const put = function <T>(url: string, data = {}) {
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
export const patch = function <T>(url: string, data = {}) {
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
export const get = function <T>(url: string, params = {}, ext?: any) {
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
export const remove = function <T>(url: string, params = {}, ext?: any) {
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

export const postStream = function(url: string, data = {}, params = {}) {
  return post<any>(url, data, params, {
    responseType: 'arraybuffer' // 设置请求数据类型，返回blob可解析类型
  })
}

const showNotification = (message: string, description: string, key?: string, show: boolean = true) => {
  if (show) {
    Notification.error({
      key,
      message: '',
      description
    })
  }
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
      showNotification('Forbidden', (data.message + '').substr(0, 90), '403')
    } else if (status === 500) {
      showNotification('Server Side Error', (data.message + '').substr(0, 90), '500')
    } else if (status === 400) {
      showNotification('Request Error', (data.message + '').substr(0, 90), '400')
    } else if (status === 401) {
      showNotification('Unauthorized', '用户未登录', '401')
      setTimeout(() => {
        cleanToken()
        router.replace({
          path: LoginPath
        })
      }, 0)
    } else if (status === 404) {
      showNotification(error?.code, error?.response?.data?.message, '404')
    }
  } else if (error.response === undefined) {
    showNotification(error.message, (error.stack + '').substr(0, 90), undefined)
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  const token = getToken()
  const isFilterUrl = filterApiUrl.some(url => config.url.includes(url))
  if (!token && !isFilterUrl) {
    setTimeout(() => {
      cleanToken()
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

    // 如果返回的的是文件流，那么return值则为response
    if (response.headers['content-type'] === 'application/octet-stream; charset=UTF-8' || response.headers['content-type'] === 'application/vnd.ms-excel;charset=UTF-8') {
      return response.data
    } else {
      return response.data
    }
  }
}, errorHandler)

export default {
  request,
  post,
  get,
  patch,
  put,
  remove,
  getStream,
  postStream
}