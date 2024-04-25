import server from '@/utils/request';

/**
 * 新增
 * @param data
 * @returns
 */
export const addDataReceive = (data: any) => server.post('/tbea/receive/sand', data);

/**
 * 修改数据
 * @param id 
 * @param data 数据接收修改数据
 * @returns
 */
export const editDataReceive = (data: any) =>
    server.put(`/tbea/receive/sand/${data.id}`, data);

/**
 * 删除数据
 * @param id 数据接收ID
 */
export const deleteDataReceive = (id: string) =>
    server.remove(`/tbea/receive/sand/${id}`);

/**
 * 查询数据接收列表(分页)
 * @param data 查询条件
 */
export const queryDataReceiveList = (data: any) =>
    server.post('/tbea/receive/sand/_query', data);

/**
 * 不分页查询设备
 * @param data 
 * @returns 
 */
export const queryNoPagingPostDevice = (data?: Record<string, any>) => server.post('/device-instance/_query/no-paging?paging=false', data)
