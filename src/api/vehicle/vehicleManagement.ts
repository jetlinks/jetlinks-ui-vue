import server from '@/utils/request';

// 获取组织列表
export const getDepartmentList = (params: any) =>
    server.get(`/organization/_all/tree`, params);

// 添加车辆
export const addVehicle = (params: any) => server.post(`/vehicle`, params);

/**
 *
 * @param params
 *
 */
export const queryVehicleList = (params: any) =>
    server.post(`/vehicle/_query`, params);
