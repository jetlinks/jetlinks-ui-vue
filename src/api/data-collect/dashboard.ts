import server from '@/utils/request';

export const queryCount = (type: string, data: any) =>
    server.post(`/data-collect/${type}/_count`, data);

export const dashboard = (data: any) => server.post(`/dashboard/_multi`, data);
