import server from '@/utils/request';
/**
 * 获取今日及当月告警数量
 */
export const dashboard = (data:Record<string,any[]>)=> server.post('/dashboard/_multi',data);

/**
 * 
 */
export const getAlarm = (params:Record<string,any[]>) => server.get('/alarm/record/_query',params);

/**
 * 获取告警数量
 */
export const getAlarmConfigCount = (data:Record<string,any>) => server.post('/alarm/config/_count',data);

/**
 * 获取报警等级
 */
export const getAlarmLevel = () => server.get('/alarm/config/default/level');