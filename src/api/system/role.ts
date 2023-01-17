import server from '@/utils/request';

export const getRoleList_api = (data: any): Promise<any> => server.post(`/role/_query/`, data);