import server from '@/utils/request';

// 获取tree数据-第一层
export const getTreeOne_api = () => server.get(`/v3/api-docs/swagger-config`);
// 获取tree数据-第二层
export const getTreeTwo_api = (name: string) => server.get(`/v3/api-docs/${name}`);


/**
   * 获取已授权的接口ID
   * @param id 第三方平台的ID
   */
export const getApiGranted_api = (id: string) => server.get(`/application/${id}/granted`);
/**
   * 获取可授权的接口ID
   */
export const apiOperations_api = () => server.get(`/application/operations`);

/**
 * 新增可授权的接口ID
 */
export const addOperations_api = (data:object) => server.patch(`/application/operations/_batch`,data);
/**
 * 删除可授权的接口ID
 */
export const delOperations_api = (data:object) => server.remove(`/application/operations/_batch`,{},{data});

/**
 * 赋权-选中/取消选中api
 * @param id 
 * @param type 
 * @param data 
 * @returns 
 */
export const updateOperations_api = (code:string,type:'_add'| '_delete', data: object) => server.post(`/application/${code}/grant/${type}`, data);
