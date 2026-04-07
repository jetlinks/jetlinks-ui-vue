import { request } from '@jetlinks-web/core'

/**
 * 登录
 * @param data
 * @returns
 */
export const login = (data: any) => request.post('/authorize/login', data)

/**
 * 退出登录
 */
export const logout = () => request.get('/user-token/reset')

/**
 * 获取验证码
 */
export const codeUrl = () => request.get<{ base64: string, key: string }>(`/authorize/captcha/image?width=130&height=30`)

/**
 * 登录加密信息
 * @returns
 */
export const encryptionConfig = () => request.get(`/authorize/login/configs`)

/**
 * 登录加密信息
 * @returns
 */
export const captchaConfig = () => request.get(`/authorize/captcha/config`)


/**
 * 登录
 * @returns
 */
export const authLogin = (data: any) => request.post(`/authorize/login`, data)

/**
 * 获取当前登录用户信息
 */
export const userDetail = () => request.get<any>('/user/detail')

/**
 * 查询初始化配置信息
 * @returns
 */
export const getInitSet = () => request.get(`/user/settings/init`)

/**
 * 查看后端配置模块
 */
export const queryModal  = (serviceId:string) => request.get(`/command-supports/service/${serviceId}/exists`)

/**
 * 获取支持的SSO的应用
 * @returns
 */
export const bindInfo = () => request.get(`/application/sso/_all`)

export const getOAuth2 = (params: any) => request.get('/oauth2/authorize', params)

export const initApplication = (clientId: string | number) => request.get<{name: string}>(`/application/${clientId}/info`)

