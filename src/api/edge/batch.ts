import server from '@/utils/request'

/**
 * 访问边端设备列表
 * @param thingId 边缘网关ID
 * @param internalId 连接id
 * @param data 
 */
export const _queryByEdge = (thingId: string,internalId:string,data:any) => server.post(`edge/device/${thingId}/_/edge/master/bind/${internalId}/_query/no-paging?paging=false`,data)