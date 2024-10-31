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
export const createTask = (data: any) => server.post('/edge/agent-job/_create', data)

/**
 * 下发任务详情列表
 */
export const queryTaskDetailPage = (data: any) => server.post('/edge/agent-job/detail/_query', data)

/**
 * 下发任务详情记录
 */
export const queryIssueDetail = (data: any) => server.post('/edge/agent-job/tasks/detail/_query', data)

/**
 * 暂停全部任务
 * @param type 任务类型(resourceIssue-资源下发，remoteUpgrade-远程升级，bindDevice-绑定子设备)
 * @param id 任务ID
 */
export const pauseAll = (id: string) => server.post(`/edge/agent-job/${id}/_stop`)

/**
 * 开始任务/重试任务
 * @param type 任务类型(resourceIssue-资源下发，remoteUpgrade-远程升级，bindDevice-绑定子设备)
 * @param id 任务ID
 * @param data 状态
 */
export const startTask = (id: string, data: string[]) => server.post(`/edge/agent-job/${id}/_deploy`, data)

/**
 * 重试单个任务
 * @param id 任务ID
 * @param data 状态
 */
export const startTaskOne = (id: string, data: any) => server.post(`/edge/agent-job/tasks/${id}/_deploy`, data)

/**
 * 停止单个任务
 */
export const stopTaskOne = (id: string, data: any) => server.post(`/edge/agent-job/tasks/${id}/_stop`)

/**
 * 删除单个任务
 */
export const deleteTaskOne = (taskId: string) => server.remove(`/edge/agent-job/tasks/${taskId}/_delete`)

/**
 * 删除作业
 */
export const deleteJob = (id: string) => server.remove(`/edge/agent-job/${id}`)