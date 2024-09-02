import { request } from '@jetlinks-web/core'

// 获取部门数据
export const getTreeData_api = (data: any) => request.post(`/organization/_all/tree`, data);
// 新增部门
export const addDepartment_api = (data: any) => request.post(`/organization`, data);
// 更新部门
export const updateDepartment_api = (data: any) => request.patch(`/organization`, data);
// 删除部门
export const delDepartment_api = (id: string) => request.remove(`/organization/${id}`);

// 用户相关
// 获取绑定用户列表
export const getBindUserList_api = (data: any) => request.post(`/user/_query`, data);
// 绑定用户
export const bindUser_api = (parentId:string,data: any) => request.post(`/organization/${parentId}/users/_bind`, data);
// 解绑用户
export const unBindUser_api = (parentId:string,data: any) => request.post(`/organization/${parentId}/users/_unbind`, data);
