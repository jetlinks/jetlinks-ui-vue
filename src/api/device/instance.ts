import { request } from '@jetlinks-web/core'

/**
 * 查询数据
 * @param data 分页搜索数据
 * @returns
 */
export const query = (data?: Record<string, any>) => request.post('/device-instance/_query', data)
