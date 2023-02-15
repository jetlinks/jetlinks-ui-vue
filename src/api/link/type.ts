import server from '@/utils/request';

export const queryNetworkConfig = (params: object) =>
    server.post(`/network/config/_query`, params);

export const remove = (id: string) => server.remove(`/network/config/${id}`);

export const shutdown = (data: object) =>
    server.post(`/network/config/${data}/_shutdown`);

export const start = (data: object) =>
    server.post(`/network/config/${data}/_start`);

export const supports = () => server.get(`/network/config/supports`);

export const query = (data: Object) => server.post(`/network/config/_query`, data);
