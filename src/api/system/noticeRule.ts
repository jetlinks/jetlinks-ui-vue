import server from '@/utils/request';

// 获取角色列表
export const queryRoleList = (data: any): Promise<any> => server.post(`/role/_query/`, data);