import {request} from '@jetlinks-web/core'

// 获取卡定位
export const getPositionById = (cardId: string) => request.get(`/network/card/${cardId}/_location`)
// 批量获取卡定位
export const queryBatchPosition = (data: any) => request.post(`/network/card/_location/batch`, data)

// 获取卡定位记录
export const queryPositionRecord = (data: any) => request.post(`/network/card/location/record/_query`, data)

export const queryLocationById = (cardId: string)=> request.get(`/network/card/location/record/${cardId}/_query`);
