import server from '@/utils/request';

/**
 * 查询车辆设备(分页)
 * @param data 查询条件
 */
export const queryDeviceList = (data: any) =>
    server.post('/vehicle/device/_query', data);

///vehicle/device/_query

/**
 * 查询设备
 * @param id 查询条件
 */
export const getVehicleDevice = (id: any) =>
    server.get(`/vehicle/device/${id}`);

/**
 * 设备中心导出
 * @param format 格式
 * @param data 数据
 */
export const deviceExport = (name: string, format: string, data: any) =>
    server.postStream(`/vehicle/device/_export/${name}.${format}`, data);
