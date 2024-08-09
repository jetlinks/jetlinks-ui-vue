import server from '@/utils/request';

/**
 * 车辆告警中心查询
 * @param data
 * @returns
 */
export const queryAlarmData = (data?: any) =>
    server.post(`/vehicle/alarm/es/query`, data);

/**
 * 车辆告警导出
 * @param format 类型
 * @param data  数据
 * @returns
 */
export const _export = (format: string, data: any) =>
    server.postStream(`/vehicle/alarm/es/${format}`, data);
