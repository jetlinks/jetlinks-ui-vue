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

/**
 * 更新车辆状态
 * @param params
 *
 */
export const updateVehicleStatus = (params: any) =>
    server.post(`/vehicle/save/device`, params);
///vehicle/{id}

/**
 * 删除车辆
 * @param id
 *
 */
export const deleteVehicle = (id: any) => server.remove(`/vehicle/` + id);

/**
 * 查询行驶记录
 * @param data 查询条件
 */
export const queryVehicleTravelList = (data?: any) =>
    server.post(`/vehicle/es/travel`, data);
