import { get, post } from '@/utils/request'

// 三方应用账户信息
export const applicationInfo = (code: string): any => get(`/application/sso/bind-code/${code}`)
// 立即绑定
export const bindAccount = (code: string): any => post(`/application/sso/me/bind/${code}`)