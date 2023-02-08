import server from '@/utils/request';

// 获取tree数据-第一层
export const getTreeData_api = (data:object) => server.post(`/organization/_all/tree`, data);
// 新增部门
export const addDepartment_api = (data:object) => server.post(`/organization`, data);
// 更新部门
export const updateDepartment_api = (data:object) => server.patch(`/organization`, data);
// 删除部门
export const delDepartment_api = (id:string) => server.remove(`/organization/${id}`);