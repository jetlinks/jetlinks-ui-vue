import server from '@/utils/request'

/**
 * 获取验证码配置
 * @returns 
 */
export const config = () => server.get(`/authorize/captcha/config`)

/**
 * 获取验证码图片
 * @returns 
 */
export const code = () => server.get(`/authorize/captcha/image?width=130&height=30`)

/**
 * 登录
 * @returns 
 */
export const authLogin = (data: any) => server.post(`/authorize/login`, data)

/**
 * 查询初始化配置信息
 * @returns 
 */
export const getInitSet = () => server.get(`/user/settings/init`)

/**
 * 创建初始化配置信息
 * @returns 
 */
export const postInitSet = (data: any) => server.post(`/user/settings/init`, data)

/**
 * 查询系统版本信息
 * @returns 
 */
export const systemVersion = () => server.get(`/system/version`)

/**
 * 获取支持的SSO的应用
 * @returns 
 */
export const bindInfo = () => server.get(`/application/sso/_all`)

/**
 * 查询配置信息
 * @returns 
 */
export const settingDetail = (scopes: string) => server.get(`/system/config/${scopes}`)