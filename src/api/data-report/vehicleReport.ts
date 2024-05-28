import server from '@/utils/request';

/**
 * 查询车辆列表(分页)
 * @param data 查询条件
 */
export const queryVehicleList = (data: any) =>
    server.post('/vehicle/_query', data);

/**
 * 车辆查询
 * @param id 查询条件
 */
export const queryVehicleById = (id: any) => server.get(`/vehicle/${id}`);
/**
 * 车辆查询
 * @param id 查询条件
 */
export const queryVehicleEquipment = (data: any) =>
    server.post(`/vehicle/rela/_query`, data);
