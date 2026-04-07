import { request } from '@jetlinks-web/core'

// 查询特定天数流量数据
export const queryFlow = (beginTime: any, endTime: any, data: any) => request.post(`/network/flow/_query/${beginTime}/${endTime}`, data)

export const list = (data: any) => request.post(`/network/card/_query`, data)

// 判断物联卡流量时序数据库是否开启
export const getIsTimer = () => request.get(`/network/flow/timeseries/enabled`)
