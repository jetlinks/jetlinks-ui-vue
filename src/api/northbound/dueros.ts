import server from '@/utils/request'

/**
 * 查询数据
 * @param data 分页搜索数据
 * @returns 
 */
export const query = (data: Record<string, any>) => server.post('/dueros/product/_query', data)