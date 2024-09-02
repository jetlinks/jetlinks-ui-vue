import { request } from '@jetlinks-web/core'

// 三方应用账户信息
export const applicationInfo = (code: string): any => request.get(`/application/sso/bind-code/${code}`)
// 立即绑定
export const bindAccount = (code: string): any => request.post(`/application/sso/me/bind/${code}`)
