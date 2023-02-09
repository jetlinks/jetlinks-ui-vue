import server from '@/utils/request';

// 获取部门数据
export const getTreeData_api = (data:object) => server.post(`/organization/_all/tree`, data);
// 新增部门
export const addDepartment_api = (data:object) => server.post(`/organization`, data);
// 更新部门
export const updateDepartment_api = (data:object) => server.patch(`/organization`, data);
// 删除部门
export const delDepartment_api = (id:string) => server.remove(`/organization/${id}`);


// 获取产品列表
export const getDeviceOrProductList_api = (data:object) => server.post(`/device-product/_query`, data);
// 根据产品的id获取产品的权限
export const getPermission_api = (ids:object, id:string) => server.post(`/assets/bindings/product/org/${id}/_query`, ids);
// 获取产品的权限字典
export const getPermissionDict_api = () => server.get(`/assets/bindings/product/permissions`);