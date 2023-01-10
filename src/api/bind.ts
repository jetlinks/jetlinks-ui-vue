import { get } from '@/utils/request'

// 三方应用账户信息
export const applicationInfo = (code: string) => get(`/application/sso/bind-code/${code}`)