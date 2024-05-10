import server from '@/utils/request';

/**
 * 新增工厂
 * @param data
 * @returns
 */
export const addFactory = (data: any) => server.post('/tbea/factory', data);

/**
 * 修改工厂
 * @param id 工厂ID
 * @param data
 * @returns
 */
export const editFactory = (data: any) =>
    server.put(`/tbea/factory/${data.id}`, data);

/**
 * 删除工厂
 * @param id 工厂ID
 */
export const deleteFactory = (id: string) =>
    server.remove(`/tbea/factory/${id}`);

/**
 * 查询工厂详情
 * @param id 工厂ID
 */
export const _queryFactory = (data: any) =>
    server.post(`/device-instance/_query`, data);

/**
 * 查询工厂列表(分页)
 * @param data 查询条件
 */
export const queryFactoryList = (data: any) =>
    server.post('/tbea/factory/_query', data);

/**
 * 查询工厂设备列表
 * @param data 查询条件
 */
export const getDeviceList_factory = (data: object) =>
    server.post(`/device-instance/_query`, data);

/**
 * 设备下发
 * @param id 设备id
 */
export const sandDevice = (id: string) =>
    server.get(`/tbea/receive/sand/device/${id}`);

/**
 * 产品下发
 * @param id 产品id
 */
export const sandProduct = (id: string, data: any) =>
    server.post(`/tbea/receive/sand/product/${id}`, data);

/**
 * 验证Topic是否具有唯一性
 * @param topic topic
 */

export const isTopic = (data: any) =>
    server.post(`/tbea/receive/sand/topic/_validate`, data);
