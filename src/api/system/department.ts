import { request } from '@jetlinks-web/core'

// 获取部门数据
export const getTreeData_api = (data: object) => request.post(`/organization/_all/tree`, data);
// 新增部门
export const addDepartment_api = (data: object) => request.post(`/organization`, data);
// 更新部门
export const updateDepartment_api = (data: any) => request.put(`/organization/${data.id}`, data);
// 删除部门
export const delDepartment_api = (id: string) => request.remove(`/organization/${id}`);


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


// 用户相关
// 获取绑定用户列表
export const getBindUserList_api = (data: object) => request.post(`/user/_query`, data);
// 绑定用户
export const bindUser_api = (parentId:string,data: object) => request.post(`/organization/${parentId}/users/_bind`, data);
// 解绑用户
export const unBindUser_api = (parentId:string,data: object) => request.post(`/organization/${parentId}/users/_unbind`, data);

