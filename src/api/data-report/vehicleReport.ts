import server from '@/utils/request';

/**
 * 查询车辆列表(分页)
 * @param data 查询条件
 */
export const queryVehicleList = (data: any) =>
    server.post('/vehicle/_query', data);

/**
 * 车辆列表导出
 * @param format 格式
 * @param data 数据
 */
export const vehicleExport = (vehicleId: string, deviceId: any) =>
    server.postStream(`/vehicle/_export/${vehicleId}/${deviceId}`);

/**
 * 车辆查询
 * @param id 查询条件
 */
export const queryVehicleById = (id: any) => server.get(`/vehicle/${id}`);

/**
 * 查询车辆关联设备
 * @param id 查询条件
 */
export const queryVehicleEquipmentList = (data?: any) =>
    server.post<any>(`/vehicle/rela/device/_query`, data);
/**
 * 查询工作效率
 * @param data 查询条件
 */
export const queryVehicleWorkList = (data?: any) =>
    server.post(`/vehicle/es/work`, data);
/**
 * 查询工行驶记录
 * @param data 查询条件
 */
export const queryVehicleTravelList = (data?: any) =>
    server.post(`/vehicle/es/travel`, data);
/**
 * 查询在线离线表
 * @param data 查询条件
 */
export const queryVehicleStatusList = (data?: any) =>
    server.post(`/vehicle/es/status`, data);
