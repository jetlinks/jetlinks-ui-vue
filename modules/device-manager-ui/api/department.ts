import { request } from '@jetlinks-web/core'


// 获取所属产品列表
export const getDeviceProduct_api = (data: object) => request.get(`/device/product/_query/no-paging`, data);
// 获取产品列表
export const getDeviceOrProductList_api = (data: object) => request.post(`/device-product/_query`, data);
// 获取设备列表
export const getDeviceList_api = (data: object) => request.post(`/device/instance/_query`, data);
// 根据产品的id获取产品的权限
export const getPermission_api = (type: 'device' | 'product', ids: object, id: string) => request.post(`/assets/bindings/${type}/org/${id}/_query`, ids);
// 获取绑定的权限
export const getBindingsPermission = (type: 'device' | 'product', ids: string[]) => request.post(`/assets/bindings/${type}`, ids);
// 获取产品的权限字典
export const getPermissionDict_api = () => request.get(`/assets/bindings/product/permissions`);

// 部门绑定产品
export const bindDeviceOrProductList_api = (type: 'device' | 'product', data: object) => request.post(`/assets/bind/${type}`, data);
// 批量解绑
export const unBindDeviceOrProduct_api = (type: 'device' | 'product', data: object) => request.post(`/assets/unbind/${type}`, data);
// 批量更新权限
export const updatePermission_api = (type: 'device' | 'product', parentId: string, data: object) => request.put(`/assets/permission/${type}/org/${parentId}/_batch`, data);
