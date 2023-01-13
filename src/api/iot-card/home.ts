import server from '@/utils/request'

// 查询特定天数流量数据
export const queryFlow = (beginTime: any, endTime: any, data: any) => server.post(`/network/flow/_query/${beginTime}/${endTime}`, data)

export const list = (data: any) => server.post(`/network/card/_query`, data)