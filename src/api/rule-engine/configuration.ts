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
export const _execute = (data:any) => server.post('/scene/batch/_execute',data);
/**
 * 下拉框场景数据
 */
export const getScene = (params:Record<string,any>) => server.get('/scene/_query/no-paging?paging=false',params);
/**
 * 获取配置类型
 */
export const getTargetTypes = () => server.get('/alarm/config/target-type/supports');
/**
 * 保存基本设置
 */
export const save = (data:any) =>server.post('/alarm/config',data);
/**
 * 更新基础设置
 */
export const updata = (data:any) => server.patch('/alarm/config',data);
/**
 * 获取基础设置数据
 */
export const detail = (id:string) => server.get(`/alarm/config/${id}`);
/**
 * 解除场景联动绑定
 */
// export const unbindScene = (id:string,data:any, branchId: string) => server.post(`/alarm/rule/bind/${id}/_delete?branchIndex=${branchId}`,data); // 新解绑接口

export const unbindScene = (id:string,data:any) => server.post(`/alarm/rule/bind/${id}/_delete`,data);

export const unBindAlarm = (id: string, alarmId: string, data: any) => server.post(`/alarm/rule/bind/${alarmId}/${id}/_delete`, data)
/**
 * 保存关联场景
 */
export const bindScene = (data:any) => server.patch("/alarm/rule/bind",data)
