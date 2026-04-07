import { request } from '@jetlinks-web/core'

// 保存
export const save_api = (data: any) => request.post(`/system/config/scope/_save`, data)
// 获取详情
export const getDetails_api = (data: any) => request.post<any>(`/system/config/scopes`, data)

/**
 * 系统版本
 */
export const systemVersion = () => request.get('/system/version')

/**
 * 系统配置信息
 * @param scopes
 */
export const settingDetail = (scopes: string) => request.get(`/system/config/${scopes}`)

