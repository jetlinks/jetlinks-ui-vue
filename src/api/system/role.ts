import request from '@/utils/request';
import server from '@/utils/request';

// 获取角色列表
export const getRoleList_api = (data: any): Promise<any> => server.post(`/role/_query/`, data);
// 删除角色
export const delRole_api = (id: string): Promise<any> => server.remove(`/role/${id}`);
// 保存角色
export const saveRole_api = (data: any): Promise<any> => server.post(`/role`, data);
// 更新角色信息
export const updateRole_api = (data: any): Promise<any> => server.patch(`/role`, data);

// 更新角色信息
export const editRole_api = (id: string, data: any): Promise<any> => server.put(`/role/${id}`, data);

// 获取角色详细信息
export const getRoleDetails_api = (id: string): Promise<any> => server.get(`/role/${id}`);
// 获取角色对应的权限树
export const getPrimissTree_api = (id: string): Promise<any> => server.get(`/menu/role/${id}/_grant/tree`);
// 更新角色对应的权限树
export const updatePrimissTree_api = (id: string, data:object): Promise<any> => server.put(`/menu/role/${id}/_grant`,data);

export const clearPrimissTree_api = (id: string, data?:object): Promise<any> => server.put(`/menu/role/${id}/iot/clear-grant`,data);

// 获取用户列表
export const getUserByRole_api = (data: any): Promise<any> => server.post(`/user/_query/`, data);
// 将用户与角色绑定
export const bindUser_api = (roleId:string, data: string[]): Promise<any> => server.post(`/role/${roleId}/users/_bind`, data);
// 将用户与角色解绑
export const unbindUser_api = (roleId:string, data: string[]): Promise<any> => server.post(`/role/${roleId}/users/_unbind`, data);
//查询分组
export const queryRoleGroup = (data:any) => request.post('/role/group/_query/no-paging',data)
//保存分组
export const saveRoleGroup = (data:any) => request.patch('/role/group',data)
//删除分组
export const deleteRoleGroup = (id:string) => request.remove(`/role/group/${id}`)