import server from '@/utils/request'
/**
 * 查询规则编排分页列表
 */
export const queryList = (data: any) => server.post('/rule-engine/instance/_query', data);

/**
 * 新增规则
 */
export const saveRule = (data: any) => server.post('/rule-editor/flows/_create',data);

/**
 * 修改规则
 */
export const modify = (id:any ,data:any) => server.put(`/rule-engine/instance/${id}`,data);

/**
 * 启动规则
 */
export const startRule = (id:string) => server.post(`/rule-engine/instance/${id}/_start`);

/**
 * 禁用规则
 */
export const stopRule = (id:string) => server.post(`/rule-engine/instance/${id}/_stop`);

/**
 * 删除规则
 */
export const deleteRule = (id:string) => server.remove(`/rule-engine/instance/${id}`)