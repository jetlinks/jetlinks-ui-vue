import {request} from '@jetlinks-web/core'

// 获取tree数据-第一层
export const getTreeOne_api = () => request.get(`/v3/api-docs/swagger-config`);
// 获取tree数据-第二层
export const getTreeTwo_api = (name: string) => request.get(`/v3/api-docs/${name}`);


/**
 * 获取已授权的接口ID
 * @param id 第三方平台的ID
 */
export const getApiGranted_api = (id: string) => request.get(`/application/${id}/granted`);
/**
 * 获取可授权的接口ID
 */
export const apiOperations_api = () => request.get(`/application/operations`);

/**
 * 新增可授权的接口ID
 */
export const addOperations_api = (data: object) => request.patch(`/application/operations/_batch`, data);
/**
 * 删除可授权的接口ID
 */
export const delOperations_api = (data: object) => request.remove(`/application/operations/_batch`, {}, {data});

/**
 * 赋权-选中/取消选中api
 * @param id
 * @param type
 * @param data
 * @returns
 */
// export const updateOperations_api = (code:string,type:'_add'| '_delete', data: object) => request.post(`/application/${code}/grant/${type}`, data);

/**
 * 赋权-选中/取消选中api
 */
export const updateOperations_api = (id: string, data: object) => request.post(`/application/${id}/grant`, data)
