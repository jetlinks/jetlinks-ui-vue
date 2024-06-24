import server from '@/utils/request';

// 获取组织列表
export const getDepartmentList = (params: any) =>
    server.get(`/organization/_all/tree`, params);

// 添加车辆
export const addVehicle = (params: any) => server.post(`/vehicle`, params);

/**
 * 查询车辆列表(分页)
 * @param params
 *
 */
export const queryVehicleList = (params: any) =>
    server.post(`/vehicle/query/device`, params);
///vehicle/query/device

/**
 * 保存车辆和关联设备
 * @param params
 *
 */
export const saveVehicleDevices = (params: any) =>
    server.post(`/vehicle/save/device`, params);

/**
 * 查询设备数据
 * @param data 分页搜索数据
 * @returns
 */
export const queryDevices = (data?: Record<string, any>) =>
    server.post('/device-instance/_query', data);

/**
 * 不分页查询设备
 * @param data
 * @returns
 */
export const queryNoPagingPostDevice = (data?: Record<string, any>) =>
    server.post('/device-instance/_query/no-paging', data);
