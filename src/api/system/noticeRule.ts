import server from '@/utils/request';

// 获取角色列表
export const queryRoleList = (data: any): Promise<any> => server.post(`/role/_query/`, data);

// 查询所有通道配置
export const queryChannelConfig = (): Promise<any> => server.get(`/notify/channel/all-for-save`);

// 查询通知通道类型
export const queryChannelProviders = (): Promise<any> => server.get(`/notify/channel/providers`);

// 保存通道配置
export const saveChannelConfig = (data: any[]): Promise<any> => server.patch(`/notify/channel`, data);

export const updateChannelConfig = (providerId: string, data: any[]): Promise<any> => server.patch(`/notify/channel/${providerId}`, data);

export const editChannelConfig = (providerId: string, data: any): Promise<any> => server.put(`/notify/channel/${providerId}`, data);

export const actionChannelConfig = (providerId: string, type: 'enable' | 'disable'): Promise<any> => server.post(`/notify/channel/${providerId}/${type}`);

export const deleteChannelConfig = (providerId: string): Promise<any> => server.remove(`/notify/channel/${providerId}`);

export const queryConfigVariables = (providerId: string): Promise<any> => server.get(`/notify/channel/${providerId}/variables`);



