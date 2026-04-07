import { request } from '@jetlinks-web/core'
/**
 * 查询等级
 */
export const queryLevel = () => request.get('/alarm/config/default/level');
/**
 * 保存告警等级
 */
export const saveLevel = (data: any) => request.patch('/alarm/config/default/level',data);
/**
 * 获取数据流转数据
 */
export const getDataExchange = (type:'consume' | 'producer') => request.get(`/alarm/config/${type}/data-exchange`);
/**
 * 保存告警数据输出
 */
export const saveOutputData = (data:any) => request.patch('/alarm/config/data-exchange',data);
