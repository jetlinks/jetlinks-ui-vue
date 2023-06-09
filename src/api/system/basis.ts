import server from '@/utils/request';

// 保存
export const save_api = (data: any) => server.post(`/system/config/scope/_save`, data)
// 获取详情
export const getDetails_api = (data: any) => server.post<any>(`/system/config/scopes`, data)

export const settingDetail = (scopes: string) => server.get<any>(`/system/config/${scopes}`)
