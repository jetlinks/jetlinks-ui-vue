import server from '@/utils/request';
/**
 * 获取告警配置列表
 */
export const queryList = (data:any) => server.post('/alarm/config/detail/_query',data);
/**
 * 启动告警配置
 */
export const _enable = (id:string) => server.post(`/alarm/config/${id}/_enable`);
/**
 * 禁用告警配置
 */
export const _disable = (id:string) => server.post(`/alarm/config/${id}/_disable`);
/**
 * 删除告警配置
 */
export const remove = (id:string) => server.remove(`/alarm/config/${id}`);
/**
 * 手动触发告警
 */
export const _execute = (data:any) => server.post('/scene/batch/_execute',data)