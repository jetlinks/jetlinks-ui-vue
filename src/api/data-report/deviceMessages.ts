import server from '@/utils/request';

/**
 * 设备消息(分页)
 * @param data 查询条件
 */
export const queryDeviceLogs = (data: any) =>
    server.post('/vehicle/logs/es', data);

///vehicle/device/_query
