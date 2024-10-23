import server from '@/utils/request'

/**
 * 访问边端设备列表
 * @param thingId 边缘网关ID
 * @param internalId 连接id
 * @param data
 */
export const _queryByEdge = (thingId: string,data:any) => server.post(`/edge/device/${thingId}/_/edge/command/QueryBindInfoList/_execute`,data)

/**
 * 绑定子设备命令
 * @param thingId 边缘网关ID
 * @param commandId 命令ID{BindMasterDevice:绑定单个,BatchBindDevice:批量绑定,UnbindDevice:解绑}
 * @param data
 */
export const _commandByEdge = (thingId: string,commandId:string,data:any) => server.post(`/edge/device/${thingId}/_/edge/command/${commandId}/_execute`,data)

/**
 * 创建任务
 * @param data
 */
export const createTask = (data: any) => server.post('/edge/agent-job/_create', data)

/**
 * 查询任务信息

 * @param data
 */
export const queryTask = (data: any) => server.post('/edge/agent-job/detail/_query', data)

/**
 * 查询任务详情列表
 * @param data
 */
export const queryTaskdDtail = (data: any) => server.post('/edge/agent-job/tasks/detail/_query', data)

/**
 * 全部开始
 * @param data
 * @param id
 */
export const startAllTask = (id:string,data: any) => server.post(`/edge/agent-job/${id}/_deploy`, data)
/**
 * 全部停止
 * @param data
 * @param id
 */
export const stopAllTask = (id:string,data: any) => server.post(`/edge/agent-job/${id}/_stop`, data)
/**
 * 全部删除
 * @param data
 * @param id
 */
export const deleteAllTask = (id:string) => server.remove(`/edge/agent-job/${id}`)

/**
 * 停止一项
 * @param data
 * @param id
 */
export const stopOneTask = (id:string,data: any) => server.post(`/edge/agent-job/tasks/${id}/_stop`, data)
/**
 * 开始一项
 * @param data
 * @param id
 */
export const startOneTask = (id:string,data: any) => server.post(`/edge/agent-job/tasks/${id}/_deploy`, data)
/**
 * 删除一项
 * @param data
 * @param id
 */
export const deleteOneTask = (id:string,data: any) => server.remove(`/edge/agent-job/tasks/${id}/_delete`)

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
