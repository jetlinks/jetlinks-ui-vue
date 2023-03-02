import server from '@/utils/request';

export const queryChannel = (type: string, data: any) =>
    server.post(`/data-collect/channel/_query`, data);

export const removeChannel = (type: string, data: any) =>
    server.remove(`/data-collect/channel//${id}`);

export const updateChannel = (type: string, data: any) =>
    server.patch(`/data-collect/channel//${id}`, data);
