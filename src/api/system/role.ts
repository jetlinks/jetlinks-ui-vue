import server from '@/utils/request';

// 获取角色列表
export const getRoleList_api = (data: any): Promise<any> => server.post(`/role/_query/`, data);
// 删除角色
export const delRole_api = (id: string): Promise<any> => server.remove(`/role/${id}`);
// 保存角色
export const saveRole_api = (data: any): Promise<any> => server.post(`/role`, data);
// 获取角色对应的权限树
export const getPrimissTree_api = (id: string): Promise<any> => server.get(`/menu/role/${id}/_grant/tree`);


// 获取用户列表
export const getUserByRole_api = (data: any): Promise<any> => server.post(`/user/_query/`, data);
// 将用户与该角色进行绑定
export const bindUser_api = (roleId:string, data: string[]): Promise<any> => server.post(`/role/${roleId}/users/_bind`, data);