import { request } from '@jetlinks-web/core'


// 获取角色列表
export const queryRoleList = (data: any): Promise<any> => request.post(`/role/_query/`, data);

// 查询所有通道配置
export const queryChannelConfig = (): Promise<any> => request.get(`/notify/channel/all-for-save`);

// 查询通知通道类型
export const queryChannelProviders = (): Promise<any> => request.get(`/notify/channel/providers`);

// 保存通道配置
export const saveChannelConfig = (data: any[]): Promise<any> => request.patch(`/notify/channel`, data);

export const updateChannelConfig = (providerId: string, data: any[]): Promise<any> => request.patch(`/notify/channel/${providerId}`, data);

export const editChannelConfig = (providerId: string, data: any): Promise<any> => request.put(`/notify/channel/${providerId}`, data);

export const actionChannelConfig = (providerId: string, type: 'enable' | 'disable'): Promise<any> => request.post(`/notify/channel/${providerId}/${type}`);

export const deleteChannelConfig = (providerId: string): Promise<any> => request.remove(`/notify/channel/${providerId}`);

export const queryConfigVariables = (providerId: string): Promise<any> => request.get(`/notify/channel/${providerId}/variables`);



