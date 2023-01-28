import server from '@/utils/request';

// 获取权限列表
export const getPermission_api = (data:object) => server.post(`/permission/_query/`,data);
// 修改权限信息
export const editPermission_api = (data:object) => server.patch(`/permission`,data);