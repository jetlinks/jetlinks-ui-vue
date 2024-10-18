import server from '@/utils/request';

/**
 * 分页查询资源
 */
export const queryPage = (data: any) => server.post('/entity/template/_query', data)

/**
 * 保存资源
 */
export const save = (data: any) => server.patch('/entity/template', data);

/**
 * 删除资源
 * @params id 模型id
 */
export const remove = (id: string) => server.remove(`/entity/template/${id}`);

/**
 * 更新资源
 * @params id 模型id
 * @params data 模型实体
 */
export const update = (id: string, data: any) => server.put(`/entity/template/${id}`, data);

/**
 * 资源详情
 * @params id 模型id
 */
export const detail = (id: string) => server.get(`/entity/template/${id}`);
/**
 * 创建下发任务
 */
export const createTask = (data: any) => server.post('/batch/operation/task', data)

/**
 * 下发任务详情列表
 */
export const queryTaskDetailPage = (data: any) => server.post('/batch/operation/task/detail/_pager', data)

/**
 * 下发任务详情记录
 */
export const queryIssueDetail = (data: any) => server.post('/batch/operation/history/_query', data)

/**
 * 暂停全部任务
 * @param type 任务类型(resourceIssue-资源下发，remoteUpgrade-远程升级，bindDevice-绑定子设备)
 * @param id 任务ID
 */
export const pauseAll = (type: string, id: string) => server.post(`/batch/operation/task/${type}/${id}/_stop`)

/**
 * 开始任务/重试任务
 * @param type 任务类型(resourceIssue-资源下发，remoteUpgrade-远程升级，bindDevice-绑定子设备)
 * @param id 任务ID
 * @param data 状态
 */
export const startTask = (type: string, id: string, data: string[]) => server.post(`/batch/operation/task/${type}/${id}/_start`, data)