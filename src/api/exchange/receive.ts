import server from '@/utils/request';

/**
 * 新增数据
 * @param data
 * @returns
 */
export const addDataSand = (data: any) =>
    server.post('/tbea/receive/sand/_add', data);

/**
 * 修改数据
 * @param id
 * @param data 修改数据
 * @returns
 */
export const editDataSand = (data: any) =>
    server.post(`/tbea/receive/sand/_update`, data);

/**
 * 删除数据
 * @param id 数据接收ID
 */
export const deleteDataSand = (id: string) =>
    server.remove(`/tbea/receive/sand/${id}/_delete`);

/**
 * 查询数据接收列表(分页)
 * @param data 查询条件
 */
export const queryDataReceiveList = (data: any) =>
    server.post('/tbea/receive/sand/_query', data);

export const queryDataSendList = (data: any) =>
    server.post('/tbea/receive/sand/_query/no-paging', data);

/**
 * 不分页查询设备
 * @param data
 * @returns
 */
export const queryNoPagingPostDevice = (data?: Record<string, any>) =>
    server.post('/device-instance/_query/no-paging?paging=false', data);

/**
 * 根据产品id和设备id获取物模型数据
 * @param data
 * @returns
 */
export const queryDeviceProductList = (data: Record<string, any>) =>
    server.post(`/device-instance/product/detail/_query/no-paging`, data);

/**
 * 配置导入保存
 * @param data
 * 
 */
export const queryDeviceProductTarget = (data: any) =>
    server.put(`/tbea/receive/sand/target/_update`, data);

/**
 * 保存导入数据
 *
 */
export const exportSandTarget = (id: string, data: any) =>
    server.put(`/tbea/receive/sand/${id}/target`, data);

export const saveSandConfiguration = (id: string, data: any) =>
    server.put(`/tbea/receive/sand/${id}/configuration`, data);

/**
 * 保存当前映射数据
 *
 */
export const getDataSandMap = (id: any, data: any) =>
    server.put(`/tbea/receive/sand/${id}/mapping`, data);

/**
 * 查询收据收发是否选中了该数据
 *
 */
export const queryGetSendData = (data: any) =>
    server.post('/tbea/receive/sand/_query/no-paging', data);
