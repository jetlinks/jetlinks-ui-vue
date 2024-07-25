import { BASE_API_PATH } from "@/utils/variable";
import server from '@/utils/request'
import { SearchHistoryList } from 'components/Search/types'

export const FILE_UPLOAD = `${BASE_API_PATH}/file/static`;

export const FileUpload = `${BASE_API_PATH}/file/upload`;

/**
 * 保存查询记录
 * @param data
 * @param target
 */
export const saveSearchHistory = (data: any, target:string) => server.post(`/user/settings/${target}`, data)

/**
 * 获取查询记录
 * @param target
 */
export const getSearchHistory = (target:string) => server.get<SearchHistoryList[]>(`/user/settings/${target}`)

/**
 * 删除指定查询记录
 * @param id
 * @param target
 */
export const deleteSearchHistory = (target:string, id:string) => server.remove<SearchHistoryList[]>(`/user/settings/${target}/${id}`)

/**
 * 获取当前系统版本
 */
export const systemVersion = () => server.get<{edition?: string}>('/system/version')

/**
 * 聚合查询
 * @param data
 * @returns
 */
export const queryDashboard = (data: Record<string, any>) => server.post(`/dashboard/_multi`, data)

export const fileUpload = (data: any) => server.post('/file/static', data)

export const lowCodeUrl = () => server.get('/system/config/low-code')
