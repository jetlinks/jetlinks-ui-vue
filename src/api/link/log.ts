import server from '@/utils/request';

export const queryAccess = (data: object) =>
    server.post(`/logger/access/_query`, data);

export const querySystem = (data: object) =>
    server.post(`/logger/system/_query`, data);
