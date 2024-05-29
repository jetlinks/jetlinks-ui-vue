import server from '@/utils/request';

/**
 * 设备消息(分页)
 * @param data 查询条件
 */
export const queryDeviceLogs = (data: any) =>
    server.post('/vehicle/logs/es', data);

///vehicle/device/_query

/**
 * 设备消息导出
 * @param format 格式
 * @param data 数据
 */
export const deviceLogsExport = (format: string, data: any) =>
    server.postStream(`/vehicle/logs/device/${format}`, data);
