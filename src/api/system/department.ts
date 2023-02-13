import server from '@/utils/request';

// 获取部门数据
export const getTreeData_api = (data: object) => server.post(`/organization/_all/tree`, data);
// 新增部门
export const addDepartment_api = (data: object) => server.post(`/organization`, data);
// 更新部门
export const updateDepartment_api = (data: object) => server.patch(`/organization`, data);
// 删除部门
export const delDepartment_api = (id: string) => server.remove(`/organization/${id}`);


// 获取产品列表
export const getDeviceOrProductList_api = (data: object) => server.post(`/device-product/_query`, data);
// 获取设备列表
export const getDeviceList_api = (data: object) => server.post(`/device/instance/_query`, data);
// 根据产品的id获取产品的权限
export const getPermission_api = (type:'device' | 'product',ids: object, id: string) => server.post(`/assets/bindings/${type}/org/${id}/_query`, ids);
// 获取产品的权限字典
export const getPermissionDict_api = () => server.get(`/assets/bindings/product/permissions`);

// 部门绑定产品
export const bindDeviceOrProductList_api = (type: 'device' | 'product', data: object) => server.post(`/assets/bind/${type}`, data);
// 批量解绑
export const unBindDeviceOrProduct_api = (type: 'device' | 'product', data: object) => server.post(`/assets/unbind/${type}`, data);
// 批量更新权限
export const updatePermission_api = (type: 'device' | 'product', parentId: string, data: object) => server.put(`/assets/permission/${type}/org/${parentId}/_batch`, data);