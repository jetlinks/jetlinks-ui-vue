import server from '@/utils/request';

/**
 * 根据设备id查询SIM卡
 * @param data
 * @returns
 */
export const queryVehicleNetwork = (data?: Record<string, any>) =>
    server.post('/vehicle/network/_query/no-paging', data);

/**
 * 根据设备ID获取设备详情
 * @param id 设备ID
 * @returns 设备详情
 */
export const getDeviceDetail = (id: string) =>
    server.get(`/device-instance/${id}/detail`);
