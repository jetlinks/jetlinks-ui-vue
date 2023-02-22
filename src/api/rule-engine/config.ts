import server from '@/utils/request';
import { LevelItem } from '@/views/rule-engine/Alarm/Config/typing';
/**
 * 查询等级
 */
export const queryLevel = () => server.get('/alarm/config/default/level');
/**
 * 保存告警等级
 */
export const saveLevel = (data:LevelItem[]) => server.patch('/alarm/config/default/level',data);
/**
 * 获取数据流转数据
 */
export const getDataExchange = (type:'consume' | 'producer') => server.get(`/alarm/config/${type}/data-exchange`);
/**
 * 保存告警数据输出
 */
export const saveOutputData =  (data:any) => server.patch('/alarm/config/data-exchange',data);