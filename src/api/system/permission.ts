import server from '@/utils/request';

// 获取权限列表
export const getPermission_api = (data:object) => server.post(`/permission/_query/`,data);
// 新增时校验标识id是否可用
export const checkId_api = (data:object) => server.get(`/permission/id/_validate`,data);
// 修改权限
export const editPermission_api = (data:object) => server.patch(`/permission`,data);
// 添加权限
export const addPermission_api = (data:object) => server.post(`/permission`,data);
// 删除权限
export const delPermission_api = (id:string) => server.remove(`/permission/${id}`);