import server from '@/utils/request'

/**
 * 访问边端设备列表
 * @param thingId 边缘网关ID
 * @param internalId 连接id
 * @param data
 */
export const _queryByEdge = (thingId: string,internalId:string,data:any) => server.post(`/edge/device/${thingId}/_/edge/master/bind/${internalId}/_query/no-paging?paging=false`,data)

/**
 * 创建任务
 * @param data
 */
export const createTask = (data: any) => server.post('/edge/agent-job/_create', data)

/**
 * 分页查询任务详情列表
 * @param data
 */
export const queryTask = (data: any) => server.post('/batch/operation/task/detail/_pager', data)

/**
 * 任务详情中涉及网关
 * @param data
 */
export const queryDetailGateway = (data: any) => server.post('/device-instance/_query', data)

/**
 * 分页查询网关操作详情
 * @param data
 */
export const queryDetailPlugin = (data: any) => server.post('/batch/device/operation/detail/_query', data)

/**
 * 分页查询批量操作任务详情记录
 * @param data
 */
export const queryDetailHistory = (data: any) => server.post('/batch/operation/history/_query', data)

/**
 * 开始任务
 * @param type
 * @param id
 */
export const startTask = (type: string, id:string) => server.post(`/batch/operation/task/${type}/${id}/_start`)

/**
 *
 * @param type
 * @param id
 */
export const stopTask = (type: string, id:string) => server.post(`/batch/operation/task/${type}/${id}/_stop`)
