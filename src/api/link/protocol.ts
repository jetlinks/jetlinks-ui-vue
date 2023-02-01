import server from '@/utils/request';

export const detail = (id: string) => server.get(`/gateway/device/${id}`);

export const save = (data: Object) => server.post(`/gateway/device`, data);

export const list = (data: Object) =>
    server.post(`/protocol/_query`, data);

export const remove = (id: string) => server.remove(`/gateway/device/${id}`);
